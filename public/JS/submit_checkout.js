const scriptURL = "https://script.google.com/macros/s/AKfycbxJgEIAszL-cBrGuC3ikzvRcVwFGtQHgcX8mZ-QKAbV7bR4eHH5azfk03MIx6_-MDVS/exec";

let form = document.getElementById("form_contact");

document.addEventListener('DOMContentLoaded', () =>
{
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser)
    {
        window.location.href = 'login.html';
        return;
    }

    // Initialize the checkout page
    initializeCheckout();
});

function initializeCheckout()
{
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0)
    {
        window.location.href = 'index.html';
        return;
    }

    // Populate user information if available
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser)
    {
        document.getElementById('email').value = currentUser.email;
        document.getElementById('name').value = currentUser.name;
    }

    // Display cart items
    displayCheckoutItems();

    // Setup event listeners
    setupEventListeners();
}

function displayCheckoutItems()
{
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.getElementById('checkout_items');
    const subtotalElement = document.querySelector('.subtotal_checkout');
    const totalElement = document.querySelector('.total_checkout');

    let subtotal = 0;

    checkoutItems.innerHTML = cart.map(item =>
    {
        const itemTotal = item.price * (item.quantity || 1);
        subtotal += itemTotal;
        return `
            <div class="item_cart">
                <div class="image_name">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="content">
                        <h4>${item.name}</h4>
                        <p class="price_cart">$${item.price}</p>
                        <div class="quantity">Quantity: ${item.quantity || 1}</div>
                    </div>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');

    // Update totals
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + 20).toFixed(2)}`; // Adding $20 shipping
}

function setupEventListeners()
{
    // Payment method toggle
    const paymentInputs = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('card-details');

    paymentInputs.forEach(input =>
    {
        input.addEventListener('change', (e) =>
        {
            cardDetails.style.display = e.target.value === 'card' ? 'block' : 'none';
        });
    });

    // Form submission
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', handleSubmitOrder);
}

function handleSubmitOrder(e)
{
    e.preventDefault();

    // Create and save order
    const order = createOrderObject();
    saveOrder(order);

    // Show success message and redirect
    showOrderSuccess();
}

function createOrderObject()
{
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    return {
        orderId: generateOrderId(),
        date: new Date().toISOString(),
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            country: formData.get('country'),
            phone: formData.get('phone')
        },
        items: cart,
        payment: {
            method: formData.get('payment'),
            total: calculateTotal()
        },
        status: 'pending'
    };
}

function generateOrderId()
{
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function calculateTotal()
{
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    return subtotal + 20; // Adding $20 shipping
}

function saveOrder(order)
{
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');
}

function showOrderSuccess()
{
    alert('Order placed successfully!');
    window.location.href = 'index.html';
}

form.addEventListener("submit", (e) =>
{
    e.preventDefault();

    fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
    })
        .then((response) =>
        {
            setTimeout(() =>
            {
                localStorage.removeItem("cart");
                window.location.reload();
            }, 3000);
        })
        .catch((error) => console.error("eroor!", error.message));
});