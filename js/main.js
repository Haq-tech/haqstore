// Dummy Data
const products = [
    { id: 1, name: "Smartphone", price: 299.99, category: "electronics", image: "assets/img/product1.jpg", description: "High-end smartphone with 128GB storage." },
    { id: 2, name: "Book: Sci-Fi Novel", price: 19.99, category: "books", image: "assets/img/product2.jpg", description: "An exciting sci-fi adventure." },
    // Add more products
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = quantity;
        if (cartItem.quantity <= 0) removeFromCart(productId);
        saveCart();
        renderCart();
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
        toast.remove();
    }, 3000);
}

// Render Products
function renderProducts(filter = '') {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    productGrid.innerHTML = '';
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})" class="btn">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

// Render Cart
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartItems || !cartTotal) return;
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="50">
            <span>${item.name} - $${item.price} x </span>
            <input type="number" value="${item.quantity}" min="0" onchange="updateQuantity(${item.id}, this.value)">
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(li);
    });
    cartTotal.textContent = total.toFixed(2);
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping!</a></p>';
    }
}

// Theme Switcher
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.getElementById('theme-switcher').textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Scroll to Top
function handleScrollToTop() {
    const btn = document.getElementById('scroll-to-top');
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Search
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderProducts(searchInput.value));
    }
}

// Checkout
function handleCheckout() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                showToast('Your cart is empty! Add items to proceed.');
                return;
            }
            const formData = new FormData(checkoutForm);
            const order = {
                id: Date.now(),
                items: cart,
                details: Object.fromEntries(formData),
                date: new Date().toISOString(),
            };
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            cart = [];
            saveCart();
            showToast('Order placed successfully!');
            window.location.href = 'index.html';
        });
    }
}

// Profile Orders
function renderOrders() {
    const orderList = document.getElementById('order-list');
    if (!orderList) return;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orderList.innerHTML = '';
    orders.forEach(order => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>Order #${order.id} - ${new Date(order.date).toLocaleDateString()}</p>
            <ul>
                ${order.items.map(item => `<li>${item.name} - $${item.price} x ${item.quantity}</li>`).join('')}
            </ul>
        `;
        orderList.appendChild(li);
    });
}

// Page-Specific Logic
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/') {
        renderProducts();
    }
    if (path.includes('cart.html')) {
        renderCart();
    }
    if (path.includes('profile.html')) {
        renderOrders();
    }
    handleSearch();
    handleCheckout();
    handleScrollToTop();
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(`${savedTheme}-mode`);
    document.getElementById('theme-switcher').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    document.getElementById('theme-switcher').addEventListener('click', toggleTheme);
});

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
    const installBtn = document.createElement('button');
    installBtn.textContent = 'Install App';
    installBtn.className = 'btn';
    installBtn.style.position = 'fixed';
    installBtn.style.bottom = '80px';
    installBtn.style.right = '20px';
    document.body.appendChild(installBtn);
    installBtn.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            installBtn.remove();
        });
    });
});
