import sqlite3
import os

def create_sample_database():
    """Crea la base de datos con productos de ejemplo"""
    
    # Eliminar base de datos existente si hay
    if os.path.exists('products.db'):
        os.remove('products.db')
        print("🗑️  Base de datos anterior eliminada")
    
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    
    # Crear tabla de productos
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
            carbon_footprint REAL,
            image_url TEXT
        )
    ''')
    
    # Productos de ejemplo - 18 productos en 7 categorías
    sample_products = [
        # 🥛 LÁCTEOS (3 productos)
        ('1234567890123', 'Leche Entera', 'Soprole', 1200, 7.5, 6.0, 'Lácteos', 2.1, None),
        ('1234567890126', 'Yogurt Natural', 'Nestlé', 800, 6.5, 7.0, 'Lácteos', 1.8, None),
        ('1234567890131', 'Queso Gauda', 'Colun', 3200, 5.0, 5.5, 'Lácteos', 3.2, None),
        
        # 🍞 PANADERÍA (3 productos)
        ('1234567890124', 'Pan Integral', 'Bimbo', 2500, 8.0, 8.5, 'Panadería', 1.2, None),
        ('1234567890132', 'Galletas Integrales', 'Costa', 1800, 6.0, 6.5, 'Panadería', 1.5, None),
        ('1234567890141', 'Pan Molde Blanco', 'Hallulla', 2200, 5.5, 5.0, 'Panadería', 1.8, None),
        
        # 🍎 FRUTAS (3 productos)
        ('1234567890125', 'Manzanas', 'Fruta Natural', 1500, 9.0, 9.0, 'Frutas', 0.5, None),
        ('1234567890133', 'Plátanos', 'Fruta Natural', 1200, 8.5, 8.0, 'Frutas', 0.3, None),
        ('1234567890134', 'Naranjas', 'Fruta Natural', 1800, 8.0, 9.0, 'Frutas', 0.4, None),
        
        # 🌾 GRANOS (3 productos)
        ('1234567890127', 'Arroz Integral', 'Tucapel', 2200, 7.0, 8.0, 'Granos', 1.5, None),
        ('1234567890135', 'Lentejas', 'Iansa', 1500, 8.5, 9.0, 'Granos', 0.8, None),
        ('1234567890136', 'Avena Tradicional', 'Quaker', 1300, 7.5, 8.5, 'Granos', 1.0, None),
        
        # 🐟 PESCADO (2 productos)
        ('1234567890128', 'Atún en Lata', 'Campo Marino', 1800, 5.5, 7.5, 'Pescado', 2.5, None),
        ('1234567890137', 'Salmón Fresco', 'Salmones Chile', 6500, 4.0, 8.0, 'Pescado', 4.2, None),
        
        # 🧼 LIMPIEZA (2 productos)
        ('1234567890129', 'Jabón Líquido', 'Linic', 3200, 4.0, 6.0, 'Limpieza', 3.0, None),
        ('1234567890138', 'Detergente Líquido', 'Drive', 4200, 3.5, 5.0, 'Limpieza', 3.5, None),
        
        # 🥤 BEBIDAS (3 productos)
        ('1234567890130', 'Agua Mineral', 'Cachantun', 800, 3.5, 7.0, 'Bebidas', 1.0, None),
        ('1234567890139', 'Jugo de Naranja', 'Andina', 2200, 6.0, 6.5, 'Bebidas', 1.8, None),
        ('1234567890140', 'Té Verde', 'Té Supremo', 1500, 7.0, 8.0, 'Bebidas', 0.6, None)
    ]
    
    # Insertar productos
    cursor.executemany('''
        INSERT INTO products 
        (barcode, name, brand, price, sustainability_score, health_score, category, carbon_footprint, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_products)
    
    conn.commit()
    
    # Estadísticas
    cursor.execute('SELECT COUNT(*) FROM products')
    total_products = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(DISTINCT category) FROM products')
    total_categories = cursor.fetchone()[0]
    
    cursor.execute('SELECT AVG(price), AVG(sustainability_score), AVG(health_score) FROM products')
    stats = cursor.fetchone()
    
    print("🎉 BASE DE DATOS CREADA EXITOSAMENTE")
    print("=" * 50)
    print(f"📦 Total de productos: {total_products}")
    print(f"🏷️  Categorías diferentes: {total_categories}")
    print(f"💰 Precio promedio: ${stats[0]:.0f} CLP")
    print(f"🌱 Sostenibilidad promedio: {stats[1]:.1f}/10")
    print(f"❤️  Salud promedio: {stats[2]:.1f}/10")
    print("=" * 50)
    
    # Mostrar productos por categoría
    print("\n📊 PRODUCTOS POR CATEGORÍA:")
    cursor.execute('''
        SELECT category, COUNT(*), AVG(sustainability_score), AVG(price)
        FROM products 
        GROUP BY category 
        ORDER BY AVG(sustainability_score) DESC
    ''')
    
    categories = cursor.fetchall()
    for category in categories:
        emoji = {
            'Lácteos': '🥛', 'Panadería': '🍞', 'Frutas': '🍎', 
            'Granos': '🌾', 'Pescado': '🐟', 'Limpieza': '🧼', 'Bebidas': '🥤'
        }.get(category[0], '📦')
        
        print(f"  {emoji} {category[0]}: {category[1]} productos | Sostenibilidad: {category[2]:.1f}/10 | Precio avg: ${category[3]:.0f}")
    
    conn.close()
    print(f"\n✅ Base de datos guardada en: products.db")
    print("💡 Ejecuta el backend con: uvicorn main:app --reload --port 8000")

if __name__ == "__main__":
    create_sample_database()