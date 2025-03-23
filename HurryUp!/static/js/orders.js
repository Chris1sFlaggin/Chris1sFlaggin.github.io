// Orders management functionality

// Global variables
let ordersData = [];
let activeFilter = 'all';

// Load orders and update the UI
function loadOrders(filter = 'all') {
    activeFilter = filter;
    document.querySelector('#ordersList') && (document.querySelector('#ordersList').innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Caricamento ordini...</div>');
    
    fetch('/api/orders')
        .then(response => response.json())
        .then(orders => {
            ordersData = orders;
            updateOrdersUI(filter);
            updateOrderCounts();
        })
        .catch(error => {
            console.error('Errore nel caricamento degli ordini:', error);
            if (document.querySelector('#ordersList')) {
                document.querySelector('#ordersList').innerHTML = '<div class="error-state">Errore nel caricamento degli ordini. Riprova più tardi.</div>';
            }
        });
}

// Update the orders UI based on the filter
function updateOrdersUI(filter = 'all') {
    const ordersList = document.querySelector('#ordersList');
    if (!ordersList) return;
    
    // Filter orders
    const filteredOrders = filter === 'all' 
        ? ordersData 
        : ordersData.filter(order => order.status === filter);
    
    // Clear current content
    ordersList.innerHTML = '';
    
    // Check if we have orders to display
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<div class="empty-state">Nessun ordine trovato.</div>';
        return;
    }
    
    // Sort orders by creation date (newest first)
    filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Create and append order elements
    filteredOrders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = `order-item status-${order.status}`;
        orderElement.innerHTML = createOrderHTML(order);
        
        // Add click event to show details
        orderElement.addEventListener('click', () => showOrderDetails(order.id));
        
        // Add action buttons
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'order-actions';
        
        if (order.status === 'pending') {
            // Add assign button
            const assignBtn = document.createElement('button');
            assignBtn.className = 'btn btn-primary btn-sm';
            assignBtn.innerHTML = '<i class="fas fa-motorcycle"></i> Assegna per consegna';
            assignBtn.onclick = (e) => {
                e.stopPropagation();
                assignOrderForDelivery(order.id);
            };
            actionsContainer.appendChild(assignBtn);
        }
        
        if (order.status === 'in_delivery') {
            // Add complete button
            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn btn-success btn-sm';
            completeBtn.innerHTML = '<i class="fas fa-check"></i> Completa consegna';
            completeBtn.onclick = (e) => {
                e.stopPropagation();
                completeDelivery(order.id);
            };
            actionsContainer.appendChild(completeBtn);
        }
        
        orderElement.appendChild(actionsContainer);
        ordersList.appendChild(orderElement);
    });
}

// Create HTML for an order item
function createOrderHTML(order) {
    const createdAt = new Date(order.created_at).toLocaleString('it-IT');
    let statusText;
    
    switch (order.status) {
        case 'pending': statusText = 'In attesa'; break;
        case 'in_delivery': statusText = 'In consegna'; break;
        case 'delivered': statusText = 'Consegnato'; break;
        case 'cancelled': statusText = 'Annullato'; break;
        default: statusText = order.status;
    }
    
    return `
        <div class="order-info">
            <span class="order-id">#${order.id.substring(0, 8)}</span>
            <span class="order-customer">${order.customer_name}</span>
            <span class="order-address">${order.address}</span>
        </div>
        <div class="order-status">
            <span class="status-badge ${order.status}">${statusText}</span>
            <span class="order-date">${createdAt}</span>
        </div>
    `;
}

// Update the counters for each order status
function updateOrderCounts() {
    const pending = ordersData.filter(order => order.status === 'pending').length;
    const inDelivery = ordersData.filter(order => order.status === 'in_delivery').length;
    const delivered = ordersData.filter(order => order.status === 'delivered').length;
    const cancelled = ordersData.filter(order => order.status === 'cancelled').length;
    
    // Update counts
    document.querySelector('#all-count') && (document.querySelector('#all-count').textContent = ordersData.length);
    document.querySelector('#pending-count') && (document.querySelector('#pending-count').textContent = pending);
    document.querySelector('#in_delivery-count') && (document.querySelector('#in_delivery-count').textContent = inDelivery);
    document.querySelector('#delivered-count') && (document.querySelector('#delivered-count').textContent = delivered);
    document.querySelector('#cancelled-count') && (document.querySelector('#cancelled-count').textContent = cancelled);
}

// Filter orders by status
function filterOrders(filter) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.filter-btn[data-filter="${filter}"]`)?.classList.add('active');
    
    updateOrdersUI(filter);
}

// Assign an order for delivery
function assignOrderForDelivery(orderId) {
    fetch('/api/assign_delivery', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_id: orderId })
    })
    .then(response => response.json())
    .then(data => {
        // Update local data
        const index = ordersData.findIndex(order => order.id === orderId);
        if (index !== -1) {
            ordersData[index] = data;
        }
        
        // Update UI
        updateOrdersUI(activeFilter);
        showNotification('Ordine assegnato per la consegna', 'success');
    })
    .catch(error => {
        console.error('Errore nell\'assegnazione dell\'ordine:', error);
        showNotification('Errore nell\'assegnazione dell\'ordine', 'error');
    });
}

// Complete a delivery
function completeDelivery(orderId) {
    fetch('/api/complete_delivery', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_id: orderId })
    })
    .then(response => response.json())
    .then(data => {
        // Update local data
        const index = ordersData.findIndex(order => order.id === orderId);
        if (index !== -1) {
            ordersData[index] = data;
        }
        
        // Update UI
        updateOrdersUI(activeFilter);
        showNotification('Consegna completata con successo', 'success');
    })
    .catch(error => {
        console.error('Errore nel completare la consegna:', error);
        showNotification('Errore nel completare la consegna', 'error');
    });
}

// Show a notification using toastr or alert
function showNotification(message, type = 'info') {
    if (typeof toastr !== 'undefined') {
        toastr[type](message);
    } else {
        alert(message);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load orders if we're on the orders page
    if (document.querySelector('#ordersList')) {
        loadOrders();
    }
    
    // Initialize toastr if available
    if (typeof toastr !== 'undefined') {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000
        };
    }
});