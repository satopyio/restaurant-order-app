const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Path ke file data
const menuPath = path.join(__dirname, 'data/menu.json');
const ordersPath = path.join(__dirname, 'data/orders.json');

// Helper functions
function readMenu() {
  try {
    const data = fs.readFileSync(menuPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading menu:', err);
    return [];
  }
}

function readOrders() {
  try {
    const data = fs.readFileSync(ordersPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading orders:', err);
    return [];
  }
}

function writeOrders(orders) {
  try {
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error writing orders:', err);
  }
}

// Routes
// Get all menu items
app.get('/api/menu', function(req, res) {
  const menu = readMenu();
  res.json(menu);
});

// Get all orders
app.get('/api/orders', function(req, res) {
  const orders = readOrders();
  res.json(orders);
});

// Delete all orders (Reset) - MUST BE BEFORE /:id routes
app.delete('/api/orders/reset/all', function(req, res) {
  try {
    writeOrders([]);
    res.json({
      success: true,
      message: 'Semua pesanan telah dihapus'
    });
  } catch (err) {
    console.error('Error resetting orders:', err);
    res.status(500).json({ error: 'Gagal mereset pesanan' });
  }
});

// Create new order
app.post('/api/orders', function(req, res) {
  try {
    const { customerName, items, totalPrice } = req.body;
    
    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const orders = readOrders();
    const newOrder = {
      id: Date.now(),
      customerName: customerName,
      items: items,
      totalPrice: totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    writeOrders(orders);

    res.status(201).json({
      success: true,
      message: 'Order berhasil dibuat',
      order: newOrder
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Gagal membuat order' });
  }
});

// Update order status
app.put('/api/orders/:id', function(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const orders = readOrders();
    const orderIndex = orders.findIndex(function(o) { return o.id === orderId; });

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    orders[orderIndex].status = status;
    writeOrders(orders);

    res.json({
      success: true,
      message: 'Order berhasil diupdate',
      order: orders[orderIndex]
    });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Gagal mengupdate order' });
  }
});

// Delete single order
app.delete('/api/orders/:id', function(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const orders = readOrders();
    const newOrders = orders.filter(function(o) { return o.id !== orderId; });

    if (newOrders.length === orders.length) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    writeOrders(newOrders);

    res.json({
      success: true,
      message: 'Order berhasil dibatalkan'
    });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Gagal membatalkan order' });
  }
});

// Start server
app.listen(PORT, function() {
  console.log('Server berjalan di http://localhost:' + PORT);
});
