const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteApplication() {
  try {
    const email = 'm.tantaouielaraki@aui.ma';
    
    const deleted = await prisma.peerApplication.deleteMany({
      where: { auiEmail: email }
    });
    
    console.log(`✅ Deleted ${deleted.count} application(s) with email: ${email}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteApplication();
