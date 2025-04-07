// Global variables
let products = [];
let filteredProducts = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('noResults');
const brandFilter = document.getElementById('brandFilter');
const categoryFilter = document.getElementById('categoryFilter');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load product data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            products = data.products;
            filteredProducts = [...products];
            displayProducts();
            loadingElement.style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading products:', error);
            loadingElement.innerHTML = '<p class="text-red-500">Error loading products. Please try again later.</p>';
        });

    // Set up event listeners
    brandFilter.addEventListener('change', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    closeModal.addEventListener('click', () => {
        productModal.classList.add('hidden');
    });
});

// Filter products based on selected filters
function filterProducts() {
    const brandValue = brandFilter.value.toLowerCase();
    const categoryValue = categoryFilter.value.toLowerCase();

    filteredProducts = products.filter(product => {
        const matchesBrand = brandValue === '' || product.brand.toLowerCase() === brandValue;
        const matchesCategory = categoryValue === '' || product.category.toLowerCase() === categoryValue;
        return matchesBrand && matchesCategory;
    });

    displayProducts();
}

// Display filtered products
function displayProducts() {
    productGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        noResultsElement.classList.remove('hidden');
        return;
    }

    noResultsElement.classList.add('hidden');

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden transition duration-300';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg">${product.name}</h3>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${product.brand}</span>
                </div>
                <p class="text-gray-600 text-sm mb-3">${product.summary}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-600">$${product.price.toFixed(2)}</span>
                    <button onclick="showProductDetails(${product.id})" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Show product details in modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Set modal content
    document.getElementById('modalTitle').textContent = `${product.brand} ${product.name}`;
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('specsLink').href = product.specs_url;

    const detailsContainer = document.getElementById('modalDetails');
    detailsContainer.innerHTML = `
        <div>
            <h4 class="font-bold text-gray-800">Price</h4>
            <p>$${product.price.toFixed(2)}</p>
        </div>
        <div>
            <h4 class="font-bold text-gray-800">Category</h4>
            <p>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
        </div>
        <div>
            <h4 class="font-bold text-gray-800">Key Features</h4>
            <ul class="list-disc list-inside">
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
    `;

    // Show modal
    productModal.classList.remove('hidden');
}

// Close modal when clicking outside
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.add('hidden');
    }
});