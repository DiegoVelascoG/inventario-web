import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ChevronLeft, ShoppingCart } from 'lucide-react';

export default function Consumir() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const producto = state?.producto;
  const [cantidad, setCantidad] = useState("1");

  const handleConsumir = async () => {
    try {
      await api.post('/inventario/consumir', {
        productoId: producto.id,
        cantidad: Number(cantidad)
      });
      alert(`✅ Se descontaron ${cantidad} ${producto.unidadMedida}`);
      navigate(-1);
    } catch (error) {
      alert("❌ Error: " + (error.response?.data || "No hay stock suficiente"));
    }
  };

  return (
    <div className="page-container centered">
      <button className="back-btn-abs" onClick={() => navigate(-1)}><ChevronLeft /></button>
      
      <div className="card-detail">
        <ShoppingCart size={48} color="#4CAF50" />
        <h2>{producto?.nombre}</h2>
        <p>¿Cuánto vas a consumir hoy?</p>

        <div className="input-group-center">
          <input 
            type="number" 
            className="big-input" 
            value={cantidad} 
            onChange={(e) => setCantidad(e.target.value)} 
          />
          <span>{producto?.unidadMedida}</span>
        </div>

        <button className="btn-primary" onClick={handleConsumir}>CONSUMIR AHORA</button>
      </div>
    </div>
  );
}