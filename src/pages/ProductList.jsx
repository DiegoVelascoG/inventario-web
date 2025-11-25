import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ChevronLeft, Package } from 'lucide-react';

export default function ProductList() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    api.get(`/productos/categoria/${id}`).then(res => setProductos(res.data));
  }, [id]);

  return (
    <div className="page-container">
      <div className="nav-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft /></button>
        <h2>{state?.nombre || 'Productos'}</h2>
      </div>

      <div className="list">
        {productos.map(prod => (
          <div key={prod.id} className="list-item" onClick={() => navigate(`/consumir/${prod.id}`, { state: { producto: prod } })}>
            <div className="item-info">
              <Package size={24} color="#4CAF50" />
              <div>
                <h4>{prod.nombre}</h4>
                <p>{prod.unidadMedida}</p>
              </div>
            </div>
            <span className="badge">Consumir</span>
          </div>
        ))}
      </div>
    </div>
  );
}