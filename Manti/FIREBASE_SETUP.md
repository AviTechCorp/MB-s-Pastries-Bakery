# Firebase setup for the bakery sites

The admin and customer pages can live in separate GitHub repositories. Both connect to the same Firebase project and the same Firestore document, `sites/mbs-pastries-and-bakery`. Firestore listeners publish menu and settings changes to open customer pages in real time. Gallery uploads use Firebase Storage.

## One-time Firebase setup

1. In the Firebase console for `mb-s-pastries-and-bakery`, create a Firestore database and enable Firebase Storage.
2. In **Authentication → Sign-in method**, enable **Email/Password**. The admin sign-in screen has a **Create admin account** button; it is restricted to `mbspastriesandbakery@gmail.com` and requires verifying access to that mailbox.
3. Create the Firebase Authentication account with `mbspastriesandbakery@gmail.com`. This email is already configured as the admin allowlist in `admin/app.js`, `firestore.rules`, and `storage.rules`. If you use another email, update it in all three places.
4. Deploy the rules from this folder:

   ```powershell
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules,storage
   ```

5. The customer link in `admin/app.js` is configured as `https://avitechcorp.github.io/MB-s-Pastries-Bakery/`. Update it there if the customer site URL changes.

The Firebase web config in each `app.js` is public client configuration, not an admin credential. The Firestore and Storage rules are what protect writes. Never put a Firebase service-account key in either website.

## Publish the two GitHub Pages sites

- Customer repository: publish `customer.html` as the Pages entry point (usually rename it to `index.html`), copy `customer/app.js` beside it, and include the existing bakery image files if using the starter gallery.
- Admin repository: publish `admin.html` as the Pages entry point, copy `admin/app.js` beside it, and keep the configured customer URL pointing at the customer Pages site.
- Both copies of `app.js` must use the same Firebase project configuration. Keep each page's `app.js` next to that page so `./app.js` resolves correctly.

On the admin's first successful sign-in, the app creates the shared Firestore document with the starter menu and gallery. Later admin edits are written to Firestore; customers receive them through the live listener, regardless of browser or device. Existing `localStorage` data is not automatically visible to the new Firebase project, because it is isolated to the old browser origin. Add/migrate any content that needs to be preserved after the first setup.

Customer order enquiries are saved in Firestore and visible in the admin's Orders tab. The public can create an enquiry but cannot read, change, or delete enquiries. Menu/settings are public because they are displayed on the customer site.

After creating the admin account, open the verification link in the email before signing in. The Firestore and Storage rules also require Firebase's verified-email claim. If verification or sign-in fails, add the GitHub Pages hostname to **Authentication → Settings → Authorized domains**.

The admin signs in to Firebase Authentication first, then connects to Firestore. If the dashboard says the client is offline, the account may already be signed in: confirm that the Firestore database has been created for this same Firebase project, check that the browser can connect to `firestore.googleapis.com`, and use the dashboard's **Retry connection** button. Keep the updated `firestore.rules` deployed as well.

If Firebase reports `permission-denied`, confirm the deployed rules use the exact same admin email as `ADMIN_EMAIL`. Keep App Check enabled/configured where possible to help reduce automated abuse of the public order form.
