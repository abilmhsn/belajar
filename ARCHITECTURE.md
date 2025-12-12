# SmartEcoApp - Architecture Documentation

Dokumentasi lengkap arsitektur teknis SmartEcoApp untuk keperluan Project-Based Test.

## Overview

SmartEcoApp adalah full-stack web application yang menggunakan AI untuk identifikasi sampah dan membantu user menemukan bank sampah terdekat. App ini dibangun dengan fokus pada scalability, maintainability, dan user experience.

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: React Context API
- **Type Safety**: TypeScript 5

### Backend Services
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage (Images)
- **Authentication**: Firebase Auth
- **AI Service**: Google Gemini Pro Vision API

### Deployment
- **Platform**: Vercel (recommended)
- **Environment**: Next.js serverless functions

## Database Architecture

### 1. Users Collection
\`\`\`typescript
interface User {
  uid: string                    // Primary Key (from Firebase Auth)
  email: string
  displayName: string
  photoURL?: string
  totalPoin: number              // Gamification points
  level: "Bronze" | "Silver" | "Gold" | "Platinum"
  joinDate: Date
  lastActive: Date
  totalScanCount: number         // Aggregate metric
  totalBeratSampahKg: number     // Aggregate metric
}
\`\`\`

**Indexes**:
- uid (automatic)
- email (automatic from Auth)

**Relations**:
- One-to-Many with RiwayatScan
- One-to-Many with TransaksiPoin

### 2. RiwayatScan Collection
\`\`\`typescript
interface RiwayatScan {
  scanId: string                 // Auto-generated document ID
  userId: string                 // Foreign Key -> Users
  timestamp: Date
  
  hasilAnalisis: {
    is_sampah: boolean
    kategori_sampah: "Organik" | "Plastik" | "Kertas" | "Logam" | "B3" | "Residu"
    nama_item: string
    estimasi_harga_jual_rp_per_kg: number
    saran_pengolahan: string
    confidence_score: number
    detail_analisis: string
  }
  
  lokasi: {
    latitude: number
    longitude: number
    alamat: string
    kota: string
    provinsi: string
  }
  
  imageUrl: string               // Firebase Storage URL
  beratEstimasiKg: number
  statusPengolahan: "Belum" | "Sedang" | "Selesai"
  catatan?: string
}
\`\`\`

**Indexes**:
- userId + timestamp (composite, descending)
- kategori_sampah

**Relations**:
- Many-to-One with Users
- One-to-One with TransaksiPoin (for Scan type)

### 3. BankSampah Collection
\`\`\`typescript
interface BankSampah {
  bankSampahId: string           // Auto-generated document ID
  nama: string
  alamatLengkap: string
  
  lokasi: {
    latitude: number
    longitude: number
  }
  
  kontak: {
    telepon: string
    whatsapp: string
    email: string
  }
  
  jamOperasional: {
    buka: string                 // HH:mm format
    tutup: string                // HH:mm format
    hariLibur: string[]
  }
  
  jenisLayanan: string[]         // ["Plastik", "Kertas", ...]
  rating: number                 // 0-5
  totalTransaksi: number
  hargaBeli: Record<string, number>  // kategori -> harga
  verified: boolean
}
\`\`\`

**Indexes**:
- lokasi (geospatial - for future implementation)
- verified + rating

**Relations**:
- Standalone (no direct FK relations)

### 4. TransaksiPoin Collection
\`\`\`typescript
interface TransaksiPoin {
  transaksiId: string            // Auto-generated document ID
  userId: string                 // Foreign Key -> Users
  scanId?: string                // Foreign Key -> RiwayatScan (nullable)
  timestamp: Date
  
  tipeTransaksi: "Scan" | "Tukar" | "Bonus" | "Referral"
  poinBefore: number
  poinChange: number             // Positive or negative
  poinAfter: number
  
  keterangan: string
  metadata?: Record<string, any>
}
\`\`\`

**Indexes**:
- userId + timestamp (composite, descending)
- tipeTransaksi

**Relations**:
- Many-to-One with Users
- Many-to-One with RiwayatScan (optional)

## API Architecture

### API Routes

#### 1. POST /api/gemini-analyze
Endpoint untuk analisis gambar sampah menggunakan Gemini AI.

**Request**:
\`\`\`typescript
{
  image: string      // Base64 encoded image
  prompt: string     // Structured prompt for AI
}
\`\`\`

**Response**:
\`\`\`typescript
{
  is_sampah: boolean
  kategori_sampah: string
  nama_item: string
  estimasi_harga_jual_rp_per_kg: number
  saran_pengolahan: string
  confidence_score: number
  detail_analisis: string
}
\`\`\`

**Error Handling**:
- 500: API key not configured
- 500: Gemini API request failed
- Invalid JSON response handling

## Frontend Architecture

### Component Structure

\`\`\`
components/
├── ui/                    # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── icons.tsx             # Custom SVG icons
├── auth-gate.tsx         # Authentication wrapper
├── login-form.tsx        # Login/Register forms
├── dashboard-page.tsx    # Main dashboard
├── scan-page.tsx         # Camera & upload interface
├── result-page.tsx       # AI analysis results
├── history-page.tsx      # Scan history list
├── map-page.tsx          # Bank sampah map
└── profile-page.tsx      # User profile & stats
\`\`\`

### Context Providers

#### AuthContext
Manages authentication state and user data.

\`\`\`typescript
interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signUp: (email, password, displayName) => Promise<void>
  signIn: (email, password) => Promise<void>
  logout: () => Promise<void>
  updateUserData: (data: Partial<User>) => Promise<void>
}
\`\`\`

### State Management Pattern

1. **Global State**: AuthContext for user data
2. **Local State**: useState for component-specific data
3. **Server State**: Direct Firestore queries (no caching layer yet)

### Navigation Flow

\`\`\`
/ (HomePage)
├─ AuthGate -> Login/Register
└─ DashboardPage
   ├─ /scan -> ScanPage -> /result
   ├─ /history -> HistoryPage
   ├─ /map -> MapPage
   └─ /profile -> ProfilePage
\`\`\`

## AI Integration

### Gemini Prompt Engineering

Structured prompt untuk consistent JSON output:

\`\`\`
Anda adalah sistem AI ahli dalam identifikasi sampah...

Tugas:
1. Tentukan is_sampah (boolean)
2. Klasifikasikan kategori (6 types)
3. Estimasi harga (market-based)
4. Saran pengolahan (actionable)

Format: JSON only, no extra text
\`\`\`

### Error Handling
- JSON parsing with regex extraction
- Fallback for malformed responses
- Confidence score validation

## Security Architecture

### Authentication
- Email/Password via Firebase Auth
- Session management with HTTP-only cookies
- Password minimum 6 characters

### Authorization
- Firestore Rules for row-level security
- User can only access own data
- Bank sampah data is read-only

### Data Validation
- Client-side: Form validation
- Server-side: Firestore Rules
- Image size limit: 5MB

### API Security
- Environment variables for secrets
- API keys not exposed to client
- CORS properly configured

## Performance Optimization

### Current Implementation
- Image compression on upload
- Lazy loading for images
- Client-side caching with sessionStorage
- Firestore offline persistence (enabled by default)

### Future Optimizations
- Implement SWR for data fetching
- Add pagination for history list
- Implement virtual scrolling
- Image CDN integration
- Response caching for Gemini API

## Scalability Considerations

### Database
- Firestore scales automatically
- Composite indexes for efficient queries
- Consider sharding by userId for large scale

### Storage
- Firebase Storage scales with CDN
- Consider image optimization service
- Implement cleanup for deleted scans

### API
- Gemini API has rate limits (15 RPM free tier)
- Consider implementing queue system
- Cache common results

## Monitoring & Analytics

### Built-in
- Vercel Analytics (basic)
- Firebase Console (database metrics)

### Recommended Additions
- Error tracking (Sentry)
- Performance monitoring (Firebase Performance)
- User analytics (Google Analytics)
- Custom event tracking

## Testing Strategy

### Unit Tests (Recommended)
- Component rendering
- Utility functions
- Context providers

### Integration Tests (Recommended)
- Authentication flow
- Scan & save flow
- Data persistence

### E2E Tests (Recommended)
- Full user journey
- Cross-browser testing

## Deployment Pipeline

### Current Setup
1. Push to GitHub
2. Vercel auto-deploy
3. Environment variables set in Vercel
4. Production build

### CI/CD Enhancements (Recommended)
- Automated testing
- Linting & formatting
- TypeScript type checking
- Preview deployments for PRs

## Future Enhancements

### Phase 2 Features
- Real-time chat with bank sampah
- Marketplace for point redemption
- Social features (leaderboard, sharing)
- Push notifications
- PWA support

### Phase 3 Features
- Mobile apps (React Native)
- Admin dashboard
- Advanced analytics
- Machine learning model training
- Multi-language support

## Cost Analysis

### Firebase (Free Tier)
- Firestore: 50K reads, 20K writes/day
- Storage: 5GB storage, 1GB/day download
- Auth: Unlimited

### Gemini API
- Free tier: 15 requests/minute
- Paid: $0.00025 per request

### Vercel
- Free tier: 100GB bandwidth/month
- Serverless functions: 100 hours

**Estimated monthly cost for 1000 active users**: $0-10

## Conclusion

SmartEcoApp architecture prioritizes simplicity and scalability. Database design memenuhi kriteria 4 models dengan relasi yang jelas. Integrasi AI menggunakan best practices untuk prompt engineering. Security dan performance sudah dipertimbangkan sejak awal design.
