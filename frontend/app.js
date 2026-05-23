// Global state
var appState = {
    menu: [],
    cart: [],
    apiUrl: 'http://localhost:3000'
};

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    loadMenu();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    var submitBtn = document.getElementById('submitBtn');
    var clearBtn = document.getElementById('clearBtn');
    
    submitBtn.addEventListener('click', submitOrder);
    clearBtn.addEventListener('click', clearCart);
}

// Load menu from API
function loadMenu() {
    var menuUrl = appState.apiUrl + '/api/menu';
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', menuUrl, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            appState.menu = JSON.parse(xhr.responseText);
            renderMenu();
        }
    };
    xhr.onerror = function() {
        console.error('Error loading menu');
    };
    xhr.send();
}

// Render menu items
function renderMenu() {
    var menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';
    
    appState.menu.forEach(function(item) {
        var menuItemEl = createMenuItemElement(item);
        menuContainer.appendChild(menuItemEl);
    });
}

// Create menu item element
function createMenuItemElement(item) {
    var div = document.createElement('div');
    div.className = 'menu-item';
    
    var priceStr = formatPrice(item.price);
    
    div.innerHTML = 
        '<div class="menu-item-name">' + item.name + '</div>' +
        '<div class="menu-item-category">' + item.category + '</div>' +
        '<div class="menu-item-description">' + item.description + '</div>' +
        '<div class="menu-item-price">RM ' + priceStr + '</div>' +
        '<div class="quantity-control">' +
            '<button class="qty-btn qty-minus" data-id="' + item.id + '">−</button>' +
            '<input type="text" class="qty-input qty-input-' + item.id + '" value="1" readonly>' +
            '<button class="qty-btn qty-plus" data-id="' + item.id + '">+</button>' +
        '</div>' +
        '<button class="add-btn" data-id="' + item.id + '" data-name="' + item.name + '" data-price="' + item.price + '">Tambah</button>';
    
    // Setup quantity buttons
    var minusBtn = div.querySelector('.qty-minus');
    var plusBtn = div.querySelector('.qty-plus');
    var qtyInput = div.querySelector('.qty-input-' + item.id);
    var addBtn = div.querySelector('.add-btn');
    
    minusBtn.addEventListener('click', function() {
        var qty = parseInt(qtyInput.value);
        if (qty > 1) {
            qtyInput.value = qty - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        var qty = parseInt(qtyInput.value);
        qtyInput.value = qty + 1;
    });
    
    addBtn.addEventListener('click', function() {
        var qty = parseInt(qtyInput.value);
        addToCart(item.id, item.name, item.price, qty);
        qtyInput.value = 1;
    });
    
    return div;
}

// Add item to cart
function addToCart(id, name, price, quantity) {
    var existingItem = null;
    
    for (var i = 0; i < appState.cart.length; i++) {
        if (appState.cart[i].id === id) {
            existingItem = appState.cart[i];
            break;
        }
    }
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        appState.cart.push({
            id: id,
            name: name,
            price: price,
            quantity: quantity
        });
    }
    
    renderCart();
}

// Render cart
function renderCart() {
    var orderItemsDiv = document.getElementById('orderItems');
    var totalPriceSpan = document.getElementById('totalPrice');
    
    if (appState.cart.length === 0) {
        orderItemsDiv.innerHTML = '<p class="empty-message">Tiada pesanan</p>';
        totalPriceSpan.textContent = '0';
        return;
    }
    
    orderItemsDiv.innerHTML = '';
    var total = 0;
    
    appState.cart.forEach(function(item, index) {
        var itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        var itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        
        var itemNameDiv = document.createElement('span');
        itemNameDiv.className = 'order-item-name';
        itemNameDiv.textContent = item.name;
        
        var itemQtyDiv = document.createElement('span');
        itemQtyDiv.className = 'order-item-qty';
        itemQtyDiv.textContent = item.quantity + 'x';
        
        var itemPriceDiv = document.createElement('span');
        itemPriceDiv.className = 'order-item-price';
        itemPriceDiv.textContent = 'RM ' + formatPrice(itemTotal);
        
        var removeBtn = document.createElement('button');
        removeBtn.className = 'order-item-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', function() {
            removeFromCart(index);
        });
        
        itemDiv.appendChild(itemNameDiv);
        itemDiv.appendChild(itemQtyDiv);
        itemDiv.appendChild(itemPriceDiv);
        itemDiv.appendChild(removeBtn);
        
        orderItemsDiv.appendChild(itemDiv);
    });
    
    totalPriceSpan.textContent = formatPrice(total);
}

// Remove item from cart
function removeFromCart(index) {
    appState.cart.splice(index, 1);
    renderCart();
}

// Clear cart
function clearCart() {
    appState.cart = [];
    renderCart();
    document.getElementById('customerName').value = '';
}

// Format price
function formatPrice(price) {
    return price.toFixed(2);
}

// Submit order
function submitOrder() {
    var customerName = document.getElementById('customerName').value.trim();
    var successMessage = document.getElementById('successMessage');
    
    if (!customerName) {
        alert('Sila masukkan nama pemesan');
        return;
    }
    
    if (appState.cart.length === 0) {
        alert('Sila pilih sekurang-kurangnya satu item');
        return;
    }
    
    var total = 0;
    appState.cart.forEach(function(item) {
        total += item.price * item.quantity;
    });
    
    var orderData = {
        customerName: customerName,
        items: appState.cart,
        totalPrice: total
    };
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', appState.apiUrl + '/api/orders', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        if (xhr.status === 201) {
            successMessage.style.display = 'block';
            clearCart();
            
            setTimeout(function() {
                successMessage.style.display = 'none';
            }, 3000);
        } else {
            alert('Gagal membuat pesanan');
        }
    };
    
    xhr.onerror = function() {
        alert('Ralat: Tidak dapat tersambung ke pelayan');
    };
    
    xhr.send(JSON.stringify(orderData));
}
