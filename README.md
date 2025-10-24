# LiquiVerde - Retail Inteligente Sostenible

## Descripción
**LiquiVerde** es una plataforma de retail inteligente que permite a los consumidores ahorrar dinero mientras toman decisiones de compra sostenibles. Optimiza el presupuesto y el impacto ambiental mediante recomendaciones y herramientas basadas en datos.

---

## Entornos de Desarrollo

### Backend
cd liquiverde-platform/backend  
source venv/bin/activate  # Windows: venv\Scripts\activate

### Frontend
cd liquiverde-platform/frontend

---

## Ejecución

### Opción 1: Docker (recomendado)
docker-compose up --build

- Backend: http://localhost:8000  
- Frontend: http://localhost:5174  

### Opción 2: Ejecución Manual

**Backend**
cd backend  
uvicorn main:app --reload --port 8000

**Frontend**
cd frontend  
npm install  
npm run dev

### Deploy en Render
- Backend: https://liquiverde-backend.onrender.com  
- Frontend: https://liquiverde-frontend.onrender.com  

---

## Características Implementadas

### Funcionalidades Principales
- **Escáner de Productos**: Búsqueda por código de barras o nombre usando Open Food Facts API  
- **Listas de Compras Optimizadas**: Algoritmo de mochila multi-objetivo  
- **Sistema de Scoring de Sostenibilidad**: Evaluación automática basada en múltiples factores  
- **Recomendaciones Inteligentes**: Sugerencias de alternativas más sostenibles  
- **Dashboard de Impacto**: Métricas de ahorro y reducción ambiental

### Funcionalidades Adicionales
- Sistema de recomendaciones de sustitución  
- Comparador de productos y alternativas  
- Mapa de tiendas y rutas eficientes  
- Sistema de recompensas por sostenibilidad  

---

## Stack Tecnológico

### Frontend
- React 18 + Vite  
- Tailwind CSS  
- Lucide React (iconos)  
- Axios (HTTP client)  

### Backend
- Python + FastAPI  
- SQLite (base de datos)  
- Requests (consumo de APIs externas)  

---

## Instrucciones de Ejecución Rápida

### Backend
cd backend  
python -m venv venv  
source venv/bin/activate  # Windows: venv\Scripts\activate  
pip install -r requirements.txt  
uvicorn main:app --reload --port 8000

### Frontend
cd frontend  
npm install  
npm run dev  

Acceder a: http://localhost:5174

---

## Configuración de APIs
**Open Food Facts API**  
- URL: https://world.openfoodfacts.org/api/v0/product/{barcode}.json  
- Uso: Búsqueda automática de productos  
- No requiere API key  

---

## Variables de Entorno (Opcionales)
# Backend - Para despliegue futuro
DATABASE_URL=sqlite:///products.db  
CORS_ORIGINS=http://localhost:5174  

---

## Algoritmos Implementados

### 1. Algoritmo de Mochila Multi-objetivo
Optimiza la lista de compras considerando múltiples objetivos:

| Objetivo       | Peso |
|----------------|------|
| Precio         | 40%  |
| Sostenibilidad | 30%  |
| Salud          | 20%  |
| Huella de Carbono | 10% |

Fórmula de optimización:
score = (
    weights['sustainability'] * sustainability * 10 +
    weights['health'] * health * 10 -
    weights['price'] * (price / 100) -
    weights['carbon'] * carbon * 2
)

### 2. Sistema de Scoring de Sostenibilidad
Factores evaluados:
- Ecoscore (Open Food Facts)  
- Nutri-Score  
- Ingredientes ecológicos  
- Packaging sostenible  
- Origen local  

---

## Uso de IA

### Asistencia de ChatGPT/Assistant
- Consultas técnicas y debugging  
- Implementación del algoritmo de mochila multi-objetivo  
- Solución de problemas CORS  
- Optimización de consultas a APIs externas  
- Orden y documentación de código  

### Contribución Humana
- Decisiones arquitectónicas  
- Configuración inicial de React + FastAPI  
- Pruebas y validación de funcionalidades  
- Personalización de interfaz de usuario y diseño de componentes  
- Ajuste de parámetros de algoritmos  
- Documentación y despliegue en Docker  

---

## Pruebas Recomendadas

### Escáner de Productos
- Códigos de prueba: 3017620422003 (Nutella), 7613035540354 (Coca Cola)  

### Lista de Compras
- Presupuesto de prueba: $15,000  
- Probar con y sin filtros de categoría  

### Sistema de Recompensas
- Hacer clic en "Simular Compra Sostenible" varias veces  

---

## Dataset de Ejemplo
- 18 productos de ejemplo en 7 categorías  

### Generar Base de Datos
cd backend  
python create_database.py

### Códigos de barras de prueba
| Código | Producto | Precio |
|--------|---------|-------|
| 1234567890123 | Leche Entera | $1,200 |
| 1234567890125 | Manzanas | $1,500 |
| 1234567890124 | Pan Integral | $2,500 |
| 1234567890127 | Arroz Integral | $2,200 |
| 1234567890128 | Atún en Lata | $1,800 |

### Test automatizado
cd backend  
pip install pytest  
pytest test_main.py -v  

---

**Autor:** Allison Villalobos Vergara  
**Correo:** afvillalobosv@outlook.com  
**Repositorio:** https://github.com/avillalobosv/
