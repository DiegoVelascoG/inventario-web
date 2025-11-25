import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Package, AlertTriangle, Plus } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resCat, resAlertas] = await Promise.all([
          api.get('/categorias'),
          api.get('/inventario/alertas')
        ]);
        setCategorias(resCat.data);
        setAlertas(resAlertas.data);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    cargarDatos();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="page-container">
      <h1 className="header-title">Mi Inventario 🏠</h1>

      {alertas.length > 0 && (
        <div className="alert-section">
          <h3>⚠️ Por Comprar ({alertas.length})</h3>
          <div className="horizontal-scroll">
            {alertas.map(item => (
              <div key={item.productoId} className="alert-card" onClick={() => navigate('/add-stock')}>
                <AlertTriangle color="#D32F2F" size={20} />
                <div>
                  <p className="alert-title">{item.nombre}</p>
                  <p className="alert-sub">Tienes: <b>{item.stockActual}</b> / Mín: {item.stockMinimo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid">
        {categorias.map(cat => (
          <div 
            key={cat.id} 
            className="card" 
            style={{ borderLeft: `5px solid ${cat.colorHex || '#4CAF50'}` }}
            onClick={() => navigate(`/productos/${cat.id}`, { state: { nombre: cat.nombre } })}
          >
            <div className="icon-box">
              {/* Aquí podrías mapear los iconos de string a Lucide si quieres perfeccionismo */}
              <Package color="#555" size={32} />
            </div>
            <h3>{cat.nombre}</h3>
            <p>{cat.descripcion || 'Sin descripción'}</p>
          </div>
        ))}
      </div>

      <button className="fab" onClick={() => navigate('/add-stock')}>
        <Plus color="white" size={32} />
      </button>
    </div>
  );
}