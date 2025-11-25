import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ChevronLeft } from 'lucide-react';

export default function AddStock() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    api.get('/productos').then(res => setProductos(res.data));
  }, []);

  const handleGuardar = async () => {
    if(!selectedId || !cantidad || !precio) return alert("Llena todo");
    try {
        const fechaHoy = new Date().toISOString().split('T')[0];
        await api.post('/inventario/comprar', {
            productoId: selectedId,
            cantidad: Number(cantidad),
            precioUnitario: Number(precio),
            fechaCompra: fechaHoy
        });
        alert("✅ Compra registrada");
        navigate('/');
    } catch(e) { alert("Error al guardar"); }
  };

  return (
    <div className="page-container">
      <div className="nav-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft /></button>
        <h2>Registrar Compra 🛒</h2>
      </div>

      <div className="form-container">
        <label>Producto:</label>
        <select className="input" onChange={e => setSelectedId(e.target.value)} value={selectedId}>
            <option value="">Selecciona...</option>
            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>

        <label>Cantidad:</label>
        <input type="number" className="input" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="Ej: 5" />

        <label>Precio Unitario ($):</label>
        <input type="number" className="input" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Ej: 20.50" />

        <button className="btn-success" onClick={handleGuardar}>GUARDAR COMPRA</button>
      </div>
    </div>
  );
}