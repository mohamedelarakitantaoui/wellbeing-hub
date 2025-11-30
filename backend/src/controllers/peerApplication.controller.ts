import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { sendApprovalEmail, sendRejectionEmail, generateSecurePassword } from '../lib/email';
import { logActivity } from '../lib/activityLogger';

// Submit peer application (public endpoint)
export const submitApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      fullName,
      auiEmail,
      school,
      major,
      yearOfStudy,
      phoneNumber,
      motivation,
      experience,
      availability,
      communicationStyle,
      studentIdFileUrl,
      agreedToTerms,
    } = req.body;

    // Validate required fields
    if (!fullName || !auiEmail || !school || !major || !yearOfStudy || 
        !phoneNumber || !motivation || !experience || !availability || 
        !communicationStyle || !agreedToTerms) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate AUI email
    if (!auiEmail.toLowerCase().endsWith('@aui.ma')) {
      return res.status(400).json({ error: 'Please use your AUI email address' });
    }

    // Check if application already exists
    const existingApplication = await prisma.peerApplication.findUnique({
      where: { auiEmail },
    });

    if (existingApplication) {
      return res.status(409).json({ 
        error: 'An application with this email already exists',
        status: existingApplication.status 
      });
    }

    // Create new application
    const application = await prisma.peerApplication.create({
      data: {
        fullName,
        auiEmail,
        school,
        major,
        yearOfStudy,
        phoneNumber,
        motivation,
        experience,
        availability,
        communicationStyle,
        studentIdFileUrl,
        agreedToTerms,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application.id,
    });
  } catch (error) {
    return next(error);
  }
};

// Get all applications with filtering (admin only)
export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;
    
    const where: any = {};
    if (status && typeof status === 'string') {
      where.status = status.toUpperCase();
    }

    const applications = await prisma.peerApplication.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' },
      ],
    });

    res.json({ applications });
  } catch (error) {
    next(error);
  }
};

// Get single application (admin only)
export const getApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const application = await prisma.peerApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    return next(error);
  }
};

// Approve application (admin only)
export const approveApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.sub;

    const application = await prisma.peerApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({ 
        error: `Application already ${application.status.toLowerCase()}` 
      });
    }

    // Check if user account already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: application.auiEmail },
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: 'User account already exists with this email. Cannot approve application.' 
      });
    }

    // Generate a secure random password
    const generatedPassword = generateSecurePassword(12);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create user account with 'moderator' role (peer supporters)
    const user = await prisma.user.create({
      data: {
        email: application.auiEmail,
        password: hashedPassword,
        name: application.fullName,
        displayName: application.fullName,
        role: 'moderator', // Peer supporters use moderator role
        ageBracket: 'ADULT',
      },
    });

    // Update application status
    const updatedApplication = await prisma.peerApplication.update({
      where: { id },
      data: {
        status: 'APPROVED',
        activationToken: null, // No longer needed since account is created
        tokenExpiresAt: null,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    // Send approval email with credentials
    const emailSent = await sendApprovalEmail(
      application.fullName,
      application.auiEmail,
      generatedPassword
    );

    if (!emailSent) {
      console.warn('⚠️ Email failed to send, but account was created successfully');
    }

    console.log(`✅ Peer application approved for ${application.fullName}`);
    console.log(`👤 Account created with email: ${application.auiEmail}`);
    console.log(`📧 Credentials sent to: ${application.auiEmail}`);

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'APPROVE_APPLICATION',
      entity: 'PeerApplication',
      entityId: id,
      metadata: JSON.stringify({ applicantEmail: application.auiEmail }),
    });

    res.json({
      message: 'Application approved and account created successfully',
      application: updatedApplication,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      emailSent,
    });
  } catch (error) {
    return next(error);
  }
};

// Reject application (admin only)
export const rejectApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user?.sub;

    const application = await prisma.peerApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({ 
        error: `Application already ${application.status.toLowerCase()}` 
      });
    }

    const rejectionReason = reason || 'Application does not meet current requirements';

    // Update application status
    const updatedApplication = await prisma.peerApplication.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    // Send rejection email
    const emailSent = await sendRejectionEmail(
      application.fullName,
      application.auiEmail,
      rejectionReason
    );

    if (!emailSent) {
      console.warn('⚠️ Rejection email failed to send');
    }

    console.log(`❌ Peer application rejected for ${application.fullName}`);
    console.log(`📧 Rejection email sent to ${application.auiEmail}`);

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'REJECT_APPLICATION',
      entity: 'PeerApplication',
      entityId: id,
      metadata: JSON.stringify({ applicantEmail: application.auiEmail, reason: rejectionReason }),
    });

    res.json({
      message: 'Application rejected',
      application: updatedApplication,
      emailSent,
    });
  } catch (error) {
    return next(error);
  }
};

// Activate peer account using token (public endpoint)
export const activatePeerAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // Find application by token
    const application = await prisma.peerApplication.findUnique({
      where: { activationToken: token },
    });

    if (!application) {
      return res.status(404).json({ error: 'Invalid activation token' });
    }

    if (application.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Application is not approved' });
    }

    // Check token expiration
    if (application.tokenExpiresAt && new Date() > application.tokenExpiresAt) {
      return res.status(400).json({ error: 'Activation token has expired' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: application.auiEmail },
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: 'User account already exists with this email' 
      });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account with 'moderator' role (peer supporters)
    const user = await prisma.user.create({
      data: {
        email: application.auiEmail,
        password: hashedPassword,
        name: application.fullName,
        displayName: application.fullName,
        role: 'moderator', // Peer supporters use moderator role
        ageBracket: 'ADULT',
      },
    });

    // Clear activation token
    await prisma.peerApplication.update({
      where: { id: application.id },
      data: {
        activationToken: null,
        tokenExpiresAt: null,
      },
    });

    console.log(`✅ Peer account activated for ${user.displayName}`);

    res.json({
      message: 'Account activated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Get application by token (public - for activation page to show applicant info)
export const getApplicationByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;

    const application = await prisma.peerApplication.findUnique({
      where: { activationToken: token },
    });

    if (!application) {
      return res.status(404).json({ error: 'Invalid activation token' });
    }

    // Check token expiration
    if (application.tokenExpiresAt && new Date() > application.tokenExpiresAt) {
      return res.status(400).json({ error: 'Activation token has expired' });
    }

    // Return only necessary info
    res.json({
      application: {
        fullName: application.fullName,
        auiEmail: application.auiEmail,
        status: application.status,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Delete application (admin only)
export const deleteApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const application = await prisma.peerApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // If the application was approved and a user was created, optionally delete the user
    if (application.status === 'APPROVED' && application.auiEmail) {
      const user = await prisma.user.findUnique({
        where: { email: application.auiEmail },
      });

      if (user) {
        // Delete the associated user account
        await prisma.user.delete({
          where: { id: user.id },
        });
        console.log(`🗑️ Deleted user account: ${user.email}`);
      }
    }

    // Delete the application
    await prisma.peerApplication.delete({
      where: { id },
    });

    console.log(`🗑️ Deleted peer application: ${application.fullName} (${application.auiEmail})`);

    // Log activity
    await logActivity({
      userId: req.user?.sub,
      action: 'DELETE_APPLICATION',
      entity: 'PeerApplication',
      entityId: id,
      metadata: JSON.stringify({ applicantEmail: application.auiEmail }),
    });

    res.json({
      message: 'Application deleted successfully',
      deletedApplication: {
        id: application.id,
        fullName: application.fullName,
        email: application.auiEmail,
      },
    });
  } catch (error) {
    return next(error);
  }
};
