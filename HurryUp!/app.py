from flask import Flask, render_template, request, jsonify, session, redirect
import uuid
import json
import os
from datetime import datetime
import requests

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Per le sessioni

# Simulazione di un database semplice (in produzione usa un DB reale)
ORDERS_FILE = 'orders.json'
DELIVERY_POINTS_FILE = 'delivery_points.json'

def load_data(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def save_data(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

# Funzione per geocodificare un indirizzo
def geocode_address(address):
    MAPBOX_TOKEN = 'pk.eyJ1IjoiY2hpZWZrZWVmIiwiYSI6ImNtOGs5b21paTB3NGcybHM1YnNlcGdyM3MifQ.p4ZV0xye8mRFfOEyc4-_KQ'
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json"
    params = {
        'access_token': MAPBOX_TOKEN,
        'country': 'it',
        'limit': 1
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['features'] and len(data['features']) > 0:
            coordinates = data['features'][0]['center']  # [lng, lat]
            return {'lng': coordinates[0], 'lat': coordinates[1]}
    except Exception as e:
        print(f"Errore nella geocodifica: {e}")
    
    return None

# Rotte principali
@app.route('/')
def index():
    # Se non c'è una sessione, ne creiamo una nuova
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    return render_template('index.html')

@app.route('/map')
def map_view():
    # Carica i punti di consegna per visualizzarli sulla mappa
    delivery_points = load_data(DELIVERY_POINTS_FILE)
    
    # Carica gli ordini per associare lo stato a ciascun punto di consegna
    orders = load_data(ORDERS_FILE)
    orders_dict = {order['id']: order for order in orders}
    
    # Aggiungi lo stato dell'ordine a ogni punto di consegna
    for point in delivery_points:
        if 'order_id' in point and point['order_id'] in orders_dict:
            point['status'] = orders_dict[point['order_id']]['status']
        else:
            point['status'] = 'unknown'
    
    return render_template('map.html', delivery_points=delivery_points)

@app.route('/orders')
def orders():
    # Carica tutti gli ordini
    all_orders = load_data(ORDERS_FILE)
    return render_template('orders.html', orders=all_orders)

@app.route('/delivery')
def delivery():
    active_deliveries = [order for order in load_data(ORDERS_FILE) if order['status'] == 'in_delivery']
    return render_template('delivery.html', deliveries=active_deliveries)

# Add this route (it's already in your app.py, just confirming it's there)
@app.route('/deliveries')
def deliveries_redirect():
    return redirect('/delivery')

@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = load_data(ORDERS_FILE)
    limit = request.args.get('limit')
    if limit:
        try:
            limit = int(limit)
            orders = orders[:limit]
        except ValueError:
            pass
    return jsonify(orders)

@app.route('/api/orders', methods=['POST'])
def add_order():
    data = request.json
    orders = load_data(ORDERS_FILE)
    
    # Timestamp dell'ordine
    current_time = datetime.now().isoformat()
    
    # Crea un nuovo ordine
    new_order = {
        'id': str(uuid.uuid4()),
        'customer_name': data.get('customer_name'),
        'address': data.get('address'),
        'phone': data.get('phone'),
        'items': data.get('items', []),
        'total_price': data.get('total_price'),
        'status': 'pending',  # pending, in_delivery, delivered, cancelled
        'created_at': current_time,
        'desired_delivery_time': data.get('desired_delivery_time'),
        'delivery_id': None,
        'coordinates': data.get('coordinates')
    }
    
    orders.append(new_order)
    save_data(orders, ORDERS_FILE)
    
    # Ottieni le coordinate dell'indirizzo
    coordinates = data.get('coordinates')
    if not coordinates:
        coordinates = geocode_address(data.get('address'))
    
    # Crea sempre un punto di consegna per l'ordine
    delivery_points = load_data(DELIVERY_POINTS_FILE)
    
    # Se non abbiamo coordinate, usiamo coordinate default per l'Italia
    if not coordinates:
        coordinates = {'lat': 41.9, 'lng': 12.5}  # Coordinate centrali dell'Italia
    delivery_point = {
        'id': str(uuid.uuid4()),
        'name': f"Ordine di {data.get('customer_name')}",
        'address': data.get('address'),
        'lat': coordinates['lat'],
        'lng': coordinates['lng'],
        'order_id': new_order['id'],
        'status': 'pending',
        'created_at': current_time,  # Aggiungi il timestamp dell'ordine
        'desired_delivery_time': data.get('desired_delivery_time')
    }
    
    delivery_points.append(delivery_point)
    save_data(delivery_points, DELIVERY_POINTS_FILE)
    
    return jsonify(new_order), 201

@app.route('/api/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.json
    orders = load_data(ORDERS_FILE)
    
    for i, order in enumerate(orders):
        if order['id'] == order_id:
            # Aggiorna solo i campi forniti
            for key, value in data.items():
                orders[i][key] = value
            save_data(orders, ORDERS_FILE)
            return jsonify(orders[i])
    
    return jsonify({'error': 'Order not found'}), 404

# API per i punti di consegna (markers sulla mappa)
@app.route('/api/delivery_points', methods=['GET'])
def get_delivery_points():
    delivery_points = load_data(DELIVERY_POINTS_FILE)
    return jsonify(delivery_points)

@app.route('/api/delivery_points', methods=['POST'])
def add_delivery_point():
    data = request.json
    delivery_points = load_data(DELIVERY_POINTS_FILE)
    
    new_point = {
        'id': str(uuid.uuid4()),
        'name': data.get('name'),
        'address': data.get('address'),
        'lat': data.get('lat'),
        'lng': data.get('lng'),
        'order_id': data.get('order_id'),
        'status': data.get('status', 'unknown'),
        'created_at': data.get('created_at', datetime.now().isoformat())  # Aggiungi timestamp
    }
    
    delivery_points.append(new_point)
    save_data(delivery_points, DELIVERY_POINTS_FILE)
    return jsonify(new_point), 201

@app.route('/api/assign_delivery', methods=['POST'])
def assign_delivery():
    data = request.json
    order_id = data.get('order_id')
    
    orders = load_data(ORDERS_FILE)
    for i, order in enumerate(orders):
        if order['id'] == order_id:
            orders[i]['status'] = 'in_delivery'
            orders[i]['delivery_id'] = session.get('user_id')
            orders[i]['assigned_at'] = datetime.now().isoformat()
            save_data(orders, ORDERS_FILE)
            
            # Aggiorna anche il punto di consegna con il nuovo stato
            delivery_points = load_data(DELIVERY_POINTS_FILE)
            for j, point in enumerate(delivery_points):
                if point.get('order_id') == order_id:
                    delivery_points[j]['status'] = 'in_delivery'
            save_data(delivery_points, DELIVERY_POINTS_FILE)
            
            return jsonify(orders[i])
    
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/complete_delivery', methods=['POST'])
def complete_delivery():
    data = request.json
    order_id = data.get('order_id')
    
    orders = load_data(ORDERS_FILE)
    for i, order in enumerate(orders):
        if order['id'] == order_id:
            orders[i]['status'] = 'delivered'
            orders[i]['delivered_at'] = datetime.now().isoformat()
            save_data(orders, ORDERS_FILE)
            
            # Aggiorna anche il punto di consegna con il nuovo stato
            delivery_points = load_data(DELIVERY_POINTS_FILE)
            for j, point in enumerate(delivery_points):
                if point.get('order_id') == order_id:
                    delivery_points[j]['status'] = 'delivered'
            save_data(delivery_points, DELIVERY_POINTS_FILE)
            
            return jsonify(orders[i])
    
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/stats', methods=['GET'])
def get_stats():
    orders = load_data(ORDERS_FILE)
    today = datetime.now().date().isoformat()
    
    # Count orders by status
    pending = sum(1 for order in orders if order['status'] == 'pending')
    in_delivery = sum(1 for order in orders if order['status'] == 'in_delivery')
    scheduled = sum(1 for order in orders if order['status'] == 'pending' and 'desired_delivery_time' in order)
    
    # Count deliveries completed today
    delivered_today = sum(1 for order in orders 
                         if order['status'] == 'delivered' 
                         and order.get('delivered_at', '').startswith(today))
    
    # Calculate average delivery time (in minutes)
    delivery_times = []
    for order in orders:
        if order['status'] == 'delivered' and 'assigned_at' in order and 'delivered_at' in order:
            try:
                start_time = datetime.fromisoformat(order['assigned_at'])
                end_time = datetime.fromisoformat(order['delivered_at'])
                delivery_time = (end_time - start_time).total_seconds() / 60  # minutes
                delivery_times.append(delivery_time)
            except (ValueError, TypeError):
                pass
    
    avg_time = int(sum(delivery_times) / len(delivery_times)) if delivery_times else 0
    return jsonify({
        'pending': pending,
        'in_delivery': in_delivery,
        'scheduled': scheduled,
        'delivered_today': delivered_today,
        'avg_delivery_time': avg_time
    })

@app.route('/api/products', methods=['GET'])
def get_products():
    # Sample products - in production, load from database
    products = [
        {'id': '1', 'name': 'Pizza Margherita', 'price': 6.50},
        {'id': '2', 'name': 'Pizza Diavola', 'price': 7.50},
        {'id': '3', 'name': 'Pizza Quattro Formaggi', 'price': 8.50},
        {'id': '4', 'name': 'Calzone', 'price': 8.00},
        {'id': '5', 'name': 'Coca Cola (33cl)', 'price': 2.50},
        {'id': '6', 'name': 'Acqua (50cl)', 'price': 1.50}
    ]
    return jsonify(products)

if __name__ == '__main__':
    app.run(debug=True)