const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMessages() {
  try {
    const messages = await prisma.supportMessage.findMany({
      include: {
        sender: {
          select: { id: true, displayName: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    console.log('\n=== Last 10 Support Messages ===\n');
    
    if (messages.length === 0) {
      console.log('No support messages found in database.');
    } else {
      messages.forEach((msg, i) => {
        console.log(`${i + 1}. ${msg.sender.displayName} (${msg.sender.role}): ${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}`);
        console.log(`   Room ID: ${msg.roomId}`);
        console.log(`   Created: ${msg.createdAt}`);
        console.log('');
      });
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkMessages();
