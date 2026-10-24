const PRODUCTS = [
  { id: "sweter-merino", name: "Sweter Merino Klasik", category: "pakaian", price: 485000, emoji: "🧥", color: "#f3e3d3", badge: "Best seller", desc: "Wool merino Australia, jahitan aran, tersedia size S–XXL." },
  { id: "cardigan-sage", name: "Cardigan Sage Oversized", category: "pakaian", price: 525000, emoji: "🧶", color: "#e4ead9", badge: "Baru", desc: "Potongan longgar warna sage, kancing kayu handmade." },
  { id: "syal-terracotta", name: "Syal Terracotta Panjang", category: "aksesoris", price: 195000, emoji: "🧣", color: "#f6ded2", badge: "", desc: "Panjang 180 cm, rumbai tangan, ringan tapi hangat." },
  { id: "topi-beanie", name: "Topi Beanie Ripel", category: "aksesoris", price: 125000, emoji: "🎩", color: "#efe6f0", badge: "", desc: "Rajutan rib 2x2, ada pom-pom bulu sintetis opsional." },
  { id: "sarung-tangan", name: "Sarung Tangan Mitten", category: "aksesoris", price: 115000, emoji: "🧤", color: "#e7ecf2", badge: "", desc: "Kompatibel dengan layar HP, benang katun-bambu." },
  { id: "beruang-amigurumi", name: "Beruang Amigurumi Miko", category: "boneka", price: 275000, emoji: "🧸", color: "#f7ecd4", badge: "Favorit anak", desc: "Tinggi 30 cm, mata safety eyes, benang hypoallergenic." },
  { id: "bunny-amigurumi", name: "Kelinci Amigurumi Luna", category: "boneka", price: 245000, emoji: "🐰", color: "#fbeef0", badge: "", desc: "Bisa request nama bordir di telinga, hadiah ulang tahun aman." },
  { id: "cushion-kotak", name: "Cushion Rajut Persegi", category: "rumah", price: 165000, emoji: "🛋️", color: "#ece5da", badge: "", desc: "Sarung bantal motif granny square, resleting tersembunyi." },
  { id: "plafet-sofa", name: "Plafet Sofa Anyaman", category: "rumah", price: 215000, emoji: "🪑", color: "#e9e6dc", badge: "", desc: "Ukuran 120x150 cm, pas untuk sofa dua dudukan." },
];

const CART_STORAGE_KEY = "benhangat_cart";
let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", minimumFractionDigits: 0,
});

const grid = document.getElementById("product-grid");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartEmptyEl = document.getElementById("cart-empty");
const cartTotalEl = document.getElementById("cart-total");
const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderProducts(category) {
  const items = category === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === category);

  // All fields are escaped via escapeHtml
  // fixmyslop-ignore[sec/raw-html] Safely escaped dynamic values inside template string
  grid.innerHTML = items.map((p) => `
    <article class="product-card">
      <div class="product-visual" style="background:${escapeHtml(p.color)}">
        ${p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : ""}
        <span aria-hidden="true">${escapeHtml(p.emoji)}</span>
      </div>
      <div class="product-body">
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <p class="product-desc">${escapeHtml(p.desc)}</p>
        <div class="product-row">
          <span class="price">${escapeHtml(rupiah.format(p.price))}</span>
          <button class="add-btn" data-id="${escapeHtml(p.id)}">+ Keranjang</button>
        </div>
      </div>
    </article>
  `).join("");
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelector(".chip.is-active").classList.remove("is-active");
    chip.classList.add("is-active");
    renderProducts(chip.dataset.category);
  });
});

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  addToCart(btn.dataset.id);
  btn.textContent = "Ditambahkan ✓";
  setTimeout(() => { btn.textContent = "+ Keranjang"; }, 900);
});

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const totalQty = entries.reduce((sum, [, qty]) => sum + qty, 0);
  cartCountEl.textContent = totalQty;

  // All fields are escaped via escapeHtml
  // fixmyslop-ignore[sec/raw-html] Safely escaped dynamic values inside template string
  cartItemsEl.innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return "";
    return `
      <li class="cart-item" data-id="${escapeHtml(id)}">
        <span class="cart-thumb" style="background:${escapeHtml(p.color)}" aria-hidden="true">${escapeHtml(p.emoji)}</span>
        <div>
          <p class="cart-item-name">${escapeHtml(p.name)}</p>
          <p class="cart-item-price">${escapeHtml(rupiah.format(p.price))} × ${escapeHtml(qty)}</p>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" data-delta="-1" aria-label="Kurangi ${escapeHtml(p.name)}">−</button>
          <span>${escapeHtml(qty)}</span>
          <button class="qty-btn" data-delta="1" aria-label="Tambah ${escapeHtml(p.name)}">+</button>
        </div>
      </li>
    `;
  }).join("");

  const subtotal = entries.reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p ? sum + p.price * qty : sum;
  }, 0);

  cartTotalEl.textContent = rupiah.format(subtotal);
  cartEmptyEl.hidden = entries.length > 0;
}

cartItemsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".qty-btn");
  if (!btn) return;
  const id = btn.closest(".cart-item").dataset.id;
  changeQty(id, Number(btn.dataset.delta));
});

function openCart() {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
}

function closeCart() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}

document.getElementById("cart-toggle").addEventListener("click", () => {
  drawer.classList.contains("is-open") ? closeCart() : openCart();
});
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  const entries = Object.entries(cart);
  if (!entries.length) return;

  const lines = entries.map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return `- ${p.name} (${qty}x) — ${rupiah.format(p.price * qty)}`;
  });
  const total = entries.reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p ? sum + p.price * qty : sum;
  }, 0);

  const message = encodeURIComponent(
    `Halo Benang Hangat! Saya mau pesan:\n${lines.join("\n")}\nTotal: ${rupiah.format(total)}`
  );
  window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
});

const menuToggle = document.getElementById("menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = !mobileNav.hidden;
  mobileNav.hidden = isOpen;
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
});
mobileNav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById("form-status");
  const required = [...form.querySelectorAll("[required]")];
  const missing = required.filter((input) => !input.value.trim());

  if (missing.length) {
    status.textContent = "Mohon isi semua kolom terlebih dahulu.";
    status.style.color = "#ffd9a0";
    missing[0].focus();
    return;
  }

  const text = encodeURIComponent(
    `Permintaan custom:\nNama: ${form.nama.value}\nKontak: ${form.kontak.value}\nDetail: ${form.pesan.value}`
  );
  window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  status.textContent = "Terima kasih! Pesananmu sudah diteruskan ke WhatsApp kami.";
  status.style.color = "#fff";
  form.reset();
});

renderProducts("all");
renderCart();
