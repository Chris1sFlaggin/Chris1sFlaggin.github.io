// Delivery management functionality

// Global variables
let activeDeliveries = [];

// Load active deliveries
function loadActiveDeliveries() {
    fetch('/api/orders')
        .then(response => response.json())
        .then(orders => {
            activeDeliveries = orders.filter(order => order.status === 'in_delivery');
            updateActiveDeliveriesUI();
            updateActiveDeliveriesCount();
        })
        .catch(error => {
            console.error('Errore nel caricamento delle consegne attive:', error);
        });
}

// Update the active deliveries UI
function updateActiveDeliveriesUI() {
    const deliveriesList = document.querySelector('#deliveriesList');
    if (!deliveriesList) return;
    
    // Clear current content
    deliveriesList.innerHTML = '';
    
    // Check if we have deliveries to display
    if (activeDeliveries.length === 0) {
        deliveriesList.innerHTML = '<div class="empty-state">Nessuna consegna attiva.</div>';
        return;
    }
    
    // Create and append delivery elements
    activeDeliveries.forEach(delivery => {
        const deliveryElement = document.createElement('div');
        deliveryElement.className = 'delivery-item';
        
        const assignedAt = new Date(delivery.assigned_at).toLocaleString('it-IT');
        
        deliveryElement.innerHTML = `
            <div class="delivery-info">
                <span class="delivery-id">#${delivery.id.substring(0, 8)}</span>
                <span class="delivery-customer">${delivery.customer_name}</span>
                <span class="delivery-address">${delivery.address}</span>
            </div>
            <div class="delivery-details">
                <span class="delivery-time"><i class="fas fa-clock"></i> Assegnato: ${assignedAt}</span>
            </div>
        `;
        
        // Add complete button
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'delivery-actions';
        
        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn btn-success btn-sm';
        completeBtn.innerHTML = '<i class="fas fa-check"></i> Consegna completata';
        completeBtn.onclick = () => completeDelivery(delivery.id);
        
        const mapBtn = document.createElement('button');
        mapBtn.className = 'btn btn-primary btn-sm';
        mapBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Vedi mappa';
        mapBtn.onclick = () => window.location.href = '/map';
        
        actionsContainer.appendChild(completeBtn);
        actionsContainer.appendChild(mapBtn);
        
        deliveryElement.appendChild(actionsContainer);
        deliveriesList.appendChild(deliveryElement);
    });
}

// Update the active deliveries count in the header
function updateActiveDeliveriesCount() {
    const count = activeDeliveries.length;
    const countElements = document.querySelectorAll('#activeDeliveriesCount');
    countElements.forEach(element => {
        element.textContent = count;
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
        // Remove from active deliveries
        activeDeliveries = activeDeliveries.filter(delivery => delivery.id !== orderId);
        
        // Update UI
        updateActiveDeliveriesUI();
        updateActiveDeliveriesCount();
        
        // Show notification
        if (typeof showNotification === 'function') {
            showNotification('Consegna completata con successo', 'success');
        } else {
            alert('Consegna completata con successo');
        }
    })
    .catch(error => {
        console.error('Errore nel completare la consegna:', error);
        if (typeof showNotification === 'function') {
            showNotification('Errore nel completare la consegna', 'error');
        } else {
            alert('Errore nel completare la consegna');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load active deliveries
    loadActiveDeliveries();
    
    // Refresh active deliveries periodically (every 30 seconds)
    setInterval(loadActiveDeliveries, 30000);
});