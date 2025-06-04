



fetch('../products.json')
    .then(response => response.json())
    .then(data =>
    {
        const products = data.products;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const swiper_items_sale = document.getElementById("swiper_items_sale");
        const swiper_elctronics = document.getElementById("swiper_elctronics");
        const swiper_appliances = document.getElementById("swiper_appliances");
        const swiper_mobiles = document.getElementById("swiper_mobiles");



        // Direct click handler for add to cart buttons
        function addDirectClickHandlers()
        {
            document.querySelectorAll('.btn_add_cart').forEach(button =>
            {
                button.addEventListener('click', function (e)
                {
                    e.preventDefault();
                    e.stopPropagation();

                    // Check if user is logged in
                    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                    if (!currentUser)
                    {
                        window.location.href = 'login.html';
                        return;
                    }

                    if (!this.classList.contains('active'))
                    {
                        const productId = parseInt(this.dataset.id);
                        const product = products.find(p => p.id === productId);

                        if (product)
                        {
                            let cart = JSON.parse(localStorage.getItem('cart')) || [];

                            // Check if product is already in cart
                            const existingItemIndex = cart.findIndex(item => item.id === productId);

                            if (existingItemIndex === -1)
                            {
                                // Add to cart
                                cart.push({ ...product, quantity: 1 });
                                localStorage.setItem('cart', JSON.stringify(cart));

                                // Update button state
                                this.classList.add('active');
                                this.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in cart`;

                                // Update cart display
                                updateCartDisplay();
                            }
                        }
                    }
                });
            });
        }

        // Function to navigate to product details
        function goToProductDetails(productId)
        {
            window.location.href = `../html/product-details.html?id=${productId}`;
        }

        // Function to create product HTML
        function createProductHTML(product, isOnSale = false)
        {
            const isInCart = cart.some(item => item.id === product.id);
            const cartButtonClass = isInCart ? 'active' : '';
            const cartButtonText = isInCart ? 'Item in cart' : 'Add to cart';

            return ` 
                <div class="swiper-slide product" style="cursor:pointer;" data-id="${product.id}">
                    ${isOnSale && product.oldPrice ? `
                        <span class="sale_present">
                            %${Math.floor((product.oldPrice - product.price) / product.oldPrice * 100)}
                        </span>
                    ` : ''}
                    <div class="img_product">
                        <img src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <p class="name_product">${product.name}</p>
                    <div class="price">
                        <p><span>$${product.price}</span></p>
                        ${product.oldPrice ? `<p class="oldPrice">$${product.oldPrice}</p>` : ''}
                    </div>
                    <div class="icons">
                        <button class="btn_add_cart ${cartButtonClass}" data-id="${product.id}">
                            <i class="fa-solid fa-cart-shopping"></i> ${cartButtonText}
                        </button>
                        <span class="icon_product" data-id="${product.id}">
                            <i class="fa-regular fa-heart"></i>
                        </span>
                    </div>
                </div>
            `;
        }

        // Populate product sections and add event listeners
        if (swiper_items_sale)
        {
            const saleProducts = products.filter(product => product.oldPrice);
            swiper_items_sale.innerHTML = saleProducts.map(product =>
                createProductHTML(product, true)).join('');
        }

        if (swiper_elctronics)
        {
            const electronicsProducts = products.filter(product =>
                product.category === "Electronics");
            swiper_elctronics.innerHTML = electronicsProducts.map(product =>
                createProductHTML(product)).join('');
        }

        if (swiper_appliances)
        {
            const appliancesProducts = products.filter(product =>
                product.category === "Appliances");
            swiper_appliances.innerHTML = appliancesProducts.map(product =>
                createProductHTML(product)).join('');
        }

        if (swiper_mobiles)
        {
            const mobileProducts = products.filter(product =>
                product.category === "Mobiles");
            swiper_mobiles.innerHTML = mobileProducts.map(product =>
                createProductHTML(product)).join('');

            // If you want to re-initialize your slider, add your slider init code here.
        }

        // Inline Add to Cart button handler after rendering
        document.querySelectorAll('.btn_add_cart').forEach(button =>
        {
            button.addEventListener('click', function (e)
            {
                e.preventDefault();
                e.stopPropagation();
                // Check if user is logged in
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (!currentUser)
                {
                    window.location.href = 'login.html';
                    return;
                }
                if (!this.classList.contains('active'))
                {
                    const productId = parseInt(this.dataset.id);
                    const product = products.find(p => p.id === productId);
                    if (product)
                    {
                        let cart = JSON.parse(localStorage.getItem('cart')) || [];
                        // Check if product is already in cart
                        const existingItemIndex = cart.findIndex(item => item.id === productId);
                        if (existingItemIndex === -1)
                        {
                            // Add to cart
                            cart.push({ ...product, quantity: 1 });
                            localStorage.setItem('cart', JSON.stringify(cart));
                            // Update button state
                            this.classList.add('active');
                            this.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in cart`;
                            // Update cart display
                            updateCartDisplay();
                        }
                    }
                }
            });
        });

        // Add click handler to product image only
        document.querySelectorAll('.swiper-slide.product .img_product img').forEach(img =>
        {
            img.addEventListener('click', function (e)
            {
                const card = this.closest('.swiper-slide.product');
                const productId = card.getAttribute('data-id');
                goToProductDetails(productId);
                e.stopPropagation(); // Prevent slider drag/click issues
            });
        });

        // Initialize cart display
        updateCartDisplay();
    })
    .catch(error =>
    {
        console.error('Error loading products:', error);
    });





// Function to update cart display
function updateCartDisplay()
{
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart_items');
    const cartCount = document.querySelector('.count_item_header');
    const cartItemCount = document.querySelector('.Count_item_cart');
    const cartTotal = document.querySelector('.price_cart_total');

    // Update counts
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
    cartItemCount.textContent = totalItems;

    // Update cart items display
    if (cartItemsContainer)
    {
        if (cart.length === 0)
        {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <p>Your cart is empty</p>
                </div>
            `;
        } else
        {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="item_cart">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="content">
                        <h4>${item.name}</h4>
                        <p class="price_cart">$${item.price}</p>
                        <div class="quantity_control">
                            <button onclick="updateQuantity(${item.id}, -1)" class="decrease_quantity">-</button>
                            <span class="quantity">${item.quantity || 1}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="Increase_quantity">+</button>
                        </div>
                    </div>
                    <button class="delete_item" onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Update total
    if (cartTotal)
    {
        const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Make updateCartDisplay available globally
window.updateCartDisplay = updateCartDisplay;