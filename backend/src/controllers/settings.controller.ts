import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { logActivity } from '../lib/activityLogger';

// Get all settings or by category
export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.query;

    const where: any = {};
    if (category && typeof category === 'string') {
      where.category = category;
    }

    const settings = await prisma.platformSettings.findMany({
      where,
      orderBy: { category: 'asc' },
    });

    // Group settings by category
    const groupedSettings: any = {};
    settings.forEach((setting: any) => {
      if (!groupedSettings[setting.category]) {
        groupedSettings[setting.category] = [];
      }
      groupedSettings[setting.category].push({
        key: setting.key,
        value: tryParseJSON(setting.value),
        description: setting.description,
        updatedAt: setting.updatedAt,
      });
    });

    res.json({ settings: groupedSettings, allSettings: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update setting
export const updateSetting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { key, value, category, description } = req.body;

    if (!key || value === undefined) {
      res.status(400).json({ error: 'Key and value are required' });
      return;
    }

    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);

    const setting = await prisma.platformSettings.upsert({
      where: { key },
      update: {
        value: valueStr,
        updatedBy: req.user?.sub,
      },
      create: {
        key,
        value: valueStr,
        category: category || 'GENERAL',
        description: description || null,
        updatedBy: req.user?.sub,
      },
    });

    // Log activity
    await logActivity({
      userId: req.user?.sub,
      action: 'UPDATE_SETTINGS',
      entity: 'PlatformSettings',
      entityId: setting.id,
      metadata: JSON.stringify({ key, category: setting.category }),
    });

    res.json({ setting });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Batch update settings
export const batchUpdateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { settings } = req.body;

    if (!Array.isArray(settings) || settings.length === 0) {
      res.status(400).json({ error: 'Settings array is required' });
      return;
    }

    const updates = settings.map(async (s: any) => {
      const valueStr = typeof s.value === 'string' ? s.value : JSON.stringify(s.value);
      
      return prisma.platformSettings.upsert({
        where: { key: s.key },
        update: {
          value: valueStr,
          updatedBy: req.user?.sub,
        },
        create: {
          key: s.key,
          value: valueStr,
          category: s.category || 'GENERAL',
          description: s.description || null,
          updatedBy: req.user?.sub,
        },
      });
    });

    await Promise.all(updates);

    // Log activity
    await logActivity({
      userId: req.user?.sub,
      action: 'BATCH_UPDATE_SETTINGS',
      entity: 'PlatformSettings',
      metadata: JSON.stringify({ count: settings.length }),
    });

    res.json({ message: 'Settings updated successfully', count: settings.length });
  } catch (error) {
    console.error('Batch update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Initialize default settings if they don't exist
export const initializeDefaultSettings = async (): Promise<void> => {
  try {
    const defaultSettings = [
      // GENERAL
      { key: 'MAX_SESSIONS_PER_DAY', value: '10', category: 'GENERAL', description: 'Maximum sessions a counselor can have per day' },
      { key: 'SESSION_DURATION_MINUTES', value: '60', category: 'GENERAL', description: 'Default session duration in minutes' },
      { key: 'PLATFORM_NAME', value: 'AUI Hearts & Minds', category: 'GENERAL', description: 'Platform display name' },
      
      // SUPPORT
      { key: 'MAX_WAITING_ROOM_SIZE', value: '50', category: 'SUPPORT', description: 'Maximum number of students in waiting room' },
      { key: 'AUTO_ASSIGN_COUNSELORS', value: 'true', category: 'SUPPORT', description: 'Automatically assign counselors to waiting students' },
      { key: 'CRISIS_ESCALATION_THRESHOLD', value: '5', category: 'SUPPORT', description: 'Minutes before crisis alert escalates' },
      
      // PLATFORM
      { key: 'MAINTENANCE_MODE', value: 'false', category: 'PLATFORM', description: 'Enable maintenance mode' },
      { key: 'ALLOW_NEW_REGISTRATIONS', value: 'true', category: 'PLATFORM', description: 'Allow new user registrations' },
      { key: 'PRIMARY_COLOR', value: '#006341', category: 'PLATFORM', description: 'Primary brand color' },
      
      // EMAILS
      { key: 'SMTP_HOST', value: 'smtp.gmail.com', category: 'EMAILS', description: 'SMTP server host' },
      { key: 'SMTP_PORT', value: '587', category: 'EMAILS', description: 'SMTP server port' },
      { key: 'EMAIL_FROM_NAME', value: 'AUI Hearts & Minds', category: 'EMAILS', description: 'Email sender name' },
      
      // SECURITY
      { key: 'RATE_LIMIT_REQUESTS', value: '100', category: 'SECURITY', description: 'Max requests per minute per IP' },
      { key: 'SESSION_TIMEOUT_HOURS', value: '24', category: 'SECURITY', description: 'User session timeout in hours' },
      { key: 'REQUIRE_EMAIL_VERIFICATION', value: 'false', category: 'SECURITY', description: 'Require email verification for new users' },
    ];

    for (const setting of defaultSettings) {
      const existing = await prisma.platformSettings.findUnique({
        where: { key: setting.key },
      });

      if (!existing) {
        await prisma.platformSettings.create({
          data: setting,
        });
      }
    }

    console.log('✅ Default settings initialized');
  } catch (error) {
    console.error('Initialize default settings error:', error);
  }
};

// Helper function to parse JSON
function tryParseJSON(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
