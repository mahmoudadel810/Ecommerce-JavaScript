let allProducts = [];
let filteredProducts = [];

// Fetch products and initialize the page
async function initializeProducts()
{
    try
    {
        const response = await fetch('../products.json');
        const data = await response.json();
        allProducts = data.products;
        filteredProducts = [...allProducts];
        applyFiltersAndSort();
    } catch (error)
    {
        console.error('Error fetching products:', error);
    }
}
// Function to navigate to product details
function goToProductDetails(productId)
{
    window.location.href = `../html/product-details.html?id=${productId}`;
}

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

// Function to apply filters and sort
function applyFiltersAndSort()
{
    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('.category-filters input:checked'))
        .map(checkbox => checkbox.value);

    // Filter products by category
    filteredProducts = allProducts.filter(product =>
    {
        return selectedCategories.includes('all') ||
            selectedCategories.includes(product.category);
    });

    // Apply sorting
    const sortValue = document.getElementById('sortSelect').value;
    switch (sortValue)
    {
        case 'price-low-high':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high-low':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-a-z':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-z-a':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    displayProducts();
}

// Function to display products
function displayProducts()
{
    const productsGrid = document.getElementById('productsGrid');

    if (filteredProducts.length === 0)
    {
        productsGrid.innerHTML = `
            <div class="no-products">
                <p>No products found matching your criteria.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product" onclick="goToProductDetails(${product.id})" style="cursor:pointer;">
            ${product.oldPrice ? `
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
                ${product.oldPrice ? `<p class="old_price">$${product.oldPrice}</p>` : ''}
            </div>
            <div class="icons">
                <button class="btn_add_cart" data-id="${product.id}" onclick="event.stopPropagation();">
                    <i class="fa-solid fa-cart-shopping"></i> Add to cart
                </button>
                <span class="icon_product" data-id="${product.id}" onclick="event.stopPropagation();">
                    <i class="fa-regular fa-heart"></i>
                </span>
            </div>
        </div>
    `).join('');

    // Attach add to cart logic
    document.querySelectorAll('.btn_add_cart').forEach(button =>
    {
        button.addEventListener('click', (event) =>
        {
            const productId = event.target.closest('.btn_add_cart').getAttribute('data-id');
            const selectedProduct = allProducts.find(product => product.id == productId);
            addToCart(selectedProduct);
            document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`).forEach(btn =>
            {
                btn.classList.add("active");
                btn.innerHTML = `<i class=\"fa-solid fa-cart-shopping\"></i> Item in cart`;
            });
        });
    });

    // Attach wishlist logic
    document.querySelectorAll('.icon_product').forEach(span =>
    {
        span.addEventListener('click', function (e)
        {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.id);
            const product = allProducts.find(p => p.id === productId);
            if (!product) return;
            // Use global addToWishlist/removeFromWishlist for consistency
            let isInWishlist = false;
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            if (wishlist.find(item => item.id === productId))
            {
                removeFromWishlist(productId);
            } else
            {
                addToWishlist(product);
            }
            // updateWishlist and updateWishlistButtons will be called by those functions
        });
    });

}

// Update wishlist count in header/sidebar
function updateWishlistDisplay()
{
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const countSpan = document.querySelector('.count_wishlist_items');
    if (countSpan) countSpan.textContent = wishlist.length;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () =>
{
    initializeProducts();

    // Category filter changes
    document.querySelectorAll('.category-filters input').forEach(checkbox =>
    {
        checkbox.addEventListener('change', () =>
        {
            if (checkbox.value === 'all' && checkbox.checked)
            {
                // Uncheck other categories when "All" is selected
                document.querySelectorAll('.category-filters input:not([value="all"])')
                    .forEach(cb => cb.checked = false);
            } else if (checkbox.checked)
            {
                // Uncheck "All" when other category is selected
                document.querySelector('.category-filters input[value="all"]').checked = false;
            }
            applyFiltersAndSort();
        });
    });

    // Sort changes
    document.getElementById('sortSelect').addEventListener('change', applyFiltersAndSort);
});
