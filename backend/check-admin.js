const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@aui.ma' },
    });

    if (!admin) {
      console.log('❌ No admin user found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Name:', admin.name);
    console.log('Display Name:', admin.displayName);
    
    // Test password
    const testPassword = 'Admin123!';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n🔐 Password Test:');
    console.log(`Password "${testPassword}":`, isMatch ? '✅ CORRECT' : '❌ WRONG');
    
    if (!isMatch) {
      console.log('\n🔄 Updating password to Admin123!...');
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await prisma.user.update({
        where: { email: 'admin@aui.ma' },
        data: { password: hashedPassword },
      });
      console.log('✅ Password updated successfully!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
