# Fixing Firebase Permissions Issues

If you're experiencing the "Limited Access Mode" error message in your application, follow these steps to fix the Firebase permissions issues:

## Option 1: Deploy Firebase Rules (Recommended)

1. **Install Firebase CLI**:

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Deploy the Firestore Rules**:

   ```bash
   firebase deploy --only firestore:rules
   ```

   This will use the `firestore.rules` file in your project to update the security rules.

## Option 2: Update Rules in Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `food-app-85f08`
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users for all documents
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

6. Click **Publish**

## Option 3: Disable Ad Blockers

If you're still experiencing issues, try:

1. Disabling any ad blockers or privacy extensions in your browser
2. Using a different browser
3. Checking your firewall settings to ensure Firebase connections are allowed

## For Production Use

The rules above allow anyone to read and write to your database, which is fine for development but not secure for production. For production, you should implement more restrictive rules like:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /comments/{commentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

These rules ensure that:

- Only authenticated users can read user data
- Users can only write to their own user document
- Anyone can read comments
- Only authenticated users can post comments
