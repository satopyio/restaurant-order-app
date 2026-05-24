// Dashboard State
var dashboardState = {
    orders: [],
    currentFilter: 'pending',
    apiUrl: window.location.origin,
    refreshInterval: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadOrders();
    
    // Auto-refresh every 5 seconds
    dashboardState.refreshInterval = setInterval(function() {
        loadOrders();
    }, 5000);
});

// Setup event listeners
function setupEventListeners() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var backBtn = document.getElementById('backBtn');
    var resetBtn = document.getElementById('resetBtn');
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
        });
    });
    
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    resetBtn.addEventListener('click', function() {
        if (confirm('Adakah anda pasti ingin reset semua pesanan? Ini tidak boleh dibatalkan!')) {
            resetAllOrders();
        }
    });
}

// Set active filter
function setActiveFilter(filter) {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var resetBtn = document.getElementById('resetBtn');
    
    filterBtns.forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    document.querySelector('[data-filter="' + filter + '"]').classList.add('active');
    
    dashboardState.currentFilter = filter;
    
    // Show/hide reset button only for "all" filter
    if (filter === 'all') {
        resetBtn.style.display = 'block';
    } else {
        resetBtn.style.display = 'none';
    }
    
    renderOrders();
}

// Load orders from API
function loadOrders() {
    var ordersUrl = dashboardState.apiUrl + '/api/orders';
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', ordersUrl, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            dashboardState.orders = JSON.parse(xhr.responseText);
            updateOrderCounts();
            renderOrders();
        }
    };
    xhr.onerror = function() {
        console.error('Error loading orders');
    };
    xhr.send();
}

// Update order counts
function updateOrderCounts() {
    var pending = 0;
    var ready = 0;
    var completed = 0;
    
    dashboardState.orders.forEach(function(order) {
        if (order.status === 'pending') pending++;
        else if (order.status === 'ready') ready++;
        else if (order.status === 'completed') completed++;
    });
    
    document.getElementById('pending-count').textContent = pending;
    document.getElementById('ready-count').textContent = ready;
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('all-count').textContent = dashboardState.orders.length;
}

// Render orders
function renderOrders() {
    var container = document.getElementById('ordersContainer');
    var emptyState = document.getElementById('emptyState');
    var totalSalesSection = document.getElementById('totalSalesSection');
    
    var filteredOrders = filterOrders();
    
    if (filteredOrders.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        totalSalesSection.style.display = 'none';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    container.innerHTML = '';
    
    filteredOrders.forEach(function(order) {
        var orderCard = createOrderCard(order);
        container.appendChild(orderCard);
    });
    
    // Show total sales if "Semua" filter is active
    if (dashboardState.currentFilter === 'all') {
        var totalSales = 0;
        dashboardState.orders.forEach(function(order) {
            totalSales += order.totalPrice;
        });
        
        document.getElementById('totalSalesAmount').textContent = formatPrice(totalSales);
        document.getElementById('totalOrdersInfo').textContent = dashboardState.orders.length;
        totalSalesSection.style.display = 'block';
    } else {
        totalSalesSection.style.display = 'none';
    }
}

// Filter orders
function filterOrders() {
    if (dashboardState.currentFilter === 'all') {
        return dashboardState.orders;
    }
    
    return dashboardState.orders.filter(function(order) {
        return order.status === dashboardState.currentFilter;
    });
}

// Create order card element
function createOrderCard(order) {
    var div = document.createElement('div');
    div.className = 'order-card ' + order.status;
    
    var orderId = order.id;
    var customerName = order.customerName;
    var createdTime = formatTime(order.createdAt);
    var totalPrice = formatPrice(order.totalPrice);
    var status = getStatusLabel(order.status);
    var statusClass = 'status-' + order.status;
    
    var itemsHtml = '';
    order.items.forEach(function(item) {
        var itemPrice = formatPrice(item.price);
        itemsHtml += 
            '<div class="order-item">' +
                '<span class="item-name">' + item.name + '</span>' +
                '<span class="item-qty">x' + item.quantity + '</span>' +
                '<div class="item-price">RM ' + itemPrice + '</div>' +
            '</div>';
    });
    
    var actionButtonsHtml = getActionButtons(order.status);
    
    // Format order type display
    var safeOrderType = order.orderType === 'takeaway' ? 'takeaway' : 'dine-in';
    var orderTypeIcon = safeOrderType === 'dine-in' ? '🪑' : '📦';
    var orderTypeLabel = safeOrderType === 'dine-in' ? 'Letak Meja' : 'Bungkus';
    var noteHtml = order.note && order.note.trim() ? '<div class="order-note"><strong>Nota:</strong> ' + escapeHtml(order.note.trim()) + '</div>' : '';
    
    div.innerHTML =
        '<div class="order-header">' +
            '<div class="order-number">#' + orderId + '</div>' +
            '<div class="order-customer">' + customerName + '</div>' +
            noteHtml +
            '<div class="order-time">' + createdTime + '</div>' +
            '<span class="order-type" title="' + orderTypeLabel + '">' + orderTypeIcon + ' ' + orderTypeLabel + '</span>' +
            '<span class="order-status ' + statusClass + '">' + status + '</span>' +
        '</div>' +
        '<div class="order-items">' +
            itemsHtml +
        '</div>' +
        '<div class="order-footer">' +
            '<div class="order-total">' +
                '<span>Jumlah:</span>' +
                '<span>RM ' + totalPrice + '</span>' +
            '</div>' +
            actionButtonsHtml +
        '</div>';
    
    // Setup action buttons
    setupOrderActions(div, order);
    
    return div;
}

// Get status label
function getStatusLabel(status) {
    var labels = {
        'pending': 'Menunggu',
        'ready': 'Siap',
        'completed': 'Selesai'
    };
    return labels[status] || status;
}

// Escape HTML to render notes safely
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Get action buttons HTML
function getActionButtons(status) {
    var html = '<div class="action-buttons';
    
    if (status === 'completed') {
        html += ' full';
    }
    
    html += '">';
    
    if (status === 'pending') {
        html += '<button class="action-btn btn-ready" data-action="ready">Siap</button>';
        html += '<button class="action-btn btn-cancel" data-action="cancel">Batal</button>';
    } else if (status === 'ready') {
        html += '<button class="action-btn btn-complete" data-action="complete">Selesai</button>';
        html += '<button class="action-btn btn-cancel" data-action="back">Kembali</button>';
    } else if (status === 'completed') {
        html += '<button class="action-btn btn-disabled" disabled>Pesanan Selesai</button>';
    }
    
    html += '</div>';
    return html;
}

// Setup order actions
function setupOrderActions(cardElement, order) {
    var buttons = cardElement.querySelectorAll('[data-action]');
    
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var action = this.getAttribute('data-action');
            handleOrderAction(order.id, action);
        });
    });
}

// Handle order action
function handleOrderAction(orderId, action) {
    if (action === 'cancel') {
        deleteOrder(orderId);
        return;
    }
    
    var newStatus = '';
    
    if (action === 'ready') {
        newStatus = 'ready';
    } else if (action === 'complete') {
        newStatus = 'completed';
    } else if (action === 'back') {
        newStatus = 'pending';
    }
    
    updateOrderStatus(orderId, newStatus);
}

// Delete order
function deleteOrder(orderId) {
    if (!confirm('Adakah anda pasti ingin membatalkan pesanan ini?')) {
        return;
    }
    
    var url = dashboardState.apiUrl + '/api/orders/' + orderId;
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            loadOrders();
        } else {
            alert('Gagal membatalkan pesanan');
        }
    };
    xhr.onerror = function() {
        alert('Ralat: Tidak dapat tersambung ke pelayan');
    };
    xhr.send();
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    var url = dashboardState.apiUrl + '/api/orders/' + orderId;
    
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            loadOrders();
        }
    };
    
    xhr.onerror = function() {
        alert('Gagal mengemas kini pesanan');
    };
    
    var data = JSON.stringify({ status: newStatus });
    xhr.send(data);
}

// Format time
function formatTime(isoString) {
    var date = new Date(isoString);
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    return hours + ':' + minutes;
}

// Format price
function formatPrice(price) {
    return price.toFixed(2);
}

// Reset all orders
function resetAllOrders() {
    var url = dashboardState.apiUrl + '/api/orders/reset/all';
    
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        console.log('Reset response status:', xhr.status);
        console.log('Reset response:', xhr.responseText);
        
        if (xhr.status === 200) {
            dashboardState.orders = [];
            loadOrders();
            alert('✓ Semua pesanan telah dihapus!');
        } else {
            alert('Gagal mereset pesanan. Status: ' + xhr.status);
        }
    };
    
    xhr.onerror = function() {
        console.error('Reset error:', xhr.statusText);
        alert('Ralat: Tidak dapat tersambung ke pelayan');
    };
    
    xhr.send();
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (dashboardState.refreshInterval) {
        clearInterval(dashboardState.refreshInterval);
    }
});
