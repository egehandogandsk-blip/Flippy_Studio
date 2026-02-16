# Studio Forge - SaaS Infrastructure Setup Guide

Bu dokümanda Vercel'e deploy etmeden önce tamamlanması gereken adımlar bulunmaktadır.

## 🔴 KRİTİK ADIMLAR

### 1. Supabase Database Password
`.env.local` dosyasındaki `DATABASE_URL` içinde `[YOUR-PASSWORD]` kısmını Supabase database şifrenizle değiştirin.

```env
DATABASE_URL=postgresql://postgres:GERÇEK_ŞİFRENİZ@db.lhopcbrafxzdkzvjhiwp.supabase.co:5432/postgres
```

### 2. Stripe Products Oluşturma

Stripe Dashboard'a gidin ve şu ürünleri oluşturun:

1. **Forge Starter** - $9/month
   - Product oluşturduktan sonra Price ID'yi kopyalayın
   
2. **Forge Pro** - $29/month
   - Product oluşturduktan sonra Price ID'yi kopyalayın
   
3. **Forge Studio** - $99/month
   - Product oluşturduktan sonra Price ID'yi kopyalayın

Price ID'leri `.env.local` dosyasına ekleyin:
```env
STRIPE_PRICE_STARTER=price_1xxxxx
STRIPE_PRICE_PRO=price_1xxxxx
STRIPE_PRICE_STUDIO=price_1xxxxx
```

### 3. Database Migration

Terminal'de şu komutu çalıştırın:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Clerk Domain Ayarları

1. Clerk Dashboard → Settings → Paths
2. Sign in URL: `/sign-in`
3. Sign up URL: `/sign-up`
4. After sign in: `/`
5. After sign up: `/`

### 5. Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://YOUR-DOMAIN.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Webhook signing secret'ı kopyalayın ve `.env.local`'e ekleyin

---

## 📦 Kurulum Kontrol Listesi

- [ ] Tüm npm paketleri kuruldu (`npm install`)
- [ ] `.env.local` dosyası Supabase password ile güncellendi
- [ ] Stripe products oluşturuldu ve price IDs eklendi
- [ ] `npx prisma migrate dev` çalıştırıldı
- [ ] `npx prisma generate` çalıştırıldı
- [ ] Clerk paths ayarlandı
- [ ] Stripe webhook oluşturuldu

---

## 🚀 Vercel Deployment

### Environment Variables (Vercel'de eklenecek)

Tüm `.env.local` içeriğini Vercel Project Settings → Environment Variables'a ekleyin:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
DATABASE_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_STARTER=...
STRIPE_PRICE_PRO=...
STRIPE_PRICE_STUDIO=...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Deploy Adımları

1. GitHub'a push edin
2. Vercel'de "New Project"
3. GitHub repo'yu bağlayın
4. Framework: Vite (auto-detect olmalı)
5. Environment variables'ı ekleyin
6. Deploy düğmesine tıklayın

### Post-Deploy Kontroller

1. Clerk → Settings → Allowed Origins → Vercel domain'i ekleyin
2. Stripe → Webhooks → Endpoint URL'i Vercel domain ile güncelleyin
3. Test kullanıcısı ile sign up yapın
4. Subscription upgrade test edin

---

## 🧪 Local Test

```bash
npm run dev
```

1. http://localhost:5173'e gidin
2. Sign Up'a tıklayın
3. Google/GitHub ile giriş yapın
4. Subscription modal'dan upgrade test edin

---

## 📝 API Endpoints Oluşturulacak

Şu API endpoint'leri henüz oluşturulmadı, Vercel'de serverless functions olarak eklenecek:

- `/api/stripe/create-checkout-session` - Ödeme sayfası oluşturma
- `/api/stripe/create-portal-session` - Abonelik yönetimi
- `/api/webhooks/stripe` - Stripe webhook handler
- `/api/projects/save` - Proje kaydetme
- `/api/projects/[id]` - Proje yükleme
- `/api/projects/publish` - Proje yayınlama
- `/api/projects/public/[slug]` - Public proje görüntüleme
- `/api/user/sync` - Clerk user sync

Bunlar için `/api` klasörü oluşturulmalı.

---

## ⚠️ Güvenlik Notları

1. **ASLA** secret keysleri client-side kodda kullanmayın
2. Tüm API endpoint'lerinde Clerk auth kontrolü yapın
3. Stripe webhook'larını signature ile doğrulayın
4. Rate limiting ekleyin (production için)
5. CORS ayarlarını kontrol edin

---

## 🐛 Sorun Giderme

### Prisma Migration Hatası
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Clerk Sign In Redirect Sorunu
Clerk Dashboard'da redirect URL'leri kontrol edin.

### Stripe Checkout Çalışmıyor
Browser console'da hata var mı kontrol edin. Publishable key doğru mu?

### Database Connection Hatası
`.env.local`'deki DATABASE_URL'i kontrol edin. Supabase project aktif mi?
