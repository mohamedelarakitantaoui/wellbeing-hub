const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRooms() {
  try {
    const rooms = await prisma.supportRoom.findMany({
      include: {
        student: { select: { displayName: true } },
        supporter: { select: { displayName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('\n=== Support Rooms in Database ===\n');
    console.log('Total rooms:', rooms.length);
    
    rooms.forEach((r, i) => {
      console.log(`\n${i+1}. Room ID: ${r.id}`);
      console.log(`   Student: ${r.student.displayName}`);
      console.log(`   Supporter: ${r.supporter?.displayName || 'None'}`);
      console.log(`   Status: ${r.status}`);
      console.log(`   Topic: ${r.topic}`);
      console.log(`   Created: ${r.createdAt}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRooms();
