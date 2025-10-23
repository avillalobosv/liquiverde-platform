import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    """Test que la raíz funciona"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "LiquiVerde API funcionando!"}

def test_health():
    """Test del endpoint de health"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_get_products():
    """Test que obtiene productos"""
    response = client.get("/products")
    assert response.status_code == 200
    assert "products" in response.json()

def test_get_product_not_found():
    """Test producto no encontrado"""
    response = client.get("/products/0000000000000")  # Corregí la ruta
    assert response.status_code == 404

def test_optimize_shopping_list():
    """Test de optimización de lista de compras"""
    # Test con presupuesto bajo
    data = {
        "budget": 5000,
        "categories": ["Lácteos", "Frutas"]
    }
    response = client.post("/optimize-shopping-list", json=data)
    assert response.status_code == 200
    result = response.json()
    assert "optimized_products" in result
    assert "total_cost" in result
    assert result["total_cost"] <= 5000  # No debe superar el presupuesto