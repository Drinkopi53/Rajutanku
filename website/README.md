# Benang Hangat — Website Toko Rajutan

Website satu halaman untuk bisnis rajutan tangan (sweter, syal, topi, amigurumi, dekorasi rumah).

## Struktur

```
website/
├── index.html      # markup semua section
├── css/style.css   # tema, tata letak, responsif
└── js/app.js       # katalog produk, filter, keranjang, checkout WhatsApp
```

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:

```
cd website
python3 -m http.server 8091
# buka http://localhost:8091
```

## Fitur

- Katalog 9 produk dengan filter kategori (data di array `PRODUCTS` pada `js/app.js`).
- Keranjang belanja tersimpan di `localStorage`, drawer geser dengan kontrol kuantitas.
- Checkout membuka WhatsApp dengan rincian pesanan otomatis.
- Form pemesanan custom memvalidasi input lalu meneruskan ke WhatsApp.
- Responsif hingga mobile, mendukung `prefers-reduced-motion`.

## Kustomisasi cepat

- Nomor WhatsApp: ganti `6281234567890` di `js/app.js` dan `index.html`.
- Produk & harga: edit array `PRODUCTS`.
- Warna merek: variabel CSS di `:root` pada `css/style.css`.
