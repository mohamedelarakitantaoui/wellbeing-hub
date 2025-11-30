const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function debugRoomAccess() {
  try {
    console.log('\n=== Debugging Room Access ===\n');

    // Get all rooms with student and supporter details
    const rooms = await prisma.supportRoom.findMany({
      include: {
        student: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        supporter: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Total rooms: ${rooms.length}\n`);

    rooms.forEach((room, index) => {
      console.log(`${index + 1}. Room ID: ${room.id}`);
      console.log(`   Status: ${room.status}`);
      console.log(`   Student ID: ${room.studentId}`);
      console.log(`   Student: ${room.student.displayName} (${room.student.email})`);
      console.log(`   Supporter ID: ${room.supporterId || 'NONE'}`);
      if (room.supporter) {
        console.log(`   Supporter: ${room.supporter.displayName} (${room.supporter.email})`);
      }
      console.log('');
    });

    // Get all users
    console.log('\n=== All Users ===\n');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        email: true,
        role: true,
      },
      orderBy: { displayName: 'asc' },
    });

    users.forEach((user) => {
      console.log(`- ${user.displayName} (${user.role})`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugRoomAccess();
