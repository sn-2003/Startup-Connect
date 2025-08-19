import { prisma } from './prisma';

export interface CoinAction {
  action: string;
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

// Define coin rewards for different actions
export const COIN_REWARDS = {
  // Profile completion
  PROFILE_COMPLETE: { amount: 50, description: 'Completed your profile' },
  RESUME_UPLOAD: { amount: 30, description: 'Uploaded your resume' },
  PROFILE_UPDATE: { amount: 10, description: 'Updated your profile' },
  
  // Startup actions
  STARTUP_CREATE: { amount: 100, description: 'Created a startup profile' },
  STARTUP_UPDATE: { amount: 20, description: 'Updated startup information' },
  STARTUP_LOGO_UPLOAD: { amount: 25, description: 'Added startup logo' },
  STARTUP_PROMO_UPLOAD: { amount: 15, description: 'Added promotional image' },
  
  // Job actions
  JOB_CREATE: { amount: 75, description: 'Posted a new job' },
  JOB_UPDATE: { amount: 15, description: 'Updated job posting' },
  JOB_APPLICATION: { amount: 25, description: 'Applied to a job' },
  
  // Social actions
  STARTUP_VOTE: { amount: 5, description: 'Voted on a startup' },
  STARTUP_FEEDBACK: { amount: 15, description: 'Provided startup feedback' },
  
  // Engagement actions
  NEWS_READ: { amount: 2, description: 'Read a news article' },
  NEWS_SAVE: { amount: 5, description: 'Saved a news article' },
  TOOL_RATE: { amount: 10, description: 'Rated a tool' },
  TOOL_REVIEW: { amount: 20, description: 'Reviewed a tool' },
  
  // AI Mentor usage
  AI_CHAT: { amount: 3, description: 'Used AI mentor' },
  
  // Daily/Weekly bonuses
  DAILY_LOGIN: { amount: 10, description: 'Daily login bonus' },
  WEEKLY_ACTIVE: { amount: 50, description: 'Weekly activity bonus' },
  
  // Milestones
  FIRST_APPLICATION: { amount: 100, description: 'First job application milestone' },
  FIRST_STARTUP: { amount: 150, description: 'First startup creation milestone' },
  PROFILE_VIEWS_100: { amount: 200, description: '100 profile views milestone' },
} as const;

export type CoinActionType = keyof typeof COIN_REWARDS;

export class CoinSystem {
  /**
   * Award coins to a user for a specific action
   */
  static async awardCoins(
    userId: string, 
    actionType: CoinActionType, 
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; newBalance: number; transaction?: any }> {
    try {
      const reward = COIN_REWARDS[actionType];
      if (!reward) {
        throw new Error(`Unknown coin action: ${actionType}`);
      }

      // Check for duplicate actions that shouldn't be rewarded multiple times
      if (await this.shouldSkipDuplicateAction(userId, actionType, metadata)) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { coins: true }
        });
        return { 
          success: false, 
          newBalance: user?.coins || 0 
        };
      }

      // Use transaction to ensure consistency
      const result = await prisma.$transaction(async (tx) => {
        // Create coin transaction record
        const transaction = await tx.coinTransaction.create({
          data: {
            userId,
            amount: reward.amount,
            action: actionType,
            description: reward.description,
            metadata: metadata || {},
          },
        });

        // Update user's coin balance
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            coins: {
              increment: reward.amount,
            },
          },
          select: { coins: true },
        });

        return { transaction, newBalance: updatedUser.coins };
      });

      console.log(`💰 Awarded ${reward.amount} coins to user ${userId} for ${actionType}`);
      
      return {
        success: true,
        newBalance: result.newBalance,
        transaction: result.transaction,
      };
    } catch (error) {
      console.error('Error awarding coins:', error);
      return { 
        success: false, 
        newBalance: 0 
      };
    }
  }

  /**
   * Get user's current coin balance
   */
  static async getUserBalance(userId: string): Promise<number> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { coins: true },
      });
      return user?.coins || 0;
    } catch (error) {
      console.error('Error getting user balance:', error);
      return 0;
    }
  }

  /**
   * Get user's coin transaction history
   */
  static async getUserTransactions(
    userId: string, 
    limit: number = 50
  ): Promise<any[]> {
    try {
      return await prisma.coinTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  }

  /**
   * Check if we should skip awarding coins for duplicate actions
   */
  private static async shouldSkipDuplicateAction(
    userId: string, 
    actionType: CoinActionType, 
    metadata?: Record<string, any>
  ): Promise<boolean> {
    // Actions that should only be rewarded once
    const onceOnlyActions: CoinActionType[] = [
      'FIRST_APPLICATION',
      'FIRST_STARTUP',
      'PROFILE_COMPLETE',
    ];

    if (onceOnlyActions.includes(actionType)) {
      const existingTransaction = await prisma.coinTransaction.findFirst({
        where: {
          userId,
          action: actionType,
        },
      });
      return !!existingTransaction;
    }

    // Daily login should only be rewarded once per day
    if (actionType === 'DAILY_LOGIN') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayTransaction = await prisma.coinTransaction.findFirst({
        where: {
          userId,
          action: actionType,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
      return !!todayTransaction;
    }

    // Some actions should be limited per entity (e.g., one vote per startup)
    if (actionType === 'STARTUP_VOTE' && metadata?.startupId) {
      const existingVote = await prisma.coinTransaction.findFirst({
        where: {
          userId,
          action: actionType,
          metadata: {
            path: ['startupId'],
            equals: metadata.startupId,
          },
        },
      });
      return !!existingVote;
    }

    // Tool rating should be limited to once per tool
    if ((actionType === 'TOOL_RATE' || actionType === 'TOOL_REVIEW') && metadata?.toolId) {
      const existingRating = await prisma.coinTransaction.findFirst({
        where: {
          userId,
          action: actionType,
          metadata: {
            path: ['toolId'],
            equals: metadata.toolId,
          },
        },
      });
      return !!existingRating;
    }

    return false;
  }

  /**
   * Award milestone coins based on user achievements
   */
  static async checkAndAwardMilestones(userId: string): Promise<void> {
    try {
      // Check for first application milestone
      const applicationCount = await prisma.application.count({
        where: { userId },
      });
      if (applicationCount === 1) {
        await this.awardCoins(userId, 'FIRST_APPLICATION');
      }

      // Check for first startup milestone
      const startupCount = await prisma.startup.count({
        where: { userId },
      });
      if (startupCount === 1) {
        await this.awardCoins(userId, 'FIRST_STARTUP');
      }

      // Check for profile completion milestone
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { resume: true },
      });
      
      if (user && this.isProfileComplete(user)) {
        await this.awardCoins(userId, 'PROFILE_COMPLETE');
      }
    } catch (error) {
      console.error('Error checking milestones:', error);
    }
  }

  /**
   * Check if user profile is complete
   */
  private static isProfileComplete(user: any): boolean {
    return !!(
      user.name &&
      user.email &&
      user.resume?.pdfUrl &&
      (user.linkedin || user.github || user.website)
    );
  }

  /**
   * Get leaderboard of top coin earners
   */
  static async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          coins: true,
        },
        orderBy: { coins: 'desc' },
        take: limit,
        where: {
          coins: { gt: 0 },
        },
      });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }
}

// Export a singleton instance of CoinSystem
export const coinSystem = new CoinSystem();