let category_nav_list = document.querySelector(".category_nav_list");

function Open_Categ_list()
{
  category_nav_list.classList.toggle("active");
}

let nav_links = document.querySelector(".nav_links");

function open_Menu()
{
  nav_links.classList.toggle("active");
}

var cart = document.querySelector(".cart");

function open_close_cart()
{
  const cart = document.querySelector(".cart");
  cart.classList.toggle("active");

  // Close wishlist if open
  const wishlistSidebar = document.querySelector(".wishlist-sidebar");
  if (wishlistSidebar && wishlistSidebar.classList.contains("active"))
  {
    wishlistSidebar.classList.remove("active");
  }
}

fetch("https://javascriptserver.vercel.app/api/products")
  .then(response => response.json())
  .then(data =>
  {
    const products = data.products;
    const addToCartButtons = document.querySelectorAll(".btn_add_cart"); //itemsin home

    addToCartButtons.forEach(button =>
    {
      button.addEventListener("click", event =>
      {
        const productId = event.target.getAttribute("data-id");
        const selcetedProduct = products.find(product => product.id == productId);

        addToCart(selcetedProduct);

        const allMatchingButtons = document.querySelectorAll(
          `.btn_add_cart[data-id="${productId}"]`
        );

        allMatchingButtons.forEach(btn =>
        {
          btn.classList.add("active");
          btn.innerHTML = `      <i class=\"fa-solid fa-cart-shopping\"></i> Item in cart`;
        });
      });
    });
  })
  .catch(error =>
  {
    console.error('Error fetching products:', error);
  });

// Add error handling for localStorage operations
function safeGetFromStorage(key)
{
  try
  {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error)
  {
    console.error(`Error reading from localStorage: ${error}`);
    return [];
  }
}

function safeSetToStorage(key, value)
{
  try
  {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error)
  {
    console.error(`Error writing to localStorage: ${error}`);
    return false;
  }
}

function addToCart(product)
{
  if (!product || !product.id)
  {
    console.error('Invalid product data');
    return false;
  }

  let cart = safeGetFromStorage("cart");
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex === -1)
  {
    cart.push({ ...product, quantity: 1 });
    const success = safeSetToStorage("cart", cart);
    if (success)
    {
      updateButtonState(product.id, true);
      updateCartDisplay();
      return true;
    }
  }
  return false;
}

function updateQuantity(productId, change)
{
  let cart = safeGetFromStorage("cart");
  const existingItemIndex = cart.findIndex(item => item.id === productId);

  if (existingItemIndex !== -1)
  {
    // Update existing item quantity
    cart[existingItemIndex].quantity =
      (cart[existingItemIndex].quantity || 1) + change;

    // Remove item if quantity is 0 or less
    if (cart[existingItemIndex].quantity <= 0)
    {
      cart.splice(existingItemIndex, 1);
      updateButtonState(productId, false);
    }
  }

  const success = safeSetToStorage("cart", cart);
  if (success)
  {
    updateCartDisplay();
  }
}

// Add loading state for cart operations
function updateCartDisplay()
{
  const cartItemsContainer = document.getElementById("cart_items");
  if (cartItemsContainer)
  {
    cartItemsContainer.innerHTML = '<div class="loading">Loading cart...</div>';
  }

  const cart = safeGetFromStorage("cart");
  const cartCount = document.querySelector(".count_item_header");
  const cartItemCount = document.querySelector(".Count_item_cart");
  const cartTotal = document.querySelector(".price_cart_total");

  // Update counts
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (cartCount) cartCount.textContent = totalItems;
  if (cartItemCount) cartItemCount.textContent = totalItems;

  // Update cart items display
  if (cartItemsContainer)
  {
    if (cart.length === 0)
    {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <i class="fa-solid fa-cart-shopping"></i>
          <p>Your cart is empty</p>
          <a href="products.html" class="btn">Continue Shopping</a>
        </div>
      `;
    } else
    {
      cartItemsContainer.innerHTML = cart
        .map(
          item => `
          <div class="item_cart" data-id="${item.id}">
            <img src="${item.img}" alt="${item.name}" loading="lazy">
            <div class="content">
              <h4>${item.name}</h4>
              <p class="price_cart">$${(item.price * item.quantity).toFixed(2)}</p>
              <div class="quantity_control">
                <button onclick="updateQuantity(${item.id}, -1)" class="decrease_quantity" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="Increase_quantity">+</button>
              </div>
            </div>
            <button class="delete_item" onclick="removeFromCart(${item.id})">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `
        )
        .join("");
    }
  }

  // Update total
  if (cartTotal)
  {
    const total = cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
}

function removeFromCart(productId)
{
  let cart = safeGetFromStorage("cart");
  cart = cart.filter(item => item.id !== productId);
  const success = safeSetToStorage("cart", cart);
  if (success)
  {
    updateButtonState(productId, false);
    updateCartDisplay();
  }
}

function updateButtonState(productId, isInCart)
{
  const button = document.querySelector(
    `.btn_add_cart[data-id="${productId}"]`
  );
  if (button)
  {
    if (isInCart)
    {
      button.classList.add("active");
      button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in cart`;
    } else
    {
      button.classList.remove("active");
      button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to cart`;
    }
  }
}

// Make functions globally available
window.updateQuantity = updateQuantity;
window.updateCartDisplay = updateCartDisplay;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

// Initialize cart display on page load
document.addEventListener("DOMContentLoaded", updateCartDisplay);

// User authentication UI handling
const userDropdown = document.getElementById("userDropdown");
const authButtons = document.getElementById("authButtons");
const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser)
{
  userDropdown.style.display = "block";
  authButtons.style.display = "none";
  userName.textContent = currentUser.name;
} else
{
  userDropdown.style.display = "none";
  authButtons.style.display = "flex";
}

// Toggle dropdown menu
if (dropdownToggle)
{
  dropdownToggle.addEventListener("click", () =>
  {
    dropdownMenu.classList.toggle("active");
  });
}

// Handle logout
if (logoutBtn)
{
  logoutBtn.addEventListener("click", e =>
  {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.reload();
  });
}

// Close dropdown when clicking outside
document.addEventListener("click", e =>
{
  if (
    dropdownMenu &&
    dropdownMenu.classList.contains("active") &&
    !e.target.closest(".user-dropdown")
  )
  {
    dropdownMenu.classList.remove("active");
  }
});

// Create scroll to top button
document.addEventListener('DOMContentLoaded', function ()
{
  // Create the scroll-to-top button
  const scrollTopBtn = document.createElement('div');
  scrollTopBtn.className = 'scroll-to-top';
  scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(scrollTopBtn);

  // Show/hide the button based on scroll position
  window.addEventListener('scroll', function ()
  {
    if (window.pageYOffset > 300)
    {
      scrollTopBtn.classList.add('show');
    } else
    {
      scrollTopBtn.classList.remove('show');
    }
  });

  // Scroll to top when the button is clicked
  scrollTopBtn.addEventListener('click', function ()
  {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
