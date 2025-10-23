from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import requests
import json
import random
from typing import List, Dict, Any
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# modelo Pydantic
class OptimizeRequest(BaseModel):
    budget: float
    categories: Optional[List[str]] = None

app = FastAPI(title="LiquiVerde API", description="Retail Inteligente Sostenible")



# Agrega estos modelos al inicio (después de los imports)
class PurchaseData(BaseModel):
    co2_saved: float
    money_saved: float
    products_count: int

class PurchaseRequest(BaseModel):
    user_id: str
    purchase_data: PurchaseData


# CORS CONFIGURACIÓN
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://0.0.0.0:5173",
        "http://0.0.0.0:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Todos los headers
)

# Inicializar base de datos
def init_db():
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            barcode TEXT UNIQUE,
            name TEXT,
            brand TEXT,
            price REAL,
            sustainability_score REAL,
            health_score REAL,
            category TEXT,
            carbon_footprint REAL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS shopping_lists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            budget REAL,
            optimized_products TEXT,
            total_savings REAL,
            environmental_impact REAL
        )
    ''')
    
    # Insertar algunos productos de ejemplo
    sample_products = [
        ('1234567890123', 'Leche Entera', 'Soprole', 1200, 7.5, 6.0, 'Lácteos', 2.1),
        ('1234567890124', 'Pan Integral', 'Bimbo', 2500, 8.0, 8.5, 'Panadería', 1.2),
        ('1234567890125', 'Manzanas', 'Fruta Natural', 1500, 9.0, 9.0, 'Frutas', 0.5),
        ('1234567890126', 'Yogurt Natural', 'Nestlé', 800, 6.5, 7.0, 'Lácteos', 1.8),
        ('1234567890127', 'Arroz Integral', 'Tucapel', 2200, 7.0, 8.0, 'Granos', 1.5),
        ('1234567890128', 'Atún en Lata', 'Campo Marino', 1800, 5.5, 7.5, 'Pescado', 2.5),
        ('1234567890129', 'Jabón Líquido', 'Linic', 3200, 4.0, 6.0, 'Limpieza', 3.0),
        ('1234567890130', 'Agua Mineral', 'Cachantun', 800, 3.5, 7.0, 'Bebidas', 1.0),
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO products 
        (barcode, name, brand, price, sustainability_score, health_score, category, carbon_footprint)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_products)
    
    conn.commit()
    conn.close()

# ⭐⭐ NUEVO: Función para actualizar el esquema ⭐⭐
def update_db_schema():
    """Agrega la columna image_url si no existe"""
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    
    try:
        # Verificar si la columna image_url ya existe
        cursor.execute("PRAGMA table_info(products)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'image_url' not in columns:
            cursor.execute('ALTER TABLE products ADD COLUMN image_url TEXT')
            print("✅ Columna image_url agregada a la base de datos")
        else:
            print("ℹ️ Columna image_url ya existe")
            
    except Exception as e:
        print(f"⚠️ Error actualizando esquema: {e}")
    
    conn.commit()
    conn.close()

# ⭐⭐ EJECUTAR AMBAS FUNCIONES AL INICIAR ⭐⭐
init_db()
update_db_schema()  # <- Esta línea es NUEVA

# Funciones auxiliares
def calculate_sustainability_from_api(product_data):
    """Calcula score de sostenibilidad basado en datos de Open Food Facts"""
    score = 5.0  # Puntuación base
    
    # Factor 1: Ecoscore si está disponible
    if product_data.get('ecoscore_grade'):
        ecoscore_map = {'a': 9.0, 'b': 7.5, 'c': 6.0, 'd': 4.0, 'e': 2.0}
        score = ecoscore_map.get(product_data['ecoscore_grade'].lower(), 5.0)
    
    # Factor 2: Nutri-Score
    if product_data.get('nutriscore_grade'):
        nutriscore_map = {'a': 8.0, 'b': 7.0, 'c': 6.0, 'd': 4.0, 'e': 3.0}
        score = (score + nutriscore_map.get(product_data['nutriscore_grade'].lower(), 5.0)) / 2
    
    # Factor 3: Ingredientes ecológicos
    labels = product_data.get('labels', '').lower()
    if any(organic in labels for organic in ['organic', 'bio', 'ecológico', 'orgánico']):
        score += 1.0
    
    # Factor 4: Packaging sostenible
    packaging = product_data.get('packaging', '').lower()
    if any(eco in packaging for eco in ['recycl', 'recicl', 'biodegrad', 'compost']):
        score += 0.5
    
    # Factor 5: Origen local (Chile)
    countries = product_data.get('countries', '').lower()
    if 'chile' in countries:
        score += 0.5
    
    return min(10.0, max(1.0, round(score, 1)))

def calculate_carbon_footprint(product_data, sustainability_score):
    """Calcula huella de carbono aproximada basada en categoría y sostenibilidad"""
    # Categorías con mayor huella de carbono
    high_carbon_categories = ['meat', 'cheese', 'fish', 'chocolate', 'coffee']
    medium_carbon_categories = ['dairy', 'bread', 'pasta', 'rice']
    
    categories = product_data.get('categories', '').lower()
    
    base_carbon = 2.0  # Huella base en kg CO2
    
    # Ajustar por categoría
    if any(cat in categories for cat in high_carbon_categories):
        base_carbon = 4.0
    elif any(cat in categories for cat in medium_carbon_categories):
        base_carbon = 2.5
    
    # Ajustar por sostenibilidad (productos más sostenibles tienen menor huella)
    carbon_adjustment = (10 - sustainability_score) / 10  # 0.1 a 0.9
    final_carbon = base_carbon * (0.5 + carbon_adjustment * 0.5)
    
    return round(final_carbon, 1)

# Algoritmo de Mochila Multi-objetivo
def knapsack_multi_objective(products, budget, weights=None):
    """
    Algoritmo de mochila multi-objetivo para optimizar compras
    Considera: precio, sostenibilidad, salud y huella de carbono
    """
    if weights is None:
        weights = {'price': 0.4, 'sustainability': 0.3, 'health': 0.2, 'carbon': 0.1}
    
    n = len(products)
    # Matriz de programación dinámica
    dp = [[0] * (budget + 1) for _ in range(n + 1)]
    selected = [[[] for _ in range(budget + 1)] for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        product = products[i - 1]
        price = int(product['price'])
        sustainability = product['sustainability_score']
        health = product['health_score']
        carbon = product['carbon_footprint']
        
        # Calcular score multi-objetivo
        score = (
            weights['sustainability'] * sustainability * 10 +
            weights['health'] * health * 10 -
            weights['price'] * (price / 100) -
            weights['carbon'] * carbon * 2
        )
        
        for w in range(budget + 1):
            if price <= w:
                if dp[i-1][w] < dp[i-1][w-price] + score:
                    dp[i][w] = dp[i-1][w-price] + score
                    selected[i][w] = selected[i-1][w-price] + [product]
                else:
                    dp[i][w] = dp[i-1][w]
                    selected[i][w] = selected[i-1][w]
            else:
                dp[i][w] = dp[i-1][w]
                selected[i][w] = selected[i-1][w]
    
    # Encontrar la mejor combinación
    best_score = -1
    best_combination = []
    best_budget_used = 0
    
    for w in range(budget + 1):
        if dp[n][w] > best_score:
            best_score = dp[n][w]
            best_combination = selected[n][w]
            best_budget_used = w
    
    return best_combination, best_budget_used

# Endpoints básicos
@app.get("/")
def read_root():
    return {"message": "LiquiVerde API funcionando!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/products")
def get_products():
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM products')
    products = cursor.fetchall()
    conn.close()
    
    return {"products": products}

# Endpoint principal para buscar productos
@app.get("/product/{barcode}")
def get_product(barcode: str):
    """Busca producto en Open Food Facts primero, si no existe usa DB local"""
    print(f"🎯 SOLICITUD RECIBIDA para código: {barcode}")
    
    # PRIMERO: Intentar con Open Food Facts API
    try:
        print(f"🔍 Buscando producto {barcode} en Open Food Facts...")
        response = requests.get(f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('status') == 1:  # Producto encontrado
                product_data = data['product']
                print(f"✅ Producto ENCONTRADO en Open Food Facts: {product_data.get('product_name', 'Sin nombre')}")
                
                # Extraer información del producto
                product_name = product_data.get('product_name', 'Nombre no disponible')
                brands = product_data.get('brands', 'Marca no disponible')
                categories = product_data.get('categories', 'Categoría no disponible')
                
                # OBTENER IMAGEN - ¡NUEVO!
                image_url = product_data.get('image_url') or product_data.get('image_front_url') or product_data.get('image_small_url')
                
                # Calcular sostenibilidad y huella de carbono
                sustainability_score = calculate_sustainability_from_api(product_data)
                carbon_footprint = calculate_carbon_footprint(product_data, sustainability_score)
                
                # Precio estimado
                estimated_price = round(random.uniform(700, 3000), -2)
                
                # Guardar en base de datos local
                conn = sqlite3.connect('products.db')
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT OR REPLACE INTO products 
                    (barcode, name, brand, price, sustainability_score, health_score, category, carbon_footprint, image_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    barcode, 
                    product_name, 
                    brands, 
                    estimated_price, 
                    sustainability_score,
                    round(random.uniform(5.0, 9.0), 1),
                    categories,
                    carbon_footprint,
                    image_url  # Guardar URL de imagen
                ))
                conn.commit()
                conn.close()
                
                print(f"📦 Producto guardado en DB local: {product_name}")
                if image_url:
                    print(f"🖼️ Imagen disponible: {image_url}")
                
                return {
                    "id": barcode,
                    "barcode": barcode,
                    "name": product_name,
                    "brand": brands,
                    "price": estimated_price,
                    "sustainability_score": sustainability_score,
                    "health_score": round(random.uniform(5.0, 9.0), 1),
                    "category": categories,
                    "carbon_footprint": carbon_footprint,
                    "image_url": image_url,  # ¡NUEVO!
                    "source": "Open Food Facts"
                }
            else:
                print("❌ Producto NO encontrado en Open Food Facts")
        else:
            print(f"❌ Error HTTP {response.status_code} de Open Food Facts")
                
    except requests.exceptions.Timeout:
        print("⏰ Timeout en Open Food Facts - Continuando con DB local")
    except Exception as e:
        print(f"⚠️ Error con Open Food Facts: {e} - Continuando con DB local")
    
    # SEGUNDO: Buscar en base de datos local
    print(f"🔍 Buscando en base de datos local: {barcode}")
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM products WHERE barcode = ?', (barcode,))
    product = cursor.fetchone()
    conn.close()
    
    if product:
        print(f"✅ Producto encontrado en DB local: {product[2]}")
        return {
            "id": product[0],
            "barcode": product[1],
            "name": product[2],
            "brand": product[3],
            "price": product[4],
            "sustainability_score": product[5],
            "health_score": product[6],
            "category": product[7],
            "carbon_footprint": product[8],
            "image_url": product[9] if len(product) > 9 else None,  # ¡NUEVO!
            "source": "Base de datos local"
        }
    else:
        print(f"❌ Producto NO encontrado en ningún lado: {barcode}")
        raise HTTPException(status_code=404, detail="Producto no encontrado")

# Búsqueda de productos por nombre
@app.get("/search-products/{query}")
def search_products(query: str):
    """Busca productos por nombre en Open Food Facts"""
    try:
        search_url = f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&search_simple=1&json=1&page_size=10"
        response = requests.get(search_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            
            formatted_products = []
            for product in products:
                if product.get('product_name'):
                    sustainability_score = calculate_sustainability_from_api(product)
                    image_url = product.get('image_url') or product.get('image_front_url') or product.get('image_small_url')
                    
                    formatted_products.append({
                        "name": product.get('product_name', 'Nombre no disponible'),
                        "brand": product.get('brands', 'Marca no disponible'),
                        "barcode": product.get('code', ''),
                        "sustainability_score": sustainability_score,
                        "category": product.get('categories', '').split(',')[0] if product.get('categories') else 'General',
                        "image_url": image_url,  # ¡NUEVO!
                        "source": "Open Food Facts"
                    })
            
            return {"products": formatted_products[:8]}  # Limitar a 8 resultados
        else:
            return {"products": [], "error": "No se pudo conectar con Open Food Facts"}
            
    except Exception as e:
        print(f"Error en búsqueda: {e}")
        return {"products": [], "error": "Error en la búsqueda"}

# Optimización de lista de compras
@app.post("/optimize-shopping-list")
def optimize_shopping_list(request: OptimizeRequest):
    """Optimiza lista de compras con datos validados"""
    print(f"🎯 Recibiendo solicitud de optimización")
    print(f"   Presupuesto: {request.budget}")
    print(f"   Categorías: {request.categories}")
    
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    
    if request.categories:
        placeholders = ','.join('?' for _ in request.categories)
        query = f'SELECT * FROM products WHERE category IN ({placeholders})'
        cursor.execute(query, request.categories)
    else:
        cursor.execute('SELECT * FROM products')
    
    products_data = cursor.fetchall()
    conn.close()
    
    # Convertir a formato diccionario
    products = []
    for product in products_data:
        products.append({
            "id": product[0],
            "barcode": product[1],
            "name": product[2],
            "brand": product[3],
            "price": product[4],
            "sustainability_score": product[5],
            "health_score": product[6],
            "category": product[7],
            "carbon_footprint": product[8],
            "image_url": product[9] if len(product) > 9 else None
        })
    
    print(f"📦 Productos disponibles: {len(products)}")
    
    # Validar que hay productos
    if not products:
        return {
            "optimized_products": [],
            "total_cost": 0,
            "budget_used": 0,
            "total_savings": request.budget,
            "average_sustainability": 0,
            "total_carbon_footprint": 0,
            "products_count": 0,
            "message": "No hay productos disponibles para optimizar"
        }
    
    # Aplicar algoritmo de mochila
    try:
        optimized_products, budget_used = knapsack_multi_objective(products, int(request.budget))
        
        # Calcular métricas
        total_cost = sum(p['price'] for p in optimized_products)
        total_savings = request.budget - total_cost if request.budget > total_cost else 0
        avg_sustainability = sum(p['sustainability_score'] for p in optimized_products) / len(optimized_products) if optimized_products else 0
        total_carbon = sum(p['carbon_footprint'] for p in optimized_products)
        
        result = {
            "optimized_products": optimized_products,
            "total_cost": total_cost,
            "budget_used": budget_used,
            "total_savings": total_savings,
            "average_sustainability": round(avg_sustainability, 2),
            "total_carbon_footprint": round(total_carbon, 2),
            "products_count": len(optimized_products),
            "message": "Optimización completada exitosamente"
        }
        
        print(f"✅ Optimización exitosa: {len(optimized_products)} productos")
        return result
        
    except Exception as e:
        print(f"❌ Error en algoritmo: {e}")
        return {
            "optimized_products": [],
            "total_cost": 0,
            "budget_used": 0,
            "total_savings": request.budget,
            "average_sustainability": 0,
            "total_carbon_footprint": 0,
            "products_count": 0,
            "message": f"Error en optimización: {str(e)}"
        }

# Sistema de recomendaciones
@app.get("/product-recommendations/{barcode}")
def get_product_recommendations(barcode: str):
    """Obtiene recomendaciones de productos más sostenibles"""
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    
    # Obtener producto actual
    cursor.execute('SELECT * FROM products WHERE barcode = ?', (barcode,))
    current_product = cursor.fetchone()
    
    if not current_product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    current_category = current_product[7]  # category
    current_sustainability = current_product[5]  # sustainability_score
    
    # Buscar alternativas en la misma categoría con mejor sostenibilidad
    cursor.execute('''
        SELECT * FROM products 
        WHERE category = ? AND sustainability_score > ? 
        ORDER BY sustainability_score DESC 
        LIMIT 3
    ''', (current_category, current_sustainability))
    
    alternatives = cursor.fetchall()
    conn.close()
    
    # Convertir a formato diccionario
    recommendations = []
    for product in alternatives:
        sustainability_improvement = product[5] - current_sustainability
        price_difference = product[4] - current_product[4]
        
        recommendations.append({
            "barcode": product[1],
            "name": product[2],
            "brand": product[3],
            "price": product[4],
            "sustainability_score": product[5],
            "sustainability_improvement": round(sustainability_improvement, 2),
            "price_difference": price_difference,
            "carbon_footprint": product[8],
            "image_url": product[9] if len(product) > 9 else None,  # ¡NUEVO!
            "improvement_percentage": round((sustainability_improvement / current_sustainability) * 100, 1)
        })
    
    return {
        "current_product": {
            "name": current_product[2],
            "sustainability_score": current_product[5],
            "carbon_footprint": current_product[8]
        },
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# NUEVO: Carbon Footprint API
def calculate_detailed_carbon_footprint(product_data):
    """Calcula huella de carbono más precisa usando CarbonInterface"""
    try:
        # En una implementación real necesitarías una API key
        # Por ahora usamos cálculo mejorado
        category = product_data.get('categories', '').lower()
        
        # Factores de emisión por categoría (kg CO2e por producto)
        carbon_factors = {
            'meat': 6.0, 'beef': 27.0, 'lamb': 20.0, 'cheese': 13.5,
            'fish': 5.0, 'chocolate': 5.0, 'coffee': 4.0,
            'dairy': 3.0, 'milk': 3.0, 'yogurt': 2.5,
            'bread': 1.0, 'pasta': 1.5, 'rice': 2.0,
            'fruits': 0.5, 'vegetables': 0.4, 'legumes': 0.8,
            'beverages': 1.0, 'water': 0.5
        }
        
        # Buscar categoría coincidente
        base_carbon = 2.0  # Default
        for key, value in carbon_factors.items():
            if key in category:
                base_carbon = value
                break
        
        # Ajustar por packaging
        packaging = product_data.get('packaging', '').lower()
        if 'plastic' in packaging:
            base_carbon += 0.5
        elif 'glass' in packaging:
            base_carbon += 0.3
        elif 'recycl' in packaging:
            base_carbon -= 0.2
            
        return round(base_carbon, 1)
        
    except Exception as e:
        print(f"Error cálculo carbono: {e}")
        return 2.0  # Fallback
    # NUEVO: Sistema de tiendas y rutas
@app.get("/nearby-stores")
def get_nearby_stores(lat: float, lon: float, radius_km: int = 5):
    """Encuentra tiendas cercanas usando OpenStreetMap"""
    try:
        # Simulación de tiendas - en realidad usarías OpenStreetMap Nominatim
        stores = [
            {
                "name": "Supermercado Central",
                "address": "Av. Principal 123",
                "distance": round(random.uniform(0.5, 3.0), 1),
                "products_available": random.randint(50, 200),
                "sustainability_rating": random.uniform(6.0, 9.0),
                "coordinates": {"lat": lat + random.uniform(-0.01, 0.01), "lon": lon + random.uniform(-0.01, 0.01)}
            },
            {
                "name": "EcoMarket",
                "address": "Calle Verde 456",
                "distance": round(random.uniform(1.0, 4.0), 1),
                "products_available": random.randint(30, 100),
                "sustainability_rating": random.uniform(8.0, 9.5),
                "coordinates": {"lat": lat + random.uniform(-0.01, 0.01), "lon": lon + random.uniform(-0.01, 0.01)}
            },
            {
                "name": "Mercado Local",
                "address": "Plaza Central 789",
                "distance": round(random.uniform(0.8, 2.5), 1),
                "products_available": random.randint(20, 80),
                "sustainability_rating": random.uniform(7.0, 8.5),
                "coordinates": {"lat": lat + random.uniform(-0.01, 0.01), "lon": lon + random.uniform(-0.01, 0.01)}
            }
        ]
        
        # Ordenar por distancia
        stores.sort(key=lambda x: x['distance'])
        
        return {"stores": stores}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error buscando tiendas: {str(e)}")

# NUEVO: Optimización de rutas de compras
@app.post("/optimize-shopping-route")
def optimize_shopping_route(stores: List[Dict], products: List[Dict]):
    """Optimiza la ruta para visitar múltiples tiendas"""
    try:
        # Algoritmo simple de optimización de ruta
        # En una implementación real usarías algoritmos como TSP
        
        optimized_route = []
        remaining_products = products.copy()
        current_location = {"lat": -33.4489, "lon": -70.6693}  # Santiago centro
        
        for store in sorted(stores, key=lambda x: x['distance']):
            if not remaining_products:
                break
                
            # Simular productos disponibles en esta tienda
            available_products = remaining_products[:random.randint(1, min(5, len(remaining_products)))]
            optimized_route.append({
                "store": store,
                "products_to_buy": available_products,
                "estimated_savings": sum(p.get('price', 0) * 0.1 for p in available_products),  # 10% ahorro estimado
                "distance_from_previous": store['distance']
            })
            
            # Remover productos comprados
            remaining_products = remaining_products[len(available_products):]
        
        total_distance = sum(store['distance'] for store in stores[:len(optimized_route)])
        total_savings = sum(step['estimated_savings'] for step in optimized_route)
        
        return {
            "optimized_route": optimized_route,
            "total_distance_km": round(total_distance, 1),
            "total_estimated_savings": round(total_savings),
            "products_remaining": len(remaining_products),
            "efficiency_score": round((len(products) - len(remaining_products)) / len(products) * 100, 1)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error optimizando ruta: {str(e)}")
    # NUEVO: Sistema Completo de Recompensas
@app.get("/user-rewards/{user_id}")
def get_user_rewards(user_id: str):
    """Sistema completo de recompensas por compras sostenibles"""
    
    # Simular datos del usuario (en una app real esto vendría de una base de datos)
    user_data = {
        "user_id": user_id,
        "username": "EcoGuerrero",
        "member_since": "2024-01-15",
        "total_co2_saved": 45.7,
        "total_money_saved": 12500,
        "sustainable_purchases": 28
    }
    
    # Calcular nivel basado en puntos
    points = user_data["sustainable_purchases"] * 10 + int(user_data["total_co2_saved"] * 5)
    
    # Determinar nivel
    if points >= 500:
        level = "Héroe del Planeta 🌍"
        level_color = "bg-purple-500"
    elif points >= 300:
        level = "Eco Champion 🏆"
        level_color = "bg-blue-500"
    elif points >= 150:
        level = "Guerrero Verde 🌿"
        level_color = "bg-green-500"
    else:
        level = "Aprendiz Eco 🌱"
        level_color = "bg-yellow-500"
    
    # Badges disponibles
    all_badges = [
        {"id": 1, "name": "Primera Compra Sostenible", "icon": "🎯", "earned": True, "description": "Tu primera compra eco-friendly"},
        {"id": 2, "name": "Ahorrador Expert@", "icon": "💰", "earned": user_data["total_money_saved"] > 5000, "description": "Ahorrado más de $5,000"},
        {"id": 3, "name": "Reductor de CO2", "icon": "🌍", "earned": user_data["total_co2_saved"] > 20, "description": "Reducido 20+ kg de CO2"},
        {"id": 4, "name": "Comprador Consciente", "icon": "🛒", "earned": user_data["sustainable_purchases"] > 15, "description": "15+ compras sostenibles"},
        {"id": 5, "name": "Local Lover", "icon": "🏘️", "earned": False, "description": "10+ compras en tiendas locales"},
        {"id": 6, "name": "Planeta Protector", "icon": "🛡️", "earned": points >= 300, "description": "Alcanzado nivel Eco Champion"},
        {"id": 7, "name": "Héroe del Reciclaje", "icon": "♻️", "earned": False, "description": "Productos 100% reciclables"},
        {"id": 8, "name": "Leyenda Sostenible", "icon": "🌟", "earned": points >= 500, "description": "Nivel máximo alcanzado"}
    ]
    
    # Recompensas disponibles
    available_rewards = [
        {"id": 1, "name": "10% de descuento", "points_required": 50, "claimed": False, "type": "discount"},
        {"id": 2, "name": "Envío gratuito", "points_required": 80, "claimed": False, "type": "shipping"},
        {"id": 3, "name": "Producto eco gratis", "points_required": 120, "claimed": False, "type": "product"},
        {"id": 4, "name": "Kit sostenible", "points_required": 200, "claimed": False, "type": "kit"},
        {"id": 5, "name": "Asesoría eco-experto", "points_required": 150, "claimed": False, "type": "service"}
    ]
    
    # Próximos logros
    next_achievements = [
        {"goal": "Llegar a 50 compras sostenibles", "progress": user_data["sustainable_purchases"], "target": 50},
        {"goal": "Ahorrar $20,000", "progress": user_data["total_money_saved"], "target": 20000},
        {"goal": "Reducir 100kg de CO2", "progress": user_data["total_co2_saved"], "target": 100},
        {"goal": "Completar todos los badges", "progress": len([b for b in all_badges if b["earned"]]), "target": len(all_badges)}
    ]
    
    # Estadísticas de impacto
    impact_stats = {
        "co2_saved_kg": user_data["total_co2_saved"],
        "trees_equivalent": round(user_data["total_co2_saved"] / 21.77, 1),  # 1 árbol absorbe ~21.77kg CO2/año
        "money_saved": user_data["total_money_saved"],
        "sustainable_purchases": user_data["sustainable_purchases"],
        "water_saved_liters": user_data["sustainable_purchases"] * 50,  # Estimado
        "plastic_reduced_kg": user_data["sustainable_purchases"] * 0.5   # Estimado
    }
    
    return {
        "user_info": user_data,
        "points": points,
        "level": level,
        "level_color": level_color,
        "next_level_points": max(0, 500 - points) if points < 500 else 0,
        "badges": all_badges,
        "rewards": available_rewards,
        "next_achievements": next_achievements,
        "impact_stats": impact_stats,
        "leaderboard_position": 42  # Posición en el ranking global
    }

# Registrar compra sostenible
@app.post("/register-sustainable-purchase")
def register_sustainable_purchase(request: PurchaseRequest):
    """Registra una compra sostenible y actualiza recompensas"""
    print(f"🛒 Registrando compra para usuario: {request.user_id}")
    print(f"   CO2 ahorrado: {request.purchase_data.co2_saved}kg")
    print(f"   Dinero ahorrado: ${request.purchase_data.money_saved}")
    print(f"   Productos: {request.purchase_data.products_count}")
    
    # En una app real, esto guardaría en la base de datos
    co2_saved = request.purchase_data.co2_saved
    money_saved = request.purchase_data.money_saved
    products_count = request.purchase_data.products_count
    
    # Simular cálculo de puntos
    points_earned = int(co2_saved * 2 + money_saved * 0.01 + products_count * 5)
    
    # Simular nuevos badges ganados
    new_badges = []
    if money_saved > 5000:
        new_badges.append("Ahorrador Expert@")
    if co2_saved > 20:
        new_badges.append("Reductor de CO2")
    
    response_data = {
        "success": True,
        "points_earned": points_earned,
        "new_badges": new_badges,
        "message": f"¡Compra registrada! Ganaste {points_earned} puntos",
        "user_id": request.user_id,
        "purchase_data": request.purchase_data.dict()
    }
    
    print(f"✅ Puntos ganados: {points_earned}")
    print(f"✅ Nuevos badges: {new_badges}")
    
    return response_data

# Ranking de usuarios
@app.get("/leaderboard")
def get_leaderboard(limit: int = 10):
    """Obtiene el ranking de usuarios más sostenibles"""
    
    # Datos de ejemplo para el leaderboard
    leaderboard_data = [
        {"position": 1, "username": "EcoMaster", "points": 890, "level": "Héroe del Planeta", "co2_saved": 120.5},
        {"position": 2, "username": "GreenWarrior", "points": 765, "level": "Héroe del Planeta", "co2_saved": 98.3},
        {"position": 3, "username": "SustainableShopper", "points": 654, "level": "Eco Champion", "co2_saved": 87.6},
        {"position": 4, "username": "PlanetProtector", "points": 543, "level": "Eco Champion", "co2_saved": 76.2},
        {"position": 5, "username": "EcoExplorer", "points": 432, "level": "Guerrero Verde", "co2_saved": 65.8},
        {"position": 6, "username": "GreenThumb", "points": 321, "level": "Guerrero Verde", "co2_saved": 54.1},
        {"position": 7, "username": "SustainableLife", "points": 234, "level": "Aprendiz Eco", "co2_saved": 43.7},
        {"position": 8, "username": "EcoFriendlyUser", "points": 187, "level": "Aprendiz Eco", "co2_saved": 32.9},
        {"position": 9, "username": "GreenNewbie", "points": 145, "level": "Aprendiz Eco", "co2_saved": 28.4},
        {"position": 10, "username": "EcoBeginner", "points": 98, "level": "Aprendiz Eco", "co2_saved": 21.6}
    ]
    
    return {"leaderboard": leaderboard_data[:limit]}