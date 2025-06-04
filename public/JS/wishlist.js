let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
const wishlistCount = document.querySelector('.count_favourite');
const wishlistSidebar = document.querySelector('.wishlist-sidebar');
const wishlistItemsContainer = document.getElementById('wishlist_items');

// Toggle wishlist sidebar
function toggleWishlistSidebar()
{
    wishlistSidebar.classList.toggle('active');
    // Close cart if open
    const cart = document.querySelector('.cart');
    if (cart.classList.contains('active'))
    {
        cart.classList.remove('active');
    }
}

// Close wishlist when clicking close button
document.querySelector('.close_wishlist').addEventListener('click', () =>
{
    wishlistSidebar.classList.remove('active');
});

// Close wishlist when clicking Continue Shopping
document.querySelector('.btn_wishlist.trans_bg').addEventListener('click', () =>
{
    wishlistSidebar.classList.remove('active');
});

// Add to wishlist
function addToWishlist(product)
{
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser)
    {
        window.location.href = 'login.html';
        return false;
    }

    if (!wishlistItems.some(item => item.id === product.id))
    {
        wishlistItems.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        updateWishlist();
        updateWishlistButtons();
        return true;
    }
    return false;
}

// Remove from wishlist
function removeFromWishlist(productId)
{
    wishlistItems = wishlistItems.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    updateWishlist();
    updateWishlistButtons();
}

// Move item to cart
function moveToCart(product)
{
    addToCart(product);
    removeFromWishlist(product.id);
}

// Move all items to cart
function moveAllToCart()
{
    wishlistItems.forEach(item =>
    {
        addToCart(item);
    });
    wishlistItems = [];
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    updateWishlist();
    wishlistSidebar.classList.remove('active');
}

// Update wishlist display
function updateWishlist()
{
    // Update count in header
    if (wishlistCount)
    {
        wishlistCount.textContent = wishlistItems.length;
    }

    // Update count in sidebar
    const wishlistSidebarCount = document.querySelector('.count_wishlist_items');
    if (wishlistSidebarCount)
    {
        wishlistSidebarCount.textContent = wishlistItems.length;
    }

    // Update wishlist container
    if (wishlistItemsContainer)
    {
        if (wishlistItems.length === 0)
        {
            wishlistItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <p>Your wishlist is empty</p>
                </div>
            `;
        } else
        {
            wishlistItemsContainer.innerHTML = wishlistItems.map(item => `
                <div class="wishlist-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="wishlist-item-content">
                        <div class="wishlist-item-name">${item.name}</div>
                        <div class="wishlist-item-price">$${item.price}</div>
                        <div class="wishlist-item-actions">
                            <button onclick="moveToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="move-to-cart">
                                <i class="fa-solid fa-cart-shopping"></i> Move to Cart
                            </button>
                            <button onclick="removeFromWishlist(${item.id})" class="remove-from-wishlist">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Update wishlist heart icons
function updateWishlistButtons()
{
    document.querySelectorAll('.icon_product').forEach(button =>
    {
        const productId = parseInt(button.closest('.product').querySelector('.btn_add_cart').dataset.id);
        if (wishlistItems.some(item => item.id === productId))
        {
            button.innerHTML = '<i class="fa-solid fa-heart"></i>';
            button.classList.add('active');
        } else
        {
            button.innerHTML = '<i class="fa-regular fa-heart"></i>';
            button.classList.remove('active');
        }
    });
}

// Initialize wishlist
document.addEventListener('DOMContentLoaded', () =>
{
    // Load wishlist items from localStorage
    wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateWishlist();
    updateWishlistButtons();
});

// Add click handlers to wishlist hearts in products
document.addEventListener('click', (e) =>
{
    const wishlistButton = e.target.closest('.icon_product');
    if (wishlistButton)
    {
        e.preventDefault();
        e.stopPropagation();
        const productContainer = wishlistButton.closest('.product');
        const productId = parseInt(productContainer.querySelector('.btn_add_cart').dataset.id);

        fetch('../products.json')
            .then(response => response.json())
            .then(data =>
            {
                const product = data.products.find(p => p.id === productId);
                if (product)
                {
                    if (addToWishlist(product))
                    {
                        wishlistButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
                        wishlistButton.classList.add('active');
                    } else
                    {
                        removeFromWishlist(productId);
                        wishlistButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
                        wishlistButton.classList.remove('active');
                    }
                }
            });
    }
});
