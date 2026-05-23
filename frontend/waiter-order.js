// Waiter Order Taker State
var waiterOrderState = {
    menu: [],
    cart: [],
    apiUrl: window.location.origin
};

// Initialize on page load
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
    var menuUrl = waiterOrderState.apiUrl + '/api/menu';
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', menuUrl, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            waiterOrderState.menu = JSON.parse(xhr.responseText);
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
    
    // Group menu items by type
    var makananItems = waiterOrderState.menu.filter(function(item) {
        return item.type === 'makanan';
    });
    
    var minumanItems = waiterOrderState.menu.filter(function(item) {
        return item.type === 'minuman';
    });
    
    // Create Makanan section
    if (makananItems.length > 0) {
        var makananSection = document.createElement('div');
        makananSection.className = 'menu-section-category';
        
        var makananTitle = document.createElement('h3');
        makananTitle.className = 'menu-section-title makanan-title';
        makananTitle.textContent = '🍽️ MAKANAN';
        makananSection.appendChild(makananTitle);
        
        var makananGrid = document.createElement('div');
        makananGrid.className = 'menu-grid-category';
        
        makananItems.forEach(function(item) {
            var menuItemEl = createMenuItemElement(item);
            makananGrid.appendChild(menuItemEl);
        });
        
        makananSection.appendChild(makananGrid);
        menuContainer.appendChild(makananSection);
    }
    
    // Create Minuman section
    if (minumanItems.length > 0) {
        var minumanSection = document.createElement('div');
        minumanSection.className = 'menu-section-category';
        
        var minumanTitle = document.createElement('h3');
        minumanTitle.className = 'menu-section-title minuman-title';
        minumanTitle.textContent = '🥤 MINUMAN';
        minumanSection.appendChild(minumanTitle);
        
        var minumanGrid = document.createElement('div');
        minumanGrid.className = 'menu-grid-category';
        
        minumanItems.forEach(function(item) {
            var menuItemEl = createMenuItemElement(item);
            minumanGrid.appendChild(menuItemEl);
        });
        
        minumanSection.appendChild(minumanGrid);
        menuContainer.appendChild(minumanSection);
    }
}

// Create menu item element
function createMenuItemElement(item) {
    var div = document.createElement('div');
    div.className = 'menu-item';
    
    var priceStr = formatPrice(item.price);
    
    div.innerHTML = 
        '<div class="menu-item-name">' + item.name + '</div>' +
        '<div class="menu-item-category">' + item.category + '</div>' +
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
    
    for (var i = 0; i < waiterOrderState.cart.length; i++) {
        if (waiterOrderState.cart[i].id === id) {
            existingItem = waiterOrderState.cart[i];
            break;
        }
    }
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        waiterOrderState.cart.push({
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
    var totalItemsSpan = document.getElementById('totalItems');
    var totalPriceSpan = document.getElementById('totalPrice');
    
    if (waiterOrderState.cart.length === 0) {
        orderItemsDiv.innerHTML = '<p class="empty-message">Tiada pesanan</p>';
        totalItemsSpan.textContent = '0';
        totalPriceSpan.textContent = '0.00';
        return;
    }
    
    orderItemsDiv.innerHTML = '';
    var total = 0;
    var totalItems = 0;
    
    waiterOrderState.cart.forEach(function(item, index) {
        var itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;
        
        var itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        
        var itemInfoDiv = document.createElement('div');
        itemInfoDiv.className = 'order-item-info';
        
        var itemNameDiv = document.createElement('div');
        itemNameDiv.className = 'order-item-name';
        itemNameDiv.textContent = item.name;
        
        var itemQtyDiv = document.createElement('div');
        itemQtyDiv.className = 'order-item-qty';
        itemQtyDiv.textContent = 'Qty: ' + item.quantity + ' × RM ' + formatPrice(item.price);
        
        itemInfoDiv.appendChild(itemNameDiv);
        itemInfoDiv.appendChild(itemQtyDiv);
        
        var itemPriceDiv = document.createElement('div');
        itemPriceDiv.className = 'order-item-price';
        itemPriceDiv.textContent = 'RM ' + formatPrice(itemTotal);
        
        var removeBtn = document.createElement('button');
        removeBtn.className = 'order-item-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', function() {
            removeFromCart(index);
        });
        
        itemDiv.appendChild(itemInfoDiv);
        itemDiv.appendChild(itemPriceDiv);
        itemDiv.appendChild(removeBtn);
        
        orderItemsDiv.appendChild(itemDiv);
    });
    
    totalItemsSpan.textContent = totalItems;
    totalPriceSpan.textContent = 'RM ' + formatPrice(total);
}

// Remove item from cart
function removeFromCart(index) {
    waiterOrderState.cart.splice(index, 1);
    renderCart();
}

// Clear cart
function clearCart() {
    waiterOrderState.cart = [];
    renderCart();
    document.getElementById('customerName').value = '';
    document.getElementById('tableNumber').value = '';
    document.getElementById('orderTypeDineIn').checked = true;
}

// Format price
function formatPrice(price) {
    return price.toFixed(2);
}

// Submit order
function submitOrder() {
    var customerName = document.getElementById('customerName').value.trim();
    var tableNumber = document.getElementById('tableNumber').value.trim();
    var orderType = document.querySelector('input[name="orderType"]:checked').value;
    var successMessage = document.getElementById('successMessage');
    
    if (orderType === 'dine-in' && !tableNumber) {
        alert('Sila masukkan nombor meja untuk pesanan letak meja');
        return;
    }
    
    // If no customer name, use table number as identifier
    if (!customerName) {
        customerName = 'Pelanggan';
    }
    
    // Format customer name based on order type
    if (orderType === 'dine-in') {
        customerName = customerName + ' (Meja ' + tableNumber + ')';
    } else {
        customerName = customerName + ' (Bungkus)';
    }
    
    if (waiterOrderState.cart.length === 0) {
        alert('Sila pilih sekurang-kurangnya satu item');
        return;
    }
    
    var total = 0;
    waiterOrderState.cart.forEach(function(item) {
        total += item.price * item.quantity;
    });
    
    var orderData = {
        customerName: customerName,
        orderType: orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : null,
        items: waiterOrderState.cart,
        totalPrice: total
    };
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', waiterOrderState.apiUrl + '/api/orders', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        if (xhr.status === 201) {
            successMessage.style.display = 'block';
            clearCart();
            
            setTimeout(function() {
                successMessage.style.display = 'none';
            }, 2000);
        } else {
            alert('Gagal menyimpan pesanan');
        }
    };
    
    xhr.onerror = function() {
        alert('Ralat: Tidak dapat tersambung ke pelayan');
    };
    
    xhr.send(JSON.stringify(orderData));
}
