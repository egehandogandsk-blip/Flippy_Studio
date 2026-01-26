# Firebase Authentication Sorun Giderme

## Hata: auth/unauthorized-domain

Bu hatayı alıyorsanız, Firebase Console'da domain ayarlarını kontrol edin.

## Çözüm Adımları

### 1. Firebase Console'da Domain Ekleme

1. **Firebase Console'u açın**: https://console.firebase.google.com/project/forge-2cfcc/authentication/providers
2. **Sign-in method** sekmesine gidin
3. **Authorized domains** bölümünü bulun (sayfanın altında)
4. **Add domain** butonuna tıklayın
5. **`localhost`** yazın (PORT NUMARASI OLMADAN!)
   - ✅ Doğru: `localhost`
   - ❌ Yanlış: `localhost:5173`

### 2. Tarayıcı Cache'ini Temizleme

1. **Chrome/Edge**: `Ctrl + Shift + Delete`
2. **Cache temizle**
3. **Hard Refresh**: `Ctrl + Shift + R`

### 3. Dev Server'ı Yeniden Başlatma

```bash
# Terminal'de Ctrl+C ile mevcut sunucuyu durdurun
# Sonra tekrar başlatın:
npm run dev
```

### 4. Firebase Console'da Kontrol Edilecekler

**Authentication → Settings → Authorized domains** bölümünde şunlar olmalı:

- ✅ `localhost` (local development için)
- ✅ `forge-2cfcc.firebaseapp.com` (Firebase default)
- ✅ `forge-2cfcc.web.app` (Firebase Hosting)

### 5. Alternatif Çözüm: AuthDomain Değişikliği

Eğer yukarıdaki adımlar işe yaramazsa, Firebase config'i `authDomain` olarak `localhost` kullanacak şekilde güncelleyebiliriz. Ancak bu önerilmez çünkü production'da çalışmaz.

## Debug İçin Konsol Kontrolü

Tarayıcı console'unda (F12) hata detaylarını kontrol edin. Şu bilgileri arayın:
- Tam hata mesajı
- Auth provider detayları
- Redirect URL

---

**Not**: Değişikliklerin yansıması 1-2 dakika sürebilir. Domain ekledikten sonra biraz bekleyip tekrar deneyin.
