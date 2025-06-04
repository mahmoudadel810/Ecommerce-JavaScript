



document.addEventListener('DOMContentLoaded', () =>
{
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId)
    {
        window.location.href = 'index.html';
        return;
    }

    // Fetch product details
    fetch('../products.json')
        .then(response => response.json())
        .then(data =>
        {
            const product = data.products.find(p => p.id === parseInt(productId));
            if (!product)
            {
                window.location.href = 'index.html';
                return;
            }

            // Update page with product details
            document.getElementById('productImage').src = product.img;
            document.getElementById('productName').textContent = product.name;
            document.getElementById('productPrice').textContent = product.price;
            document.getElementById('productCategory').textContent = product.category;

            // Handle old price and discount
            if (product.old_price)
            {
                document.getElementById('productOldPrice').textContent = product.old_price;
                const discountPercentage = Math.floor((product.old_price - product.price) / product.old_price * 100);
                document.getElementById('discountBadge').textContent = `-${discountPercentage}%`;
            }
            
            else
            {
                document.getElementById('oldPriceContainer').style.display = 'none';
                document.getElementById('discountBadge').style.display = 'none';
            }

            // Setup Add to Cart button
            const addToCartBtn = document.getElementById('addToCartBtn');
            addToCartBtn.addEventListener('click', () =>
            {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (!currentUser)
                {
                    window.location.href = 'login.html';
                    return;
                }
                addToCart(product);
                addToCartBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Added to Cart';
                addToCartBtn.disabled = true;
            });

            // Setup Add to Wishlist button
            const addToWishlistBtn = document.getElementById('addToWishlistBtn');
            addToWishlistBtn.addEventListener('click', () =>
            {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (!currentUser)
                {
                    window.location.href = 'login.html';
                    return;
                }
                // Actually add to wishlist and update counter
                if (typeof addToWishlist === 'function') {
                    if (addToWishlist(product)) {
                        addToWishlistBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Added to Wishlist';
                        addToWishlistBtn.disabled = true;
                    }
                } else {
                    console.error('addToWishlist function not found!');
                }
            });
        })
        .catch(error =>
        {
            console.error('Error:', error);
            window.location.href = 'index.html';
        });
});

// Add to Cart function (reuse your existing cart logic)
function addToCart(product)
{
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(); // Make sure this function is available
}
