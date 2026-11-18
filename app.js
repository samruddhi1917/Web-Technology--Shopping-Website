// ShopEase - Smart Shopping Website (SPA) demo
// Product data is loaded dynamically from products.json. Cart is saved in localStorage.

const app = document.getElementById("app");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
let products = [];
let cart = JSON.parse(localStorage.getItem("shopease-cart") || "[]");
let toastTimer;

document.getElementById("year").textContent = new Date().getFullYear();

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) throw new Error("Could not load products");
    products = await response.json();
    renderRoute();
  } catch (error) {
    app.innerHTML = `<section class="page-wrap container"><div class="empty-state"><div class="empty-icon">⚠️</div><h2>Could not load products</h2><p>Please run this project using VS Code Live Server, not by opening the HTML file directly.</p></div></section>`;
    console.error(error);
  }
}

function saveCart() {
  localStorage.setItem("shopease-cart", JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}
function money(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function getCartDetails() {
  return cart.map(item => ({...item, product: products.find(p => p.id === item.id)})).filter(item => item.product);
}
function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) found.quantity += 1;
  else cart.push({id, quantity:1});
  saveCart();
  showToast("Added to your cart!");
}
function changeQuantity(id, amount) {
  const item = cart.find(row => row.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(row => row.id !== id);
  saveCart();
  renderCart();
}
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast("Item removed");
}
function productCard(product) {
  return `<article class="product-card">
    <div class="product-art" style="background:${product.color}"><span class="tag">${product.tag}</span>${product.emoji}</div>
    <div class="product-info"><div class="product-category">${product.category}</div><h3>${product.name}</h3>
      <div class="product-bottom"><span class="price">${money(product.price)}</span>
      <button class="add-btn" aria-label="Add ${product.name} to cart" data-add="${product.id}">+</button></div>
    </div>
  </article>`;
}
function bindAddButtons() {
  document.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => addToCart(Number(button.dataset.add))));
}
function renderHome() {
  app.innerHTML = `<section class="hero"><div class="container hero-inner">
    <div class="hero-copy"><span class="eyebrow">Thoughtful finds. Everyday value.</span>
      <h1>Make room for<br><span>better things.</span></h1>
      <p>Discover useful everyday essentials across fashion, electronics, accessories and home. A simple, happy way to shop.</p>
      <a class="btn" href="#/shop">Explore collection <span>→</span></a>
    </div>
    <div class="hero-art"><div class="hero-circle"><div class="hero-bag">🛍️</div></div>
      <div class="floating-note note-one">✨ Fresh finds</div><div class="floating-note note-two">Good things, good prices</div>
    </div>
  </div></section>
  <section class="section container"><div class="section-head"><div><span class="eyebrow">Browse by interest</span><h2>Shop by category</h2><p>Find something you will love.</p></div></div>
    <div class="category-row">
      <a class="category-card" href="#/shop?category=Fashion"><span class="category-icon">👟</span>Fashion</a>
      <a class="category-card" href="#/shop?category=Electronics"><span class="category-icon">🎧</span>Electronics</a>
      <a class="category-card" href="#/shop?category=Accessories"><span class="category-icon">🎒</span>Accessories</a>
      <a class="category-card" href="#/shop?category=Home"><span class="category-icon">🪴</span>Home</a>
    </div>
    <div class="section-head"><div><span class="eyebrow">Handpicked for you</span><h2>Popular picks</h2></div><a class="btn secondary" href="#/shop">View all products →</a></div>
    <div class="product-grid">${products.slice(0,4).map(productCard).join("")}</div>
  </section>`;
  bindAddButtons();
}
function renderShop() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const selected = params.get("category") || "All";
  app.innerHTML = `<section class="page-wrap container"><div class="page-heading"><span class="eyebrow">The collection</span><h1>Find your next favourite.</h1><p>Browse our products and add your picks to the cart.</p></div>
    <div class="shop-toolbar"><input class="search-input" id="searchInput" type="search" placeholder="Search products..." aria-label="Search products">
      <select class="filter-select" id="categoryFilter" aria-label="Filter by category">
        ${["All","Fashion","Electronics","Accessories","Home"].map(c=>`<option ${selected===c?"selected":""}>${c}</option>`).join("")}
      </select>
      <select class="filter-select" id="sortFilter" aria-label="Sort products"><option value="default">Sort: Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option></select>
    </div><div class="product-grid" id="shopProducts"></div></section>`;
  const search = document.getElementById("searchInput");
  const category = document.getElementById("categoryFilter");
  const sort = document.getElementById("sortFilter");
  function update() {
    let list = [...products];
    const term = search.value.trim().toLowerCase();
    if (term) list = list.filter(p => (p.name+" "+p.category+" "+p.description).toLowerCase().includes(term));
    if (category.value !== "All") list = list.filter(p => p.category === category.value);
    if (sort.value === "low") list.sort((a,b)=>a.price-b.price);
    if (sort.value === "high") list.sort((a,b)=>b.price-a.price);
    document.getElementById("shopProducts").innerHTML = list.length ? list.map(productCard).join("") : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔎</div><h3>No products found</h3><p>Try another search or category.</p></div>`;
    bindAddButtons();
  }
  search.addEventListener("input", update);
  category.addEventListener("change", update);
  sort.addEventListener("change", update);
  update();
}
function renderCart() {
  const items = getCartDetails();
  const subtotal = items.reduce((sum,item)=>sum+item.product.price*item.quantity,0);
  const shipping = subtotal > 0 ? (subtotal >= 2000 ? 0 : 99) : 0;
  app.innerHTML = `<section class="page-wrap container"><div class="page-heading"><span class="eyebrow">Your selection</span><h1>Shopping cart</h1><p>Review your items before checkout.</p></div>
    ${items.length ? `<div class="cart-layout"><div class="cart-list">${items.map(item=>`<div class="cart-item">
      <div class="cart-thumb" style="background:${item.product.color}">${item.product.emoji}</div>
      <div><h3>${item.product.name}</h3><small>${money(item.product.price)} each</small>
        <div class="quantity"><button data-minus="${item.id}" aria-label="Decrease quantity">−</button><strong>${item.quantity}</strong><button data-plus="${item.id}" aria-label="Increase quantity">+</button><button class="remove-btn" data-remove="${item.id}">Remove</button></div>
      </div><strong class="price">${money(item.product.price*item.quantity)}</strong>
    </div>`).join("")}</div>
    <aside class="summary-card"><h3>Order summary</h3><div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-line"><span>Delivery</span><strong>${shipping===0?"Free":money(shipping)}</strong></div><div class="summary-line total"><span>Total</span><span>${money(subtotal+shipping)}</span></div><p style="font-size:.78rem;color:var(--muted)">Free delivery on orders of ₹2,000 or more.</p><a class="btn" href="#/checkout">Proceed to checkout →</a><a class="btn secondary" href="#/shop" style="width:100%;margin-top:9px">Continue shopping</a></aside></div>` :
    `<div class="empty-state"><div class="empty-icon">🛒</div><h2>Your cart is waiting</h2><p>You have not added any products yet.</p><a class="btn" href="#/shop">Start shopping →</a></div>`}
  </section>`;
  document.querySelectorAll("[data-minus]").forEach(b=>b.addEventListener("click",()=>changeQuantity(Number(b.dataset.minus),-1)));
  document.querySelectorAll("[data-plus]").forEach(b=>b.addEventListener("click",()=>changeQuantity(Number(b.dataset.plus),1)));
  document.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>removeFromCart(Number(b.dataset.remove))));
}
function renderCheckout() {
  const items = getCartDetails();
  if (!items.length) { location.hash = "#/cart"; return; }
  const subtotal = items.reduce((sum,item)=>sum+item.product.price*item.quantity,0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  app.innerHTML = `<section class="page-wrap container"><div class="page-heading"><span class="eyebrow">Almost there</span><h1>Checkout</h1><p>Enter your details to place a demo order.</p></div>
    <div class="checkout-layout"><form class="form-card" id="checkoutForm" novalidate><h2>Delivery information</h2>
      <div class="form-grid">
        <div class="field"><label for="fullName">Full name *</label><input class="form-control" id="fullName" name="fullName" required minlength="3" placeholder="Your name"></div>
        <div class="field"><label for="phone">Phone number *</label><input class="form-control" id="phone" name="phone" required inputmode="numeric" maxlength="10" placeholder="10-digit mobile number"></div>
        <div class="field full"><label for="email">Email address *</label><input class="form-control" id="email" name="email" type="email" required placeholder="you@example.com"></div>
        <div class="field full"><label for="address">Delivery address *</label><textarea class="form-control" id="address" name="address" required minlength="10" placeholder="House no., street, area"></textarea></div>
        <div class="field"><label for="city">City *</label><input class="form-control" id="city" name="city" required placeholder="City"></div>
        <div class="field"><label for="pincode">PIN code *</label><input class="form-control" id="pincode" name="pincode" required inputmode="numeric" maxlength="6" placeholder="6-digit PIN code"></div>
      </div>
      <p style="font-size:.78rem;color:var(--muted)">* Required fields. This is a front-end demo; no real payment or order is processed.</p>
      <button class="btn" type="submit">Place demo order →</button>
    </form>
    <aside class="summary-card"><h3>Your order</h3>${items.map(i=>`<div class="summary-line"><span>${i.product.name} × ${i.quantity}</span><strong>${money(i.product.price*i.quantity)}</strong></div>`).join("")}<div class="summary-line"><span>Delivery</span><strong>${shipping===0?"Free":money(shipping)}</strong></div><div class="summary-line total"><span>Total</span><span>${money(subtotal+shipping)}</span></div></aside></div>
  </section>`;
  document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const phone = form.phone.value.trim();
    const pin = form.pincode.value.trim();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { form.phone.setCustomValidity("Enter a valid 10-digit Indian mobile number."); form.phone.reportValidity(); form.phone.setCustomValidity(""); return; }
    if (!/^\d{6}$/.test(pin)) { form.pincode.setCustomValidity("Enter a valid 6-digit PIN code."); form.pincode.reportValidity(); form.pincode.setCustomValidity(""); return; }
    const orderId = "SE" + Date.now().toString().slice(-7);
    cart = []; saveCart();
    app.innerHTML = `<section class="page-wrap container"><div class="success-panel"><div class="success-icon">🎉</div><span class="eyebrow">Order placed</span><h1>Thank you for shopping!</h1><p>Your demo order <strong>${orderId}</strong> has been placed successfully.</p><p style="color:var(--muted)">This is a student project, so no real payment or delivery is initiated.</p><a class="btn" href="#/shop">Continue shopping</a></div></section>`;
  });
}
function renderRoute() {
  const route = location.hash.replace(/^#\/?/, "").split("?")[0] || "home";
  document.querySelectorAll(".main-nav a").forEach(a=>a.classList.toggle("active",a.dataset.route===route));
  if (route === "shop") renderShop();
  else if (route === "cart") renderCart();
  else if (route === "checkout") renderCheckout();
  else renderHome();
  updateCartCount();
  document.querySelector(".main-nav").classList.remove("open");
  window.scrollTo(0,0);
}
window.addEventListener("hashchange", renderRoute);
document.getElementById("menuToggle").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));
updateCartCount();
loadProducts();
