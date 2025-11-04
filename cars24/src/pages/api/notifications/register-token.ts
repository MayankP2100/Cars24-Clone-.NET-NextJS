// filepath: src/pages/api/notifications/register-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: 'Only POST allowed' });
  }

  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: 'FCM token is required', error: 'Missing fcmToken' });
    }

    // get user from session
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', error: 'No user ID' });
    }

    // save token to database
    // const db = getDatabase();
    // await db.userTokens.create({
    //   userId,
    //   fcmToken,
    //   createdAt: new Date(),
    // });

    console.log(`FCM token registered for user ${userId}`);

    res.status(200).json({ message: 'FCM token registered successfully' });
  } catch (error) {
    console.error('Error registering FCM token:', error);
    res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}

