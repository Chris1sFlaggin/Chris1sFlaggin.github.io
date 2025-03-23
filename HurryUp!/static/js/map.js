// Map functionality for Pizza Delivery

// Map variables
let mapInstance = null;
let mapMarkers = [];

// Initialize map for index page preview
function initMapPreview() {
    const mapPreviewElement = document.getElementById('map-preview');
    if (!mapPreviewElement) return;
    
    mapboxgl.accessToken = 'YOUR_MAPBOX';
    const mapPreview = new mapboxgl.Map({
        container: 'map-preview',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [12.5, 41.9],  // Center of Italy
        zoom: 5,
        interactive: false
    });
    
    // Load delivery points for the preview map
    fetch('/api/delivery_points')
        .then(response => response.json())
        .then(points => {
            // Filter to only show points with an order_id (actual orders)
            const orderPoints = points.filter(point => point.order_id);
            
            orderPoints.forEach(point => {
                // Create popup content with order time
                const popupContent = createMarkerPopupHTML(point);
                
                const marker = new mapboxgl.Marker({ color: getMarkerColor(point.status) })
                    .setLngLat([point.lng, point.lat]);
                
                // Add popup if this is an actual order
                if (point.order_id) {
                    marker.setPopup(new mapboxgl.Popup().setHTML(popupContent));
                }
                
                marker.addTo(mapPreview);
            });
        })
        .catch(error => {
            console.error('Error loading delivery points:', error);
        });
}

// Get marker color based on status
function getMarkerColor(status) {
    switch(status) {
        case 'in_delivery': return '#1976d2';  // Blue
        case 'delivered': return '#2e7d32';    // Green
        case 'cancelled': return '#c62828';    // Dark red
        case 'pending': 
        default: return '#d32f2f';            // Red (default)
    }
}

// Get status text in Italian
function getStatusText(status) {
    switch(status) {
        case 'pending': return 'In attesa';
        case 'in_delivery': return 'In consegna';
        case 'delivered': return 'Consegnato';
        case 'cancelled': return 'Annullato';
        default: return status;
    }
}

// Format date and time
function formatDateTime(isoString) {
    if (!isoString) return 'Data non disponibile';
    
    try {
        const date = new Date(isoString);
        return date.toLocaleString('it-IT', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit', 
            minute: '2-digit'
        });
    } catch (e) {
        return 'Data non valida';
    }
}

// Update the createMarkerPopupHTML function to display desired delivery time

function createMarkerPopupHTML(point) {
    let deliveryTimeDisplay = '';
    if (point.desired_delivery_time) {
        deliveryTimeDisplay = `<p>Consegna richiesta: <span class="order-time">${formatDateTime(point.desired_delivery_time)}</span></p>`;
    }
    
    return `
        <div class="marker-popup">
            <h4>${point.name}</h4>
            <p>${point.address}</p>
            ${point.status ? `<p>Stato: <span class="status-badge ${point.status}">${getStatusText(point.status)}</span></p>` : ''}
            ${point.created_at ? `<p>Ordine effettuato: <span class="order-time">${formatDateTime(point.created_at)}</span></p>` : ''}
            ${deliveryTimeDisplay}
            ${point.order_id ? `<button class="popup-action-btn" onclick="viewOrderDetails('${point.order_id}')">Dettagli ordine</button>` : ''}
        </div>
    `;
}

// View order details
function viewOrderDetails(orderId) {
    // This would typically open a modal with order details
    // For now, we'll just navigate to the orders page
    window.location.href = `/orders?highlight=${orderId}`;
}

// Initialize map when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMapPreview();
});