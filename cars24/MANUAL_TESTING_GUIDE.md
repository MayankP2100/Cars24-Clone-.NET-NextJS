# 🧪 Manual Notification Testing Guide

## Prerequisites

✅ `.env.local` created with Firebase credentials
✅ Dev server running (`npm run dev`)
✅ Browser with notification support (Chrome, Firefox, Edge, Safari)

---

## Step-by-Step Testing

### Step 1: Start Your Dev Server

```bash
npm run dev
```

Wait for it to compile. Should see:
```
✓ Ready in 2.1s
```

### Step 2: Open the App

Navigate to: **`http://localhost:3000`**

### Step 3: Look for the Notification Bell

In the header (top-right), you should see a 🔔 bell icon.

### Step 4: Grant Notification Permission

The browser should prompt: **"localhost wants to show notifications"**

Click **"Allow"** (or "Show Notifications")

⚠️ If you don't see the prompt:
- Check DevTools Console (F12)
- Look for "Firebase not configured" message
- If you see it, verify `.env.local` has correct Firebase credentials

### Step 5: Visit the Test Page

Go to: **`http://localhost:3000/test/notifications`**

You should see a page with:
- 5 test buttons (Appointment, Bid, Price Drop, Message, Custom)
- Current notifications list
- Setup checklist

### Step 6: Trigger a Test Notification

Click: **"📅 Test Appointment Confirmation"**

### Step 7: Verify Notification Appears

You should see:
1. ✅ **In the Bell Icon**: Red badge with count (showing 1+ notifications)
2. ✅ **In the Notification Modal**: Click bell → see notification in list
3. ✅ **Browser Notification** (optional): May show as system notification depending on browser

---

## What Each Test Does

### 🔔 Test Appointment Confirmation
```
Title: "Appointment Confirmed"
Message: "Your appointment for 2021 Honda City is confirmed..."
Expected: Shows in bell and notification center
```

### 💰 Test Bid Update
```
Title: "Bid Update"
Message: "New bid of ₹650,000 received for 2019 Maruti Swift"
Expected: Shows with orange icon
```

### 📉 Test Price Drop Alert
```
Title: "Price Drop Alert!"
Message: "Price dropped from ₹1,200,000 to ₹1,150,000..."
Expected: Shows with red icon
```

### 💬 Test New Message
```
Title: "New message from John"
Message: "Is this car still available?"
Expected: Shows with blue icon
```

### ✨ Test Custom Notification
```
Title: "Custom Test Notification"
Message: "This is a test notification..."
Expected: Shows with info icon
```

---

## DevTools Verification

### Check 1: Open DevTools (F12)

Go to: **Console** tab

Look for these messages:
```
✅ "Service Worker registered"
✅ FCM Token generated
✅ Firebase messaging initialized
```

**Do NOT see:**
```
❌ "Failed to register a ServiceWorker"
❌ "Firebase not configured"
❌ 404 errors
```

### Check 2: Service Worker Status

Go to: **Application** tab → **Service Workers**

You should see:
```
firebase-messaging-sw.js - activated and running ✅
```

### Check 3: Notification Center

1. Click the bell 🔔 icon in header
2. Should open a modal showing your test notifications
3. Each notification should have:
   - Icon (appointment, bid, price, message)
   - Title
   - Message
   - Timestamp
   - Delete button (×)

---

## Testing Checklist

Run through all of these:

- [ ] Dev server started (`npm run dev`)
- [ ] `.env.local` exists with Firebase config
- [ ] App opens at `http://localhost:3000`
- [ ] Bell icon visible in header
- [ ] Browser prompted for notification permission
- [ ] Clicked "Allow"
- [ ] Visited `/test/notifications`
- [ ] Test page loads without errors
- [ ] Clicked a test button
- [ ] Notification appeared in bell
- [ ] Bell shows unread count
- [ ] Can click bell to open notification center
- [ ] Can see notification in modal
- [ ] Can delete notification (click ×)
- [ ] DevTools shows no errors
- [ ] Service Worker shows "activated and running"

---

## Testing Each Feature

### Test 1: In-App Notifications

1. Click "Test Appointment"
2. Check bell icon
3. Should show red badge with number ✅

### Test 2: Notification Center

1. Click bell icon
2. Modal opens
3. See notification list ✅

### Test 3: Delete Notification

1. Open notification center
2. Hover over notification
3. Click × button
4. Notification disappears ✅

### Test 4: Clear All

1. Open notification center
2. Click "Clear All" button
3. All notifications disappear ✅

### Test 5: Notification Preferences (Optional)

1. Later: Add preferences button to header
2. Click it
3. Toggle notification types on/off
4. Save preferences ✅

---

## Troubleshooting During Testing

### Problem: No bell icon in header

**Solution:**
- Check browser console (F12) for errors
- Verify `.env.local` exists and has Firebase config
- Restart dev server
- Hard refresh browser (Ctrl+Shift+R)

### Problem: Notification permission doesn't show

**Solution:**
- Check browser console
- Look for "Firebase not configured" message
- Verify NEXT_PUBLIC_FIREBASE_PROJECT_ID in `.env.local`
- Clear site data and try again

### Problem: Test page doesn't load

**Solution:**
- Check URL: should be `/test/notifications` (not `/test/notification`)
- Check console for errors
- Restart dev server

### Problem: Click test button but nothing happens

**Solution:**
- Check browser console
- Look for Firebase initialization errors
- Verify `.env.local` has all Firebase credentials
- Check notification permission is granted

### Problem: See "Firebase not configured" in console

**Solution:**
- This is OK! It means Firebase credentials are missing
- Add correct Firebase credentials to `.env.local`
- Restart dev server
- Try again

---

## What Should Happen

### Ideal Test Flow:
1. ✅ App loads
2. ✅ Bell icon appears
3. ✅ Permission prompt shows
4. ✅ You click "Allow"
5. ✅ Visit test page
6. ✅ Click test button
7. ✅ Notification appears in bell
8. ✅ Bell shows count (e.g., 🔔 1)
9. ✅ Click bell to see notification
10. ✅ Can delete/clear notifications

---

## Quick Verification

After completing all steps:

```
✅ Notification bell visible in header
✅ Can trigger notifications
✅ Notifications appear in modal
✅ Can delete notifications
✅ No console errors
✅ Service Worker active
✅ Everything working!
```

---

## Next Steps After Testing

Once basic testing works, you can:

1. **Test Search**
   - Type in search box
   - Trigger search notification

2. **Test Filters**
   - Change filters
   - Trigger filter-based notification

3. **Test Integration**
   - Create appointment
   - Should send notification

4. **Test Preferences**
   - Toggle notification types
   - Test each one

---

## Need More Details?

- See: `FIREBASE_QUICK_FIX.md` - Firebase setup
- See: `VERIFICATION_CHECKLIST.md` - Full checklist
- See: `src/pages/test/notifications.tsx` - Test page code
- See: `src/examples/notificationExamples.ts` - Code examples

---

## You're Ready to Test! 🚀

Everything is set up. Just:
1. Restart dev server
2. Open browser
3. Grant permission
4. Click test buttons
5. Watch notifications appear!

**Have fun testing!** 🎉

