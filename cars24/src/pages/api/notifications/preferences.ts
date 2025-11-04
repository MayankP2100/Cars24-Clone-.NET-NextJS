// filepath: src/pages/api/notifications/preferences.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export type NotificationPreferences = {
  appointmentConfirmations: boolean;
  bidUpdates: boolean;
  priceDrop: boolean;
  newMessages: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
};

type ResponseData = NotificationPreferences | { message: string; error?: string };

const defaultPreferences: NotificationPreferences = {
  appointmentConfirmations: true,
  bidUpdates: true,
  priceDrop: true,
  newMessages: true,
  emailNotifications: false,
  smsNotifications: false,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized', error: 'No user ID' });
  }

  if (req.method === 'GET') {
    try {
      // fetch preferences from database
      // const db = getDatabase();
      // const preferences = await db.notificationPreferences.findUnique({
      //   where: { userId },
      // });

      // for now, return default preferences
      res.status(200).json(defaultPreferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  } else if (req.method === 'POST') {
    try {
      const preferences: NotificationPreferences = req.body;

      // validate preferences
      const validKeys = Object.keys(defaultPreferences);
      const receivedKeys = Object.keys(preferences);
      const isValid = receivedKeys.every((key) => validKeys.includes(key));

      if (!isValid) {
        return res.status(400).json({ message: 'Invalid preferences format', error: 'Invalid keys' });
      }

      // save preferences to database
      // const db = getDatabase();
      // await db.notificationPreferences.upsert({
      //   where: { userId },
      //   create: { userId, ...preferences },
      //   update: preferences,
      // });

      console.log(`Notification preferences updated for user ${userId}`);

      res.status(200).json(preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed', error: 'Only GET and POST allowed' });
  }
}

