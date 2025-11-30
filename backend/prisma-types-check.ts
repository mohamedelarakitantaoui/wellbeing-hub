// This file is used to verify Prisma types are properly generated
import prisma from './src/lib/prisma';

// Check if all models are accessible
const checkTypes = async () => {
  // These should all be recognized by TypeScript
  await prisma.user.findMany();
  await prisma.triageForm.findMany();
  await prisma.booking.findMany();
  await prisma.peerRoom.findMany();
  await prisma.peerMessage.findMany();
  await prisma.crisisAlert.findMany();
  await prisma.auditLog.findMany();
  await prisma.supportRoom.findMany();
  await prisma.supportMessage.findMany();
  await prisma.peerApplication.findMany(); // This should work
  await prisma.peerTutor.findMany();
};

checkTypes();
