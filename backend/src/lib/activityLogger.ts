import prisma from './prisma';

interface LogActivityParams {
  userId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: string;
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        entity: params.entity || null,
        entityId: params.entityId || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        metadata: params.metadata || null,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - logging should not break the main flow
  }
}
