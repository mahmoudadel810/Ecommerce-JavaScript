let searchTimeout;
let allProducts = [];

function initializeSearch()
{
    const searchInput = document.getElementById('search');
    const searchResults = document.getElementById('searchResults');
    const categorySelect = document.getElementById('category');

    if (!searchInput || !searchResults || !categorySelect) return;

    // Load products data if not already loaded
    if (allProducts.length === 0)
    {
        fetch('../products.json')
            .then(response => response.json())
            .then(data =>
            {
                allProducts = data.products;
                setupSearchEventListeners();
            })
            .catch(error => console.error('Error loading products:', error));
    } else
    {
        setupSearchEventListeners();
    }
}

function setupSearchEventListeners()
{
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');

    searchInput.addEventListener('input', (e) =>
    {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2)
        {
            document.getElementById('searchResults').classList.remove('active');
            return;
        }

        searchTimeout = setTimeout(() =>
        {
            searchProducts(query);
        }, 300);
    });

    categorySelect.addEventListener('change', () =>
    {
        const query = searchInput.value.trim();
        if (query.length >= 2)
        {
            searchProducts(query);
        }
    });

    document.addEventListener('click', (e) =>
    {
        if (!e.target.closest('.search_box'))
        {
            document.getElementById('searchResults').classList.remove('active');
        }
    });
}

function searchProducts(query)
{
    const searchResults = document.getElementById('searchResults');
    const selectedCategory = document.getElementById('category').value;

    const filteredProducts = allProducts.filter(product =>
    {
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' ||
            product.category === selectedCategory;
        return matchesQuery && matchesCategory;
    });

    displayResults(filteredProducts, query);
}

function displayResults(products, query)
{
    const searchResults = document.getElementById('searchResults');

    if (products.length === 0)
    {
        searchResults.innerHTML = `
            <div class="no-results">
                No products found matching "${query}"
            </div>
        `;
    } else
    {
        searchResults.innerHTML = products.map(product => `
            <div class="search-item" onclick="goToProductDetails(${product.id})">
                <img src="${product.img}" alt="${product.name}">
                <div class="search-item-details">
                    <div class="search-item-name">${product.name}</div>
                    <div class="search-item-category">${product.category}</div>
                </div>
                <div class="search-item-price">$${product.price}</div>
            </div>
        `).join('');
    }

    searchResults.classList.add('active');
}

function goToProductDetails(productId)
{
    window.location.href = `../html/product-details.html?id=${productId}`;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeSearch);