# SmartEcoApp - Expo Mobile Version

Aplikasi mobile native untuk scan dan identifikasi sampah dengan AI, lengkap dengan sistem poin, maps bank sampah, dan gamification.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Expo Go app di smartphone Anda ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Instalasi

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Start Expo development server:**
\`\`\`bash
npx expo start
\`\`\`

3. **Scan QR code:**
   - Buka Expo Go di smartphone
   - Scan QR code yang muncul di terminal
   - Aplikasi akan otomatis load di device Anda

## 📱 Cara Menggunakan

### Demo Mode (Tanpa Firebase)
Aplikasi berjalan dalam demo mode secara default:
- Login dengan email & password apapun
- Semua data disimpan di AsyncStorage (lokal)
- Fitur AI menggunakan dummy data

### Production Mode (Dengan Firebase)
Untuk production dengan data real:

1. **Setup Firebase:**
   - Buat project di [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage

2. **Tambahkan Firebase Config:**
   
Buat file `mobile/config/firebase.ts`:
\`\`\`typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
\`\`\`

3. **Setup Gemini AI:**
   - Dapatkan API key dari [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Tambahkan ke environment atau config file

## 🏗️ Struktur Aplikasi

\`\`\`
mobile/
├── App.tsx                 # Entry point
├── theme.ts               # Theme configuration
├── contexts/
│   └── AuthContext.tsx    # Authentication state
├── navigation/
│   └── AppNavigator.tsx   # Navigation setup
├── screens/
│   ├── LoginScreen.tsx    # Login & Register
│   ├── HomeScreen.tsx     # Dashboard
│   ├── ScanScreen.tsx     # Camera scan
│   ├── ResultScreen.tsx   # Hasil analisis
│   ├── HistoryScreen.tsx  # Riwayat scan
│   ├── MapScreen.tsx      # Bank sampah map
│   └── ProfileScreen.tsx  # User profile
└── config/
    └── firebase.ts        # Firebase config (optional)
\`\`\`

## 🎨 Fitur Utama

### 1. Authentication
- Login & Register
- Demo mode (tanpa Firebase)
- Session management dengan AsyncStorage

### 2. Home Dashboard
- User stats (scan count, berat sampah, CO₂ saved)
- Level progression system
- Quick actions
- Environmental tips

### 3. Scan Camera
- Real-time camera preview
- Frame guide untuk fokus
- Upload dari galeri
- AI analysis integration

### 4. Result Analysis
- Kategori sampah (Plastik, Kertas, Logam, etc)
- Estimasi harga per kg
- Saran pengolahan
- Input berat & save to history
- Reward poin system

### 5. History
- List semua scan
- Filter by kategori
- Search functionality
- Detail per item

### 6. Map Bank Sampah
- Google Maps integration
- Markers lokasi bank sampah
- Detail info (alamat, jam, harga beli)
- Direction & call buttons

### 7. Profile
- User stats lengkap
- Achievement badges
- Level progression
- Settings & logout

## 🔧 Customization

### Mengubah Tema
Edit `mobile/theme.ts`:
\`\`\`typescript
export const colors = {
  primary: '#10b981',      // Hijau eco
  primaryDark: '#059669',
  primaryLight: '#34d399',
  // ... customize colors
};
\`\`\`

### Menambah Kategori Sampah
Edit kategori dan warna di `mobile/theme.ts`:
\`\`\`typescript
export const colors = {
  // ... existing colors
  kategoriBarumu: '#hexcolor',
};
\`\`\`

## 📦 Dependencies Utama

- **expo** - Platform development
- **react-native-paper** - UI components
- **@react-navigation** - Navigation
- **expo-camera** - Camera access
- **expo-location** - Geolocation
- **react-native-maps** - Maps integration
- **firebase** - Backend (optional)

## 🚀 Build untuk Production

### Android APK
\`\`\`bash
eas build --platform android --profile preview
\`\`\`

### iOS IPA
\`\`\`bash
eas build --platform ios --profile preview
\`\`\`

Atau gunakan Expo Application Services (EAS) untuk build cloud.

## 🐛 Troubleshooting

### Camera tidak muncul
- Pastikan permissions granted di device settings
- Restart Expo Go app
- Clear cache: `npx expo start -c`

### Maps tidak tampil
- Pastikan Google Maps API key sudah di-setup (production)
- Check network connection

### Build error
- Clear cache: `rm -rf node_modules && npm install`
- Update Expo: `npx expo install expo@latest`

## 📄 License

MIT License - Feel free to use untuk project Anda!

## 🙏 Credits

Built with ❤️ untuk project SmartEcoApp
Powered by Expo, React Native, Firebase & Gemini AI
