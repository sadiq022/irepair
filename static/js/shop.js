document.addEventListener("DOMContentLoaded", function () {
    console.log("Shop page JavaScript loaded");

    /* =========================
       CART FUNCTIONALITY
       ========================= */
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Cart elements
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartNotification = document.querySelector('.cart-notification');
    
    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('.product-image img').src;
            
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            
            showNotification(`${productName} added to cart!`);
        });
    });
    
    // Buy Now buttons
    document.querySelectorAll('.buy-now-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Add to cart and open cart
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            
            showNotification(`${productName} added to cart!`);
            openCart();
        });
    });
    
    // Notify Me buttons
    document.querySelectorAll('.notify-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            
            alert(`We'll notify you when "${productName}" is back in stock!`);
        });
    });
    
    // Cart functions
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        // Update cart count in navbar if exists
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }
    
    function showNotification(message) {
        if (cartNotification) {
            cartNotification.querySelector('.notification-text').textContent = message;
            cartNotification.classList.add('show');
            
            setTimeout(() => {
                cartNotification.classList.remove('show');
            }, 3000);
        }
    }
    
    function openCart() {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close cart functionality
    if (closeCartBtn && cartOverlay) {
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
                closeCart();
            }
        });
    }
    
    function closeCart() {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Initialize cart count
    updateCartCount();
    
    /* =========================
       PRODUCT FILTERING (if you add filters later)
       ========================= */
    
    // Example filter function
    function filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    /* =========================
       SORTING FUNCTIONALITY (if you add sorting later)
       ========================= */
    
    // Example sort function
    function sortProducts(sortBy) {
        const container = document.querySelector('.products-grid');
        const products = Array.from(document.querySelectorAll('.product-card'));
        
        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            
            switch(sortBy) {
                case 'price-low-high':
                    return priceA - priceB;
                case 'price-high-low':
                    return priceB - priceA;
                default:
                    return 0;
            }
        });
        
        // Re-append sorted products
        products.forEach(product => container.appendChild(product));
    }
    
    /* =========================
       LAZY LOADING IMAGES
       ========================= */
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('.product-image img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});