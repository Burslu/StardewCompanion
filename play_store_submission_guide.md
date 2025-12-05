# Google Play Store Submission Guide for Stardew Companion

Congratulations! You have successfully built your Android App Bundle (`app-release-bundle.aab`). Now it's time to publish it to the Google Play Store.

## Prerequisites
- **Google Play Developer Account:** You need a developer account ($25 one-time fee). [Sign up here](https://play.google.com/console/signup).
- **Privacy Policy URL:** You need a privacy policy. Since this is a simple app, you can generate a free one (e.g., using [Privicy Policy Generator](https://www.privacypolicygenerator.info/)) and host it on your Vercel site (e.g., create a `/privacy` page) or use a free hosting service.
- **Screenshots:** You need at least 2 screenshots of your app. You can take these from your phone or use the browser's responsive design mode.

## Step-by-Step Submission Process

### 1. Create the App
1.  Go to [Google Play Console](https://play.google.com/console).
2.  Click **Create app**.
3.  **App name:** `Stardew Companion` (or the name you chose).
4.  **Default language:** English (or Turkish, depending on your target).
5.  **App or Game:** App.
6.  **Free or Paid:** Free.
7.  Accept the declarations and click **Create app**.

### 2. Set up your app (Dashboard)
The dashboard will guide you through the necessary steps. You must complete all of them.

#### a. Content Rating
- Fill out the questionnaire. Since it's a guide, it's generally "Reference, News, or Educational".
- It likely has no violence, offensive language, etc.

#### b. Target Audience
- Select the appropriate age groups (e.g., 13+).
- **Important:** If you select "Children", the requirements are stricter.

#### c. News Apps
- Select "No", it is not a news app.

#### d. Data Safety (Crucial)
- You need to declare what data you collect.
- Since it's a TWA (web app), if you use Analytics (like Google Analytics on your site) or AdSense, you must declare it.
- If you don't collect any user data (no login, no tracking), you can declare that you don't collect data.

### 3. Store Listing
1.  Go to **Main store listing** in the left menu.
2.  **Short description:** A brief summary (e.g., "Your ultimate guide for Stardew Valley crops, fish, and bundles.").
3.  **Full description:** Detailed features (Crop planner, Bundle tracker, etc.).
4.  **Graphics:**
    - **App Icon:** 512x512 PNG (You can use the one from your `public` folder).
    - **Feature Graphic:** 1024x500 PNG (This is the banner shown in the store).
    - **Phone Screenshots:** Upload at least 2 screenshots.

### 4. Upload the Bundle (AAB)
1.  Go to **Production** in the left menu.
2.  Click **Create new release**.
3.  **App bundles:** Drag and drop your `app-release-bundle.aab` file here.
    - *Location:* `C:\Users\pc\StardewTWA\app-release-bundle.aab`
4.  **Release Name:** It will auto-fill (e.g., `1.0.0`).
5.  **Release Notes:** Enter a note like "Initial release of Stardew Companion".
6.  Click **Next**.

### 5. Review and Rollout
1.  If there are any errors, the console will tell you (e.g., missing privacy policy). Fix them.
2.  Warnings are usually okay to ignore for now.
3.  Click **Save**.
4.  Click **Go to publishing overview** and send your changes for review.

## Digital Asset Links Verification
Since we added the `assetlinks.json` to your website and deployed it, Google Play will automatically verify that you own the website. This removes the "Chrome" address bar, making your app look like a native application.

## Testing (Optional but Recommended)
Before releasing to Production, you can use the **Internal testing** track to send the app to yourself and friends to test. The process is the same, just select "Internal testing" instead of "Production".

## Need Help?
If you get stuck on any specific error in the Play Console, just ask!
