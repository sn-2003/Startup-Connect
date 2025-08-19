import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First, get some user IDs to associate with the reels
  const users = await prisma.user.findMany({
    take: 5, // Get 5 users
    select: { id: true }
  });

  if (users.length === 0) {
    console.warn('No users found in the database. Please seed users first.');
    return;
  }

  // Sample Instagram reel data
  const reelsData = [
    {
      instagramUrl: 'https://www.instagram.com/reel/CxYz7a2r1t2/',
      embedId: 'CxYz7a2r1t2',
      active: true,
      views: 0,
    },
    {
      instagramUrl: 'https://www.instagram.com/reel/CxYz8b3s2u1/',
      embedId: 'CxYz8b3s2u1',
      active: true,
      views: 0,
    },
    {
      instagramUrl: 'https://www.instagram.com/reel/CxYz9c4t3v0/',
      embedId: 'CxYz9c4t3v0',
      active: true,
      views: 0,
    },
    {
      instagramUrl: 'https://www.instagram.com/reel/CxYz0d5u4w9/',
      embedId: 'CxYz0d5u4w9',
      active: true,
      views: 0,
    },
    {
      instagramUrl: 'https://www.instagram.com/reel/CxYz1e6v5x8/',
      embedId: 'CxYz1e6v5x8',
      active: true,
      views: 0,
    },
  ];

  // Create reels
  const createdReels = [];
  
  for (let i = 0; i < Math.min(users.length, reelsData.length); i++) {
    const reel = await prisma.reel.create({
      data: {
        ...reelsData[i],
        userId: users[i].id,
      },
    });
    createdReels.push(reel);
  }

  console.log('Created reels:', createdReels);

  // Initialize user reel orders
  for (const user of users) {
    // Get all active reels (shuffled for variety)
    const allReels = await prisma.reel.findMany({
      where: { active: true },
      select: { id: true }
    });
    
    // Shuffle reels
    const shuffledReels = [...allReels].sort(() => 0.5 - Math.random());
    
    await prisma.userReelOrder.upsert({
      where: { userId: user.id },
      update: {
        reelOrder: shuffledReels.map(reel => reel.id),
        lastSeenIndex: -1
      },
      create: {
        userId: user.id,
        reelOrder: shuffledReels.map(reel => reel.id),
        lastSeenIndex: -1
      }
    });
  }

  console.log('Initialized user reel orders');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
