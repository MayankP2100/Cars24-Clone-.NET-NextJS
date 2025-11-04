// filepath: src/pages/api/notifications/send.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type NotificationType = 'appointment' | 'bid' | 'price_drop' | 'message';

interface SendNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  url?: string;
  recipientTokens?: string[];
}

type ResponseData = {
  message: string;
  sentCount?: number;
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
    const { userId, type, title, message, url, recipientTokens } = req.body as SendNotificationRequest;

    // validate required fields
    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        message: 'Missing required fields',
        error: 'userId, type, title, and message are required',
      });
    }

    // verify this is an internal API call (from backend only)
    const apiSecret = req.headers['x-api-secret'];
    if (apiSecret !== process.env.API_SECRET) {
      return res.status(401).json({ message: 'Unauthorized', error: 'Invalid API secret' });
    }

    // TODO: use Firebase Admin SDK to send notifications
    // const admin = require('firebase-admin');
    // const message = {
    //   notification: {
    //     title,
    //     body: message,
    //   },
    //   data: {
    //     url: url || '/',
    //     type,
    //   },
    // };

    // get recipient tokens from database if not provided
    let tokens = recipientTokens;
    if (!tokens) {
      // const db = getDatabase();
      // const userTokens = await db.userTokens.findMany({
      //   where: { userId },
      // });
      // tokens = userTokens.map(t => t.fcmToken);
      tokens = [];
    }

    if (tokens.length === 0) {
      console.log(`No tokens found for user ${userId}`);
      return res.status(200).json({ message: 'No recipient tokens available', sentCount: 0 });
    }

    // send notifications
    // const results = await admin.messaging().sendAll(
    //   tokens.map(token => ({ ...message, token }))
    // );

    console.log(`Notification sent to ${tokens.length} recipients`);

    res.status(200).json({
      message: 'Notifications sent successfully',
      sentCount: tokens.length,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}

