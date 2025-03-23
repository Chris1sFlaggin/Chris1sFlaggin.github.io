from flask import Flask, render_template, request, jsonify, session, redirect, make_response
import uuid
import json
from datetime import datetime, timedelta
import requests

app = Flask(__name__)
app.secret_key = "pizza_delivery_secret_key"
app.config['SESSION_COOKIE_SECURE'] = True  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = 28800  # 8 hours session
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Cookie names for data storage
ORDERS_COOKIE = 'pizza_orders_data'
DELIVERY_POINTS_COOKIE = 'pizza_delivery_points'
USER_ORDERS_COOKIE = 'user_orders'  # Cookie name for storing user's order IDs

def ensure_user_session():
    """Ensure each user has a unique ID in their session"""
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session.permanent = True
    return session['user_id']

def load_data_from_cookie(cookie_name):
    """Load data from cookie"""
    cookie_data = request.cookies.get(cookie_name)
    try:
        return json.loads(cookie_data) if cookie_data else []
    except:
        return []

def load_user_data(cookie_name, user_id=None):
    """Load data filtered for specific user"""
    if user_id is None:
        user_id = ensure_user_session()
    
    data = load_data_from_cookie(cookie_name)
    
    if cookie_name == ORDERS_COOKIE:
        # Filter orders: user sees pending orders, their created orders, or assigned deliveries
        return [
            order for order in data if 
            order.get('status') == 'pending' or
            order.get('delivery_id') == user_id or
            order.get('created_by') == user_id
        ]
    elif cookie_name == DELIVERY_POINTS_COOKIE:
        # Filter delivery points based on orders this user can access
        user_orders = load_user_data(ORDERS_COOKIE, user_id)
        user_order_ids = [order['id'] for order in user_orders]
        
        return [
            point for point in data if
            point.get('order_id') in user_order_ids or
            not point.get('order_id') or  # Points without orders (e.g., pizzeria location)
            point.get('created_by') == user_id
        ]
    
    return data

def save_data_to_cookie(response, data, cookie_name, max_age=7*24*60*60):
    """Save data to cookie"""
    response.set_cookie(cookie_name, json.dumps(data), max_age=max_age)
    return response

def get_user_orders_from_cookie():
    """Get user's order IDs from cookie"""
    cookie_data = request.cookies.get(USER_ORDERS_COOKIE)
    try:
        return json.loads(cookie_data) if cookie_data else []
    except:
        return []
    
def geocode_address(address):
    """Geocode address to get coordinates"""
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
        
        if data.get('features') and len(data['features']) > 0:
            coordinates = data['features'][0]['center']
            return {'lng': coordinates[0], 'lat': coordinates[1]}
        return None
    except Exception as e:
        print(f"Geocoding error: {e}")
        return None

@app.route('/')
def index():
    user_id = ensure_user_session()
    response = make_response(render_template('index.html', user_id=user_id))
    
    # Add session info to cookie
    expires = datetime.now() + timedelta(days=30)
    response.set_cookie('last_visit', datetime.now().isoformat(), expires=expires)
    response.set_cookie('user_id', user_id, expires=expires, httponly=True)
    
    return response

@app.route('/map')
def map_view():
    user_id = ensure_user_session()
    
    # Load data filtered for this user
    delivery_points = load_user_data(DELIVERY_POINTS_COOKIE, user_id)
    orders = load_user_data(ORDERS_COOKIE, user_id)
    orders_dict = {order['id']: order for order in orders}
    
    # Update delivery point status
    for point in delivery_points:
        if point.get('order_id') in orders_dict:
            point['status'] = orders_dict[point['order_id']]['status']
        else:
            point['status'] = 'unknown'
    
    return render_template('map.html', delivery_points=delivery_points, user_id=user_id)
    user_id = ensure_user_session()
@app.route('/orders')
def orders():
    user_id = ensure_user_session()
    user_orders = load_user_data(ORDERS_COOKIE, user_id)
    return render_template('orders.html', orders=user_orders, user_id=user_id)
    user_id = ensure_user_session()
@app.route('/delivery')
def delivery():
    user_id = ensure_user_session()
    
    # Only load deliveries assigned to this user
    all_orders = load_data_from_cookie(ORDERS_COOKIE)
    active_deliveries = [
        order for order in all_orders 
        if order['status'] == 'in_delivery' and order.get('delivery_id') == user_id
    ]
    
    response = make_response(render_template('delivery.html', deliveries=active_deliveries, user_id=user_id))
    
    # Store active delivery IDs in cookie
    delivery_ids = [delivery['id'] for delivery in active_deliveries]
    response.set_cookie('active_deliveries', json.dumps(delivery_ids), max_age=24*60*60)
    
    return response

@app.route('/api/orders', methods=['GET'])
def get_orders():
    user_id = ensure_user_session()
    orders = load_user_data(ORDERS_COOKIE, user_id)
    
    limit = request.args.get('limit')
    if limit:
        try:
            limit = int(limit)
            orders = orders[:limit]
        except ValueError:
            pass
    
    response = jsonify(orders)
    
    # Store order IDs in cookie
    order_ids = [order['id'] for order in orders]
    response.set_cookie(USER_ORDERS_COOKIE, json.dumps(order_ids), max_age=7*24*60*60)
    
    return response
    user_id = ensure_user_session()
@app.route('/api/orders', methods=['POST'])
def add_order():
    user_id = ensure_user_session()
    data = request.json
    orders = load_data_from_cookie(ORDERS_COOKIE)
    
    # Create new order with user_id
    current_time = datetime.now().isoformat()
    new_order = {
        'id': str(uuid.uuid4()),
        'customer_name': data.get('customer_name'),
        'address': data.get('address'),
        'phone': data.get('phone'),
        'items': data.get('items', []),
        'total_price': data.get('total_price'),
        'status': 'pending',
        'created_at': current_time,
        'created_by': user_id,
        'desired_delivery_time': data.get('desired_delivery_time'),
        'delivery_id': None,
        'coordinates': data.get('coordinates')
    }
    
    orders.append(new_order)
    
    # Get coordinates
    coordinates = data.get('coordinates')
    if not coordinates:
        coordinates = geocode_address(data.get('address'))
    
    # Create delivery point
    delivery_points = load_data_from_cookie(DELIVERY_POINTS_COOKIE)
    
    if not coordinates:
        coordinates = {'lat': 41.9, 'lng': 12.5}
        
    delivery_point = {
        'id': str(uuid.uuid4()),
        'name': f"Ordine di {data.get('customer_name')}",
        'address': data.get('address'),
        'lat': coordinates['lat'],
        'lng': coordinates['lng'],
        'order_id': new_order['id'],
        'status': 'pending',
        'created_at': current_time,
        'created_by': user_id,
        'desired_delivery_time': data.get('desired_delivery_time')
    }
    
    delivery_points.append(delivery_point)
    
    # Update user's orders in cookie
    response = jsonify(new_order)
    
    # Get existing orders from cookie and add new one
    user_orders = get_user_orders_from_cookie()
    user_orders.append(new_order['id'])
    
    # Save all data to cookies
    response.set_cookie(ORDERS_COOKIE, json.dumps(orders), max_age=30*24*60*60)
    response.set_cookie(DELIVERY_POINTS_COOKIE, json.dumps(delivery_points), max_age=30*24*60*60)
    response.set_cookie(USER_ORDERS_COOKIE, json.dumps(user_orders), max_age=7*24*60*60)
    response.set_cookie(f'order_{new_order["id"]}', json.dumps({
        'id': new_order['id'],
        'status': 'pending',
        'created_at': current_time
    }), max_age=30*24*60*60)
    
    return response, 201

@app.route('/api/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    user_id = ensure_user_session()
    data = request.json
    orders = load_data_from_cookie(ORDERS_COOKIE)
    
    for i, order in enumerate(orders):
        if order['id'] == order_id:
            # Check permissions
            if order.get('delivery_id') == user_id or order.get('created_by') == user_id or order.get('status') == 'pending':
                # Update order fields
                for key, value in data.items():
                    orders[i][key] = value
                
                # Update cookie with order status
                response = jsonify(orders[i])
                response.set_cookie(ORDERS_COOKIE, json.dumps(orders), max_age=30*24*60*60)
                response.set_cookie(f'order_{order_id}', json.dumps({
                    'id': order_id,
                    'status': orders[i]['status'],
                    'updated_at': datetime.now().isoformat()
                }), max_age=30*24*60*60)
                
                return response
            else:
                return jsonify({'error': 'Non hai i permessi per modificare questo ordine'}), 403
    
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/delivery_points', methods=['GET'])
def get_delivery_points():
    user_id = ensure_user_session()
    delivery_points = load_user_data(DELIVERY_POINTS_COOKIE, user_id)
    return jsonify(delivery_points)

@app.route('/api/delivery_points', methods=['POST'])
def add_delivery_point():
    user_id = ensure_user_session()
    data = request.json
    delivery_points = load_data_from_cookie(DELIVERY_POINTS_COOKIE)
    
    new_point = {
        'id': str(uuid.uuid4()),
        'name': data.get('name'),
        'address': data.get('address'),
        'lat': data.get('lat'),
        'lng': data.get('lng'),
        'order_id': data.get('order_id'),
        'created_by': user_id,
        'status': data.get('status', 'pending')
    }
    
    delivery_points.append(new_point)
    
    response = jsonify(new_point)
    response.set_cookie(DELIVERY_POINTS_COOKIE, json.dumps(delivery_points), max_age=30*24*60*60)

@app.route('/api/assign_delivery', methods=['POST'])
def assign_delivery():
    user_id = ensure_user_session()
    data = request.json
    order_id = data.get('order_id')
    orders = load_data_from_cookie(ORDERS_COOKIE)
    
    for i, order in enumerate(orders):
        if order['id'] == order_id:
            orders[i]['status'] = 'in_delivery'
            orders[i]['delivery_id'] = user_id
            orders[i]['assigned_at'] = datetime.now().isoformat()
            
            # Update delivery point status
            delivery_points = load_data_from_cookie(DELIVERY_POINTS_COOKIE)
            for j, point in enumerate(delivery_points):
                if point.get('order_id') == order_id:
                    delivery_points[j]['status'] = 'in_delivery'
            
            # Add cookie for active delivery
            response = jsonify(orders[i])
            response.set_cookie(ORDERS_COOKIE, json.dumps(orders), max_age=30*24*60*60)
            response.set_cookie(DELIVERY_POINTS_COOKIE, json.dumps(delivery_points), max_age=30*24*60*60)
            response.set_cookie(f'active_delivery_{order_id}', 'true', max_age=24*60*60)
            
            # Update user's orders in cookie
            user_orders = get_user_orders_from_cookie()
            if order_id not in user_orders:
                user_orders.append(order_id)
                response.set_cookie(USER_ORDERS_COOKIE, json.dumps(user_orders), max_age=7*24*60*60)
            
            return response
    
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/complete_delivery', methods=['POST'])
def complete_delivery():
    user_id = ensure_user_session()
    data = request.json
    order_id = data.get('order_id')
    
    orders = load_data_from_cookie(ORDERS_COOKIE)
    for i, order in enumerate(orders):
        if order['id'] == order_id:
            # Verify permission
            if order.get('delivery_id') != user_id:
                return jsonify({'error': 'Non sei autorizzato a completare questa consegna'}), 403
                
            orders[i]['status'] = 'delivered'
            orders[i]['delivered_at'] = datetime.now().isoformat()
            
            # Update delivery point status
            delivery_points = load_data_from_cookie(DELIVERY_POINTS_COOKIE)
            for j, point in enumerate(delivery_points):
                if point.get('order_id') == order_id:
                    delivery_points[j]['status'] = 'delivered'
            
            # Update cookies
            response = jsonify(orders[i])
            response.set_cookie(ORDERS_COOKIE, json.dumps(orders), max_age=30*24*60*60)
            response.set_cookie(DELIVERY_POINTS_COOKIE, json.dumps(delivery_points), max_age=30*24*60*60)
            response.delete_cookie(f'active_delivery_{order_id}')
            response.set_cookie(f'completed_delivery_{order_id}', 'true', max_age=7*24*60*60)
            
            # Update order status in cookie
            response.set_cookie(f'order_{order_id}', json.dumps({
                'id': order_id,
                'status': 'delivered',
                'delivered_at': datetime.now().isoformat()
            }), max_age=30*24*60*60)
            
            return response
    
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/stats', methods=['GET'])
def get_stats():
    user_id = ensure_user_session()
    orders = load_user_data(ORDERS_COOKIE, user_id)
    today = datetime.now().date().isoformat()
    
    # Count orders by status
    pending = sum(1 for order in orders if order['status'] == 'pending')
    in_delivery = sum(1 for order in orders if order['status'] == 'in_delivery' and order.get('delivery_id') == user_id)
    scheduled = sum(1 for order in orders if order['status'] == 'pending' and 'desired_delivery_time' in order)
    
    # Count deliveries completed today by this user
    delivered_today = sum(1 for order in orders 
                         if order['status'] == 'delivered' 
                         and order.get('delivered_at', '').startswith(today)
                         and order.get('delivery_id') == user_id)
    
    # Calculate average delivery time
    delivery_times = []
    for order in orders:
        if order['status'] == 'delivered' and order.get('delivery_id') == user_id and 'assigned_at' in order and 'delivered_at' in order:
            try:
                start_time = datetime.fromisoformat(order['assigned_at'])
                end_time = datetime.fromisoformat(order['delivered_at'])
                delivery_time = (end_time - start_time).total_seconds() / 60  # minutes
                delivery_times.append(delivery_time)
            except (ValueError, TypeError):
                pass
    
    avg_time = int(sum(delivery_times) / len(delivery_times)) if delivery_times else 0
    
    stats = {
        'pending': pending,
        'in_delivery': in_delivery,
        'scheduled': scheduled,
        'delivered_today': delivered_today,
        'avg_delivery_time': avg_time,
        'user_id': user_id
    }
    
    response = jsonify(stats)
    # Store user stats in cookie
    response.set_cookie('user_stats', json.dumps({
        'pending': pending,
        'in_delivery': in_delivery,
        'delivered_today': delivered_today
    }), max_age=1*60*60)  # 1 hour
    
    return response

@app.route('/api/products', methods=['GET'])
def get_products():
    user_id = ensure_user_session()
    
    # Sample products
    products = [
        {'id': 'margherita', 'name': 'Pizza Margherita', 'price': 6.50},
        {'id': 'diavola', 'name': 'Pizza Diavola', 'price': 7.50},
        {'id': 'quattro_formaggi', 'name': 'Pizza Quattro Formaggi', 'price': 8.50},
        {'id': 'calzone', 'name': 'Calzone', 'price': 8.00},
        {'id': 'coca_cola', 'name': 'Coca Cola (33cl)', 'price': 2.50},
        {'id': 'acqua', 'name': 'Acqua (50cl)', 'price': 1.50}
    ]
    
    # Store user's last viewed products in cookie
    response = jsonify(products)
    response.set_cookie('last_viewed_products', json.dumps(['margherita', 'diavola']), max_age=30*24*60*60)
    
    return response

@app.route('/clear_session')
def clear_session():
    """Debug endpoint to clear user session"""
    session.clear()
    response = make_response(redirect('/'))
    
    # Clear all cookies
    for cookie in request.cookies:
        response.delete_cookie(cookie)
    
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
