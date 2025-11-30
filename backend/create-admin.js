/**
 * Quick script to create an admin user
 * Run with: node create-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminEmail = 'admin@aui.ma';
    const adminPassword = 'Admin123!';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminEmail);
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      
      if (existingAdmin.role !== 'admin') {
        console.log('\n🔄 Updating user role to admin...');
        await prisma.user.update({
          where: { email: adminEmail },
          data: { role: 'admin' },
        });
        console.log('✅ User role updated to admin!');
      }
      
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        displayName: 'Administrator',
        role: 'admin',
        ageBracket: 'ADULT',
        consentMinorOk: true,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('\n🔗 Login at: http://localhost:5173/login');
    console.log('🔗 Admin Panel: http://localhost:5173/admin/peers');
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
