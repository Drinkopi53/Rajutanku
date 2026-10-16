const STORE = {
  whatsappNumber: "6281234567890",
};

const PRODUCTS = [
  {
    id: "syal-terra",
    name: "Syal Ribs Terra",
    price: 185000,
    stock: 4,
    emoji: "🧣",
    bg: "#f3e0d3",
    desc: "Wol merino, 180 × 25 cm. Pola ribs tebal, tidak melar setelah dipakai.",
  },
  {
    id: "topi-nusa",
    name: "Topi Beanie Nusa",
    price: 95000,
    stock: 7,
    emoji: "🧢",
    bg: "#e4ecdf",
    desc: "Katun premium, satu ukuran dewasa. Ada pom-pom yang bisa dilepas.",
  },
  {
    id: "amg-beruang",
    name: "Amigurumi Beruang Moka",
    price: 145000,
    stock: 2,
    emoji: "🧸",
    bg: "#f0e6d8",
    desc: "Tinggi 22 cm, safety eyes bersertifikat mainan anak. Isi hypoallergenic.",
  },
  {
    id: "tas-weekend",
    name: "Tas Rajut Weekend",
    price: 265000,
    stock: 3,
    emoji: "👜",
    bg: "#e8dfd0",
    desc: "Motif lubuk klasik, muat laptop 14 inci. Lapisan dalam kain katun.",
  },
  {
    id: "syal-sage",
    name: "Syal Lace Sage",
    price: 165000,
    stock: 5,
    emoji: "🧶",
    bg: "#dfe8db",
    desc: "Benang katun mercerized ringan, cocok untuk cuaca tropis.",
  },
  {
    id: "amg-bunny",
    name: "Amigurumi Kelinci Kapas",
    price: 135000,
    stock: 1,
    emoji: "🐰",
    bg: "#efe3e3",
    desc: "Tinggi 18 cm, telinga panjang yang bisa ditekuk. Favorit kado anak.",
  },
  {
    id: "selimut-mini",
    name: "Selimut Bayi Patchwork",
    price: 320000,
    stock: 2,
    emoji: "🛏️",
    bg: "#e6e0d2",
    desc: "80 × 80 cm dari perpaduan sisa benang wol — tiap kotak unik.",
  },
  {
    id: "coaster-set",
    name: "Set Tatakan Gelas (6)",
    price: 65000,
    stock: 10,
    emoji: "☕",
    bg: "#ece4d6",
    desc: "Katun tebal, tahan panas dan bisa dicuci mesin dengan air dingin.",
  },
];

const cart = new Map();

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  for (const p of PRODUCTS) {
    const card = el("article", "product-card");

    const thumb = el("div", "product-thumb", p.emoji);
    thumb.style.background = p.bg;

    const body = el("div", "product-body");
    body.appendChild(el("h3", null, p.name));
    body.appendChild(el("p", "product-desc", p.desc));
    body.appendChild(el("p", "product-price", currency.format(p.price)));

    const remaining = p.stock - (cart.get(p.id)?.qty ?? 0);
    const stockLabel = el(
      "p",
      "product-stock" + (remaining <= 2 ? " low" : ""),
      remaining > 0 ? `Sisa ${remaining}` : "Stok habis"
    );
    body.appendChild(stockLabel);

    const addBtn = el("button", "add-btn", remaining > 0 ? "Tambah ke keranjang" : "Tidak tersedia");
    addBtn.disabled = remaining <= 0;
    addBtn.addEventListener("click", () => addToCart(p.id));
    body.appendChild(addBtn);

    card.append(thumb, body);
    grid.appendChild(card);
  }
}

function addToCart(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  const entry = cart.get(id) ?? { qty: 0 };
  if (entry.qty >= product.stock) return;
  entry.qty += 1;
  cart.set(id, entry);
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const entry = cart.get(id);
  if (!entry) return;
  const product = PRODUCTS.find((p) => p.id === id);
  entry.qty = Math.min(product.stock, Math.max(0, entry.qty + delta));
  if (entry.qty === 0) cart.delete(id);
  renderCart();
}

function cartTotals() {
  let count = 0;
  let total = 0;
  for (const [id, { qty }] of cart) {
    count += qty;
    total += PRODUCTS.find((p) => p.id === id).price * qty;
  }
  return { count, total };
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("cart-empty");
  list.textContent = "";

  for (const [id, { qty }] of cart) {
    const p = PRODUCTS.find((prod) => prod.id === id);
    const item = el("li", "cart-item");
    item.appendChild(el("span", "cart-item-name", p.name));
    item.appendChild(el("span", "cart-item-price", currency.format(p.price * qty)));

    const controls = el("div", "qty-controls");
    const minus = el("button", null, "−");
    minus.setAttribute("aria-label", `Kurangi ${p.name}`);
    minus.addEventListener("click", () => changeQty(id, -1));
    const plus = el("button", null, "+");
    plus.setAttribute("aria-label", `Tambah ${p.name}`);
    plus.addEventListener("click", () => changeQty(id, 1));
    controls.append(minus, el("span", null, String(qty)), plus);
    item.appendChild(controls);

    list.appendChild(item);
  }

  const { count, total } = cartTotals();
  emptyMsg.hidden = count > 0;
  list.hidden = count === 0;
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = currency.format(total);

  // Re-render product cards so stock labels track cart quantity.
  const grid = document.getElementById("product-grid");
  grid.textContent = "";
  renderProducts();
}

function openCart() {
  document.getElementById("cart-panel").classList.add("open");
  document.getElementById("overlay").classList.add("visible");
  document.getElementById("cart-panel").setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.getElementById("cart-panel").classList.remove("open");
  document.getElementById("overlay").classList.remove("visible");
  document.getElementById("cart-panel").setAttribute("aria-hidden", "true");
}

function buildWaLink(text) {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function checkout() {
  if (cart.size === 0) return;
  const lines = ["Halo rajutanku, saya mau pesan:", ""];
  for (const [id, { qty }] of cart) {
    const p = PRODUCTS.find((prod) => prod.id === id);
    lines.push(`• ${p.name} × ${qty} — ${currency.format(p.price * qty)}`);
  }
  lines.push("", `Total: ${currency.format(cartTotals().total)}`);
  window.open(buildWaLink(lines.join("\n")), "_blank", "noopener");
}

function handleContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const nama = (data.get("nama") ?? "").toString().trim();
  const wa = (data.get("wa") ?? "").toString().trim();
  const pesan = (data.get("pesan") ?? "").toString().trim();
  const status = document.getElementById("form-status");

  if (!nama || !wa || !pesan) {
    status.textContent = "Mohon isi semua kolom terlebih dahulu.";
    return;
  }
  if (!/^08\d{8,12}$/.test(wa.replace(/[\s-]/g, ""))) {
    status.textContent = "Nomor WhatsApp tidak valid, contoh: 081234567890.";
    return;
  }

  status.textContent = "Membuka WhatsApp...";
  const text = [
    `Halo rajutanku, saya ${nama}.`,
    `Nomor saya: ${wa}`,
    "",
    "Pesanan custom:",
    pesan,
  ].join("\n");
  window.open(buildWaLink(text), "_blank", "noopener");
  form.reset();
}

document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.getElementById("checkout-btn").addEventListener("click", checkout);
document.getElementById("contact-form").addEventListener("submit", handleContactForm);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
