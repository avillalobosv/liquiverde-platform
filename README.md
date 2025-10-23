*LiquiVerde - Retail Inteligente Sostenible*

*#  Descripción*
Plataforma de retail inteligente que ayuda a consumidores a ahorrar dinero mientras toman decisiones de compra sostenibles, optimizando presupuesto e impacto ambiental.

*# Características Implementadas*

*### Funcionalidades Principales*
- **Escáner de Productos**: Búsqueda por código de barras o nombre usando Open Food Facts API
- **Listas de Compras Optimizadas**: Algoritmo de mochila multi-objetivo
- **Sistema de Scoring de Sostenibilidad**: Cálculo automático basado en múltiples factores
- **Recomendaciones Inteligentes**: Alternativas más sostenibles
- **Dashboard de Impacto**: Métricas de ahorro y reducción ambiental

*### Bonus Implementados*
- Dashboard de ahorros e impacto ambiental
- Sistema de recomendaciones de sustitución
- Comparador de productos y alternativas
- Mapa de tiendas y rutas eficientes
- Sistema de recompensas por sostenibilidad
##################################################################################################################################
*## Stack Tecnológico*

*### Frontend*
- React 18 + Vite
- Tailwind CSS
- Lucide React (iconos)
- Axios (HTTP client)

*### Backend*  
- Python + FastAPI
- SQLite (base de datos)
- Requests (APIs externas)

##################################################################################################################################
*## Instrucciones de Ejecución Rápida*

*### Backend*
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

*### Fronted*
cd frontend
npm install
npm run dev
Accede a: http://localhost:5174
##################################################################################################################################
*Configuración de APIs*
Open Food Facts API
URL: https://world.openfoodfacts.org/api/v0/product/{barcode}.json
Uso: Búsqueda automática de productos
No requiere API key
##################################################################################################################################
*Variables de Entorno (Opcionales)*
# Backend - Agregar en futuro despliegue
DATABASE_URL=sqlite:///products.db
CORS_ORIGINS=http://localhost:5174
##################################################################################################################################
Algoritmos Implementados
*1. Algoritmo de Mochila Multi-objetivo*
Propósito: Optimizar lista de compras considerando múltiples objetivos
Objetivos considerados:
Precio (40% peso)
Sostenibilidad (30% peso)
Salud (20% peso)
Huella de Carbono (10% peso)
Fórmula de optimización:
score = (
    weights['sustainability'] * sustainability * 10 +
    weights['health'] * health * 10 -
    weights['price'] * (price / 100) -
    weights['carbon'] * carbon * 2
)
*2. Sistema de Scoring de Sostenibilidad*
Factores considerados:
Ecoscore (Open Food Facts)
Nutri-Score
Ingredientes ecológicos
Packaging sostenible
Origen local
##################################################################################################################################
*Uso de IA*
*Asistencia Recibida*
ChatGPT/Assistant: Consultas técnicas, debugging, y estructura de código
Areas de asistencia:
Implementación de algoritmo de mochila multi-objetivo
Solución de problemas CORS
Optimización de consultas a APIs externas
Solucion de errores (Apoyo de creacion debug)
Ordenar codigo y comentarios para mejor entendimiento

*Contribución Humana*
Toma de decisiones arquitectónicas
Configuración inicial de React + FastAPI
Pruebas y validación de funcionalidades
Personalización de interfaz de usuario
Diseño de componentes React
Ajuste de parámetros de algoritmos
Documentación y preparación de entrega
Instalacion Docker

##################################################################################################################################
*Pruebas Recomendadas*
*1. Escáner de Productos*
Códigos de prueba: 3017620422003 (Nutella), 7613035540354 (Coca Cola)
*2. Lista de Compras*
Presupuesto: $15,000
Categorías: Probar con y sin filtros
*3. Sistema de Recompensas*
Hacer clic en "Simular Compra Sostenible" múltiples veces

##################################################################################
*Dataset de Ejemplo*
El proyecto incluye **18 productos de ejemplo** en **7 categorías** diferentes 

##Generar Base de Datos
cd backend
python create_database.py

*Codigos de barras de pruebas*
1234567890123 - Leche Entera ($1,200)
1234567890125 - Manzanas ($1,500) 
1234567890124 - Pan Integral ($2,500)
1234567890127 - Arroz Integral ($2,200)
1234567890128 - Atún en Lata ($1,800)

*Docker*
docker-compose up --build
# ✅ Backend running on http://localhost:8000  
# ✅ Frontend running on http://localhost:5174

*Render*
Backend https://liquiverde-backend.onrender.com
Frontend https://liquiverde-frontend.onrender.com

By Allison Villalobos Vergara
afvillalobosv@outlook.com
https://github.com/avillalobosv/