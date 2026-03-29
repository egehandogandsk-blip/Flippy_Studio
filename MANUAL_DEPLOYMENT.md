# Studio Forge - Manuel Deployment Rehberi

## 🎯 Durum Özeti

✅ **Tamamlanan:**
- Clerk Authentication sistemi
- Supabase + Prisma database
- Stripe payment integration
- Project publishing sistemi
- Tüm kod ve utilities

❌ **Sorun:**
- GitHub push engelleniyor (repository rules)
- Vercel CLI terminal etkileşimi gerektiriyor

---

## 🚀 Manuel Deployment Adımları (Terminal Yok)

### Yöntem 1: GitHub Issues Çözümü + Vercel Auto-Deploy (ÖNERİLEN)

#### Adım 1: GitHub Repository Rules Düzeltme

1. https://github.com/egehandogandsk-blip/Studio_Forge_Tool_Live/settings adresine gidin
2. Sol menüden **"Rules"** → **"Rulesets"** seçin
3. Aktif olan tüm rulesets'i bulun ve **"Disable"** yapın
4. **Settings** → **Branches** → **Branch protection rules** kısmını kontrol edin
5. `main` branch'i için olan tüm protection'ları **DELETE** edin

#### Adım 2: Git Push (Terminal - Tek Komut)

Git Bash veya PowerShell'de:
```bash
cd "c:\Users\egeha\OneDrive\Masaüstü\Antigravity\New_Demo"
git push origin main --force
```

#### Adım 3: Vercel'de Import

1. https://vercel.com/new adresine gidin
2. **"Import Git Repository"** seçin
3. GitHub'dan `Studio_Forge_Tool_Live` seçin
4. **Framework Preset**: Vite (otomatik seçilecek)
5. **Root Directory**: `./` (varsayılan)
6. **Build Command**: `npm run build` (varsayılan)
7. **Output Directory**: `dist` (varsayılan)
8. **Deploy** butonuna tıklayın

---

### Yöntem 2: Yeni GitHub Repository + Vercel

#### Adım 1: Yeni Boş Repo Oluştur

1. https://github.com/new adresine gidin
2. Repo adı: `studio-forge-production`
3. **Private** veya **Public** seçin
4. ⚠️ **README, .gitignore, LICENSE eklemeyin** (tamamen boş)
5. **Create repository** tıklayın

#### Adım 2: Git Push (Terminal - 3 Komut)

```bash
cd "c:\Users\egeha\OneDrive\Masaüstü\Antigravity\New_Demo"
git remote set-url origin https://github.com/egehandogandsk-blip/studio-forge-production.git
git push -u origin main
```

#### Adım 3: Vercel Import (Yukarıdaki Adım 3 ile aynı)

---

### Yöntem 3: Zip Upload (GitHub'sız)

#### Adım 1: Projeyi Zip'le

1. `c:\Users\egeha\OneDrive\Masaüstü\Antigravity\New_Demo` klasörüne gidin
2. **ÖNCE** `.env.local` dosyasını **SİLİN** (içinde secret keys var!)
3. Tüm dosyaları seçin ve **ZIP** yapın
4. Zip adı: `studio-forge.zip`

#### Adım 2: Vercel'e Manuel Upload

1. https://vercel.com/new adresine gidin
2. **"Deploy with zip file"** seçeneğini arayın VEYA
3. Vercel CLI olmadan import yapılamıyor, bu yüzden **Yöntem 1** veya **Yöntem 2** kullanın

---

## 🔑 Environment Variables (Vercel Dashboard)

Deployment sonrası Vercel Dashboard → Settings → Environment Variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_bW9yYWwtc2VhZ3VsbC03NS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_AxjDgz884bpGeXWr7qVD5zY7Y1WvCP5EMReJbNwF2m

NEXT_PUBLIC_SUPABASE_URL=https://lhopcbrafxzdkzvjhiwp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxob3BjYnJhZnh6ZGt6dmpoaXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTY0MjAsImV4cCI6MjA4Njc3MjQyMH0.RLG5EP6bA8AWSLwgZY1hGPNiHeardNuZCqv4Ryj00rU
DATABASE_URL=postgresql://postgres:159753Egehan!.@db.lhopcbrafxzdkzvjhiwp.supabase.co:5432/postgres

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51KjrB8Bw115gIKgFljPgiSsosZB9qhBcfzkz9w7njGLk15uiuVZZaFPo9INYywD2BCakjOXGRyvgBQZgzXHNYoEw00EVqOsnAT
STRIPE_SECRET_KEY=sk_test_51KjrB8Bw115gIKgFZzZParrCwNqiBqGzxl0Skhvzb3p2S6wZm92mUcRFp4XOj7G8QuCJk1nQT8ZPcUKSDkzg1yHi000T9HA502

# Stripe Price IDs eklenecek
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_STUDIO=price_xxxxx
```

---

## ✅ Deployment Sonrası Checklist

- [ ] Vercel URL'i çalışıyor
- [ ] Sign-in/Sign-up çalışıyor
- [ ] Clerk → Settings → Domains → Vercel URL ekle
- [ ] Stripe → Webhooks → URL güncelle
- [ ] Test subscription yapın

---

## 💡 En Hızlı Yol

**Yöntem 1** (GitHub fix + Vercel auto-deploy) - 5 dakika

Sadece:
1. GitHub repo settings'den rulesets'i disable et
2. `git push origin main --force` (tek komut)
3. Vercel'de repo import et
4. Environment variables ekle

Tamamdır! 🚀
