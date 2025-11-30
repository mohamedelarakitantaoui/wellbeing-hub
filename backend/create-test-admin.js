const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestAdmin() {
  try {
    // Delete existing admin if exists
    await prisma.user.deleteMany({
      where: { email: 'test@aui.ma' },
    });

    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: 'test@aui.ma',
        password: hashedPassword,
        name: 'Test Admin',
        displayName: 'Test Admin',
        role: 'admin',
        ageBracket: 'ADULT',
        consentMinorOk: true,
      },
    });

    console.log('✅ Test admin created!');
    console.log('\n📧 Login with:');
    console.log('   Email: test@aui.ma');
    console.log('   Password: test123');
    console.log('\n🔗 Login at: http://localhost:5173/login');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAdmin();
