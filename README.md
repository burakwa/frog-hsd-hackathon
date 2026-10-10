# 🐸 FrogFriends — Çocuklar için Konuşma Öğrenme Platformu

> **Canlı Demo:** [https://frog-hsd-hackathon.vercel.app](https://frog-hsd-hackathon.vercel.app)

Eğlenceli bir kurbağa karakteriyle, çocukların konuşmayı öğrenmesini ve telaffuzlarını geliştirmesini sağlayan etkileşimli bir web platformu. Duolingo tarzı ilerleme sistemi, ses tanıma teknolojisi ve AI destekli analizlerle çocuklar oyun oynarken konuşur.

---

## ✨ Özellikler

### 🎮 4 Farklı Oyun Modu
| Oyun | Açıklama | Beceri |
|------|----------|--------|
| **Ses Tekrarı** | Kelimeleri dinle, tekrar et ve puan kazan | Temel telaffuz |
| **Hece Avı** | Sinekleri yakalayarak heceleri öğren | Hece farkındalığı |
| **Cümle Kur** | Eksik kelimeleri bul, cümleleri tamamla | Dilbilgisi & sözcük hazinesi |
| **Sesli Masal** | Masalları oku, dinle ve keyifle öğren | Akıcılık & anlama |

### 🏆 Duolingo Tarzı İlerleme Sistemi
- **Seviye atlama** — Yıldız toplayarak seviye atlayın
- **Kilitli bölümler** — Önceki seviyeleri tamamlayarak yeni oyunları açın
- **Günlük seriler** — Düzenli pratik için motivasyon
- **İlerleme takibi** — Oynanan oyun, kazanılan yıldız, tamamlanan bölüm istatistikleri

### 🎤 Ses Teknolojileri
- **Web Speech API** — Tarayıcı tabanlı ses tanıma ve sentez
- **Gerçek zamanlı geri bildirim** — Anlık telaffuz doğruluğu analizi
- **Ses görselleştirme** — Mikrofon seviyesi ve dalga formu göstergesi

### 🤖 AI Destekli Analiz (OpenRouter)
- Konuşma performansı detaylı raporlama
- Kişiselleştirilmiş öğrenme önerileri
- Veli paneli için gelişim raporları

### 👨‍👩‍👧‍👦 Veli Paneli
- Çocuğun ilerlemesini izleme
- Detaylı oturum geçmişi
- AI destekli gelişim raporları

---

## 🛠 Teknoloji Yığını

| Kategori | Teknolojiler |
|----------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **Backend & Auth** | Supabase (PostgreSQL, Auth, Realtime) |
| **AI** | OpenRouter API |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Animations** | Framer Motion, Canvas Confetti |
| **Deployment** | Vercel |

---

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler
- Node.js 20+
- npm / pnpm / yarn
- Supabase hesabı (ücretsiz)
- OpenRouter API anahtarı (AI özellikleri için)

### Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/burakwa/frog-hsd-hackathon
cd frog

# Bağımlılıkları yükleyin
npm install

# Ortam değişkenlerini kopyalayın ve düzenleyin
cp .env.example .env.local
```

### `.env.local` Yapılandırması

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenRouter (AI analiz için)
OPENROUTER_API_KEY=your_openrouter_key
```

### Supabase Kurulumu

1. [Supabase](https://supabase.com) yeni bir proje oluşturun
2. SQL Editör'de `supabase-schema.sql` ve `supabase-ai-reports.sql` dosyalarını çalıştırın
3. Authentication > Providers > Email'ü etkinleştirin

### Geliştirme Sunucusu

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

---

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router sayfaları
│   ├── api/               # API rotaları (analiz, AI rapor)
│   ├── giris/             # Giriş sayfası
│   ├── kayit/             # Kayıt sayfası
│   ├── panel/             # Ana öğrenme paneli (korumalı)
│   │   ├── ilerleme/      # İlerleme detayları
│   │   ├── oyunlar/       # Oyun sayfaları
│   │   ├── veli-paneli/   # Veli paneli
│   │   └── profil/        # Profil sayfası
│   ├── globals.css        # Global stiller
│   ├── layout.tsx         # Root layout + metadata
│   └── page.tsx           # Landing page
├── components/
│   └── game/              # Oyun bileşenleri (Character, vb.)
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Kimlik doğrulama
│   ├── useProgress.ts     # İlerleme takibi
│   ├── useSpeechRecognition.ts
│   ├── useSpeechSynthesis.ts
│   ├── useMicrophone.ts
│   ├── useEnhancedSpeechAnalysis.ts
│   └── useAIAnalysis.ts
├── lib/
│   ├── ai/                # OpenRouter entegrasyonu
│   ├── comparison/        # Fonem karşılaştırma algoritmaları
│   ├── data/              # Oyun verileri (kelimeler, masallar, cümleler)
│   ├── exercises/         # Egzersiz mantığı
│   ├── speech/            # Ses tanıma/sentez yardımcıları
│   ├── supabase/          # Supabase client/server
│   └── utils/             # Yardımcı fonksiyonlar
├── types/                 # TypeScript tip tanımları
└── middleware.ts          # Auth koruma middleware'i
```

---

## 🎨 Tasarım Felsefesi

- **Çocuk odaklı** — Yumuşak köşeler, canlı renkler, eğlenceli animasyonlar
- **Erişilebilirlik** — Yüksek kontrast, büyük dokunma alanları, ekran okuyucu uyumlu
- **Güvenli** — Reklamsız, dış bağlantısız, veri gizliliği öncelikli
- **Performanslı** — Next.js 16, Turbopack, optimize edilmiş bundle

---

## 📸 Ekran Görüntüleri

### Ana Sayfa (Landing)
> Renkli, animate edilmiş hero section + 4 oyun özelliği kartı

### Öğrenme Paneli
> Duolingo tarzı yol haritası, seviye halkası, kilitli/açık bölümler

### Oyun Ekranları
> Ses tekrarı, hece avı, cümle kur, sesli masal — her biri karakter animasyonlu

### Veli Paneli
> İstatistik kartları, AI raporu, oturum geçmişi

---

## 🔐 Güvenlik & Gizlilik

- **Row Level Security (RLS)** — Supabase ile kullanıcı verileri izole
- **HTTPS Only** — Vercel otomatik SSL
- **Minimal Veri Toplama** — Sadece öğrenme için gerekli veriler
- **Çocuk Güvenliği** — COPPA/GDPR-KVKK uyumlu tasarım

---

## 📝 Lisans

MIT License — Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi pushlayın (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 🙏 Teşekkürler

- **Supabase** — Backend altyapısı için
- **Vercel** — Ücretsiz hosting ve deployment için
- **OpenRouter** — AI model erişimi için
- **Next.js Team** — Harika framework için
- **Tasarım ilhamı** — Duolingo, Khan Academy Kids

---

## 📞 İletişim

**Proje Sahibi:** [Burak](https://github.com/burakwa)  
**Canlı Demo:** [https://frog-hsd-hackathon.vercel.app](https://frog-hsd-hackathon.vercel.app)  
**Sorun Bildirimi:** [GitHub Issues](https://github.com/burakwa/frog/issues)

---

<div align="center">
  <sub>Sevgi ve dikkatle yapıldı 💚</sub>
</div>