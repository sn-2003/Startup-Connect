import { prisma } from './prisma';
import type { UserReelOrder, Reel, User } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

// Type guard to check if a JsonValue is a string array
function isStringArray(value: JsonValue): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

// Define a more specific type for reels with partial user data
type ReelWithPartialUser = Reel & { user: Pick<User, 'id' | 'name'> };

export interface ReelFeedManager {
  getUserReelFeed(userId: string, page?: number, limit?: number): Promise<{
    reels: ReelWithPartialUser[];
    currentIndex: number;
    hasMore: boolean;
  }>;
  updateUserProgress(userId: string, reelId: string, index: number): Promise<void>;
  handleReelDeleted(reelId: string): Promise<void>;
  handleReelAdded(reelId: string): Promise<void>;
  resetUserFeed(userId: string): Promise<void>;
}

class ReelFeedManagerImpl implements ReelFeedManager {
  private prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }
  
  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get or create user's reel order
   */
  private async getOrCreateUserReelOrder(userId: string): Promise<UserReelOrder> {
    let userOrder = await prisma.userReelOrder.findUnique({
      where: { userId }
    });

    if (!userOrder) {
      // First time user - create shuffled order
      const activeReels = await prisma.reel.findMany({
        where: { active: true },
        select: { id: true },
        orderBy: { createdAt: 'desc' }
      });

      const shuffledReelIds = this.shuffleArray(activeReels.map(r => r.id));

      userOrder = await prisma.userReelOrder.create({
        data: {
          userId,
          reelOrder: shuffledReelIds,
          lastSeenIndex: -1
        }
      });
    }

    return userOrder;
  }

  /**
   * Get user's personalized reel feed starting from where they left off
   */
  async getUserReelFeed(userId: string, page: number = 1, limit: number = 10): Promise<{
    reels: ReelWithPartialUser[];
    currentIndex: number;
    hasMore: boolean;
  }> {
    const userOrder = await this.getOrCreateUserReelOrder(userId);
    const reelIds = isStringArray(userOrder.reelOrder) ? userOrder.reelOrder : [];
    const startIndex = (page - 1) * limit;

    if (startIndex >= reelIds.length) {
      return {
        reels: [],
        currentIndex: startIndex,
        hasMore: false
      };
    }

    const batchSize = limit;
    const endIndex = Math.min(startIndex + batchSize, reelIds.length);
    const batchReelIds = reelIds.slice(startIndex, endIndex);

    // Fetch reel details
    const reels = await prisma.reel.findMany({
      where: {
        id: { in: batchReelIds },
        active: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Sort reels according to user's order
    const sortedReels = batchReelIds
      .map(id => reels.find(r => r.id === id))
      .filter((reel): reel is ReelWithPartialUser => !!reel);

    return {
      reels: sortedReels,
      currentIndex: startIndex,
      hasMore: endIndex < reelIds.length
    };
  }

  /**
   * Update user's progress when they watch a reel
   */
  async updateUserProgress(userId: string, reelId: string, index: number): Promise<void> {
    await prisma.userReelOrder.update({
      where: { userId },
      data: {
        lastSeenIndex: index,
        updatedAt: new Date()
      }
    });

    // Increment view count for the reel
    await prisma.reel.update({
      where: { id: reelId },
      data: {
        views: { increment: 1 }
      }
    });
  }

  /**
   * Handle when a reel is deleted - remove from all user orders
   */
  async handleReelDeleted(reelId: string): Promise<void> {
    const userOrders = await prisma.userReelOrder.findMany();

    for (const userOrder of userOrders) {
      const reelIds = isStringArray(userOrder.reelOrder) ? userOrder.reelOrder : [];
      const deletedIndex = reelIds.indexOf(reelId);

      if (deletedIndex !== -1) {
        // Remove the deleted reel from order
        const newReelOrder = reelIds.filter(id => id !== reelId);
        
        // Adjust lastSeenIndex if necessary
        let newLastSeenIndex = userOrder.lastSeenIndex;
        if (deletedIndex <= userOrder.lastSeenIndex) {
          newLastSeenIndex = Math.max(-1, userOrder.lastSeenIndex - 1);
        }

        await prisma.userReelOrder.update({
          where: { id: userOrder.id },
          data: {
            reelOrder: newReelOrder,
            lastSeenIndex: newLastSeenIndex,
            updatedAt: new Date()
          }
        });
      }
    }
  }

  /**
   * Handle when a new reel is added - add to all user orders
   */
  async handleReelAdded(reelId: string): Promise<void> {
    const userOrders = await prisma.userReelOrder.findMany();

    for (const userOrder of userOrders) {
      const reelIds = isStringArray(userOrder.reelOrder) ? userOrder.reelOrder : [];
      
      // Add new reel at a random position (or at the end for simplicity)
      const insertPosition = Math.floor(Math.random() * (reelIds.length + 1));
      const newReelOrder = [
        ...reelIds.slice(0, insertPosition),
        reelId,
        ...reelIds.slice(insertPosition)
      ];

      await prisma.userReelOrder.update({
        where: { id: userOrder.id },
        data: {
          reelOrder: newReelOrder,
          updatedAt: new Date()
        }
      });
    }
  }

  /**
   * Reset user's feed - reshuffle all reels and start over
   */
  async resetUserFeed(userId: string): Promise<void> {
    const activeReels = await prisma.reel.findMany({
      where: { active: true },
      select: { id: true },
      orderBy: { createdAt: 'desc' }
    });

    const shuffledReelIds = this.shuffleArray(activeReels.map(r => r.id));

    await prisma.userReelOrder.upsert({
      where: { userId },
      update: {
        reelOrder: shuffledReelIds,
        lastSeenIndex: -1,
        updatedAt: new Date()
      },
      create: {
        userId,
        reelOrder: shuffledReelIds,
        lastSeenIndex: -1
      }
    });
  }

  /**
   * Get user's current position in their feed
   */
  async getUserFeedPosition(userId: string): Promise<{
    totalReels: number;
    currentPosition: number;
    remainingReels: number;
  }> {
    const userOrder = await this.getOrCreateUserReelOrder(userId);
    const reelIds = isStringArray(userOrder.reelOrder) ? userOrder.reelOrder : [];
    const currentPosition = userOrder.lastSeenIndex + 1;

    return {
      totalReels: reelIds.length,
      currentPosition,
      remainingReels: Math.max(0, reelIds.length - currentPosition)
    };
  }

  /**
   * Sync user's reel order with current active reels
   * Call this periodically to ensure consistency
   */
  async syncUserReelOrder(userId: string): Promise<void> {
    const userOrder = await this.getOrCreateUserReelOrder(userId);
    const currentReelIds = isStringArray(userOrder.reelOrder) ? userOrder.reelOrder : [];

    // Get all currently active reels
    const activeReels = await prisma.reel.findMany({
      where: { active: true },
      select: { id: true }
    });
    const activeReelIds = activeReels.map(r => r.id);

    // Remove inactive reels from user's order
    const validReelIds = currentReelIds.filter(id => activeReelIds.includes(id));

    // Add any new reels that aren't in user's order
    const newReelIds = activeReelIds.filter(id => !currentReelIds.includes(id));
    
    if (newReelIds.length > 0) {
      // Shuffle new reels and insert at random positions
      const shuffledNewReels = this.shuffleArray(newReelIds);
      const updatedOrder = [...validReelIds];
      
      shuffledNewReels.forEach(reelId => {
        const insertPosition = Math.floor(Math.random() * (updatedOrder.length + 1));
        updatedOrder.splice(insertPosition, 0, reelId);
      });

      await prisma.userReelOrder.update({
        where: { userId },
        data: {
          reelOrder: updatedOrder,
          updatedAt: new Date()
        }
      });
    } else if (validReelIds.length !== currentReelIds.length) {
      // Only update if reels were removed
      await prisma.userReelOrder.update({
        where: { userId },
        data: {
          reelOrder: validReelIds,
          lastSeenIndex: Math.min(userOrder.lastSeenIndex, validReelIds.length - 1),
          updatedAt: new Date()
        }
      });
    }
  }
}

export const reelFeedManager = new ReelFeedManagerImpl();