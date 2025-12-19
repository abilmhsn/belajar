# Setup Guide - SmartEcoApp

Panduan lengkap untuk setup dan menjalankan SmartEcoApp di local development.

## Prerequisites

- Node.js 18+ dan npm/yarn
- Akun Firebase (free tier sudah cukup)
- Akun Google Cloud untuk Gemini API
- Git

## Step-by-Step Setup

### 1. Firebase Setup

#### A. Buat Firebase Project
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add Project" dan beri nama (contoh: smartecoapp)
3. Ikuti wizard setup (Analytics opsional)

#### B. Enable Authentication
1. Di Firebase Console, buka "Authentication"
2. Klik "Get Started"
3. Enable "Email/Password" sign-in method

#### C. Create Firestore Database
1. Buka "Firestore Database"
2. Klik "Create Database"
3. Pilih mode "Start in production mode"
4. Pilih region terdekat (asia-southeast2 untuk Indonesia)
5. Update rules untuk development:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // RiwayatScan collection
    match /riwayatScan/{scanId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // BankSampah collection (read-only for users)
    match /bankSampah/{bankId} {
      allow read: if true;
      allow write: if false; // Only admin
    }
    
    // TransaksiPoin collection
    match /transaksiPoin/{transaksiId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
\`\`\`

#### D. Setup Storage
1. Buka "Storage"
2. Klik "Get Started"
3. Pilih mode "Start in production mode"
4. Update rules:

\`\`\`
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /scans/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId 
                   && request.resource.size < 5 * 1024 * 1024 // 5MB max
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
\`\`\`

#### E. Get Firebase Config
1. Buka "Project Settings" (gear icon)
2. Scroll ke "Your apps"
3. Klik "Web" icon (</>) untuk add web app
4. Register app dengan nickname (contoh: smartecoapp-web)
5. Copy config object yang diberikan

### 2. Gemini API Setup

1. Buka [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan Google account
3. Klik "Get API Key"
4. Klik "Create API Key in new project" atau pilih existing project
5. Copy API key yang dihasilkan

### 3. Clone & Install Project

\`\`\`bash
# Clone repository (atau download ZIP)
git clone <your-repo-url>
cd SmartEcoApp

# Install dependencies
npm install
\`\`\`

### 4. Environment Variables

Buat file `.env.local` di root folder:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Gemini AI API Key (SERVER ONLY)
# IMPORTANT: The Gemini API key is a secret and MUST NOT be exposed to client-side code.
# Do NOT prefix the key with NEXT_PUBLIC_ or EXPO_PUBLIC_.
#
# For local development, you may set this in your local environment file, but keep the
# file out of version control (add to .gitignore). Prefer setting the key in your
# server environment (e.g., Vercel Environment Variables) as `GEMINI_API_KEY`.
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX

# If you accidentally committed a key to your repository or exposed it in a client
# build (for example via EXPO_PUBLIC_* or NEXT_PUBLIC_*), rotate/revoke the key
# immediately in the Google Cloud Console and create a new key restricted to
# production usage.
\`\`\`

**PENTING**: Jangan commit file `.env.local` ke Git!

### 5. Seed Initial Data (Optional)

Untuk menambahkan data bank sampah sample:

\`\`\`bash
# Install tsx untuk run TypeScript
npm install -g tsx

# Run seed script
npx tsx scripts/seed-bank-sampah.ts
\`\`\`

Script ini akan menambahkan 5 bank sampah sample ke Firestore.

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Testing the App

### 1. Register Account
- Buka app di browser
- Klik tab "Daftar"
- Isi nama, email, dan password (min 6 karakter)
- Klik "Daftar Sekarang"

### 2. Test Scan Feature
- Login dengan akun yang baru dibuat
- Klik tombol "Mulai Scan" di dashboard
- Upload gambar sampah (atau ambil foto)
- Tunggu AI menganalisis
- Review hasil dan input berat
- Klik "Simpan ke Riwayat"

### 3. Check History
- Klik icon "Riwayat" di bottom navigation
- Lihat list scan yang telah dilakukan
- Test filter dan search

### 4. Explore Map
- Klik icon "Peta" di bottom navigation
- Lihat list bank sampah (jika sudah di-seed)
- Klik salah satu untuk detail

## Troubleshooting

### Firebase Connection Issues
\`\`\`
Error: Firebase: Error (auth/configuration-not-found)
\`\`\`
**Solution**: Pastikan semua env variables sudah benar dan restart dev server.

### Gemini API Errors
\`\`\`
Error: Gemini API request failed
\`\`\`
**Solution**: 
- Pastikan GEMINI_API_KEY valid
- Check quota di Google Cloud Console
- Gemini API mungkin belum available di region Anda

### Image Upload Fails
\`\`\`
Error: Firebase Storage: unauthorized
\`\`\`
**Solution**: Update Storage rules sesuai panduan di atas.

### Firestore Permission Denied
\`\`\`
Error: Missing or insufficient permissions
\`\`\`
**Solution**: Update Firestore rules sesuai panduan di atas.

## Production Deployment

### Vercel Deployment

1. Push code ke GitHub:
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. Import project di [Vercel](https://vercel.com):
   - Connect GitHub repository
   - Add all environment variables dari `.env.local`
   - Deploy!

3. Update Firebase authorized domains:
   - Buka Firebase Console > Authentication > Settings
   - Add domain Vercel Anda (contoh: smartecoapp.vercel.app)

### Environment Variables for Production

Pastikan semua env variables ditambahkan di Vercel dashboard:
- NEXT_PUBLIC_FIREBASE_* (6 variables)
- GEMINI_API_KEY

## Best Practices

### Security
- Jangan expose API keys di client-side code
- Gunakan Firebase Rules untuk security
- Limit file upload size (sudah di-implement: 5MB max)
- Validate user input di server-side

### Performance
- Optimize images sebelum upload
- Use pagination untuk history list (consider adding)
- Cache Gemini responses jika memungkinkan
- Enable Firestore persistence untuk offline support

### Cost Optimization
- Gemini API: ~$0.00025 per request (free tier: 15 RPM)
- Firebase: Free tier cukup untuk development
- Monitor usage di console masing-masing

## Development Tips

### Add New Features
1. Create new component di `components/`
2. Add new page di `app/[feature]/page.tsx`
3. Update navigation jika perlu
4. Test authentication flow
5. Update Firestore rules jika ada collection baru

### Debugging
- Use console.log("[v0] ...") untuk debug
- Check browser console untuk errors
- Check Firebase Console untuk data issues
- Check Network tab untuk API calls

## Support

Jika menemui masalah:
1. Check troubleshooting section di atas
2. Review Firebase Console untuk errors
3. Check browser console untuk client errors
4. Review environment variables

## Next Steps

Setelah app berjalan:
1. Customize design/branding
2. Add more bank sampah data
3. Integrate real maps (Google Maps API)
4. Add push notifications
5. Implement marketplace features
6. Add social sharing

Happy coding!
