import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- IMPORTANTE
import api from '../api/api';
import { 
  ShoppingBasket, Utensils, Snowflake, Droplet, Sparkles, 
  HeartPulse, PawPrint, Shirt, Hammer, Zap, PenTool, Gift, Box,
  CheckCircle, Settings 
} from 'lucide-react';

// CONSTANTES
const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#009688', '#E91E63', '#607D8B', '#795548'];
const UNITS = ['UNIDADES', 'LITROS', 'KILOS', 'GRAMOS', 'MILILITROS'];

export const ICON_MAP = {
    basket: { component: ShoppingBasket, label: 'Super' },
    restaurant: { component: Utensils, label: 'Comida' },
    snow: { component: Snowflake, label: 'Frio' },
    water: { component: Droplet, label: 'Bebidas' },
    sparkles: { component: Sparkles, label: 'Limpieza' },
    medkit: { component: HeartPulse, label: 'Salud' },
    paw: { component: PawPrint, label: 'Mascotas' },
    shirt: { component: Shirt, label: 'Ropa' },
    construct: { component: Hammer, label: 'Hogar' },
    flash: { component: Zap, label: 'Electro' },
    school: { component: PenTool, label: 'Papelería' },
    gift: { component: Gift, label: 'Regalos' },
    cube: { component: Box, label: 'Otro' },
};
const ICON_KEYS = Object.keys(ICON_MAP);

export default function Admin() {
  const navigate = useNavigate(); // <--- Hook para navegar
  const [tab, setTab] = useState('prod');
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);

  // Estados Formulario
  const [prodNombre, setProdNombre] = useState('');
  const [prodMin, setProdMin] = useState('1');
  const [prodCatId, setProdCatId] = useState('');
  const [prodUnidad, setProdUnidad] = useState('UNIDADES');

  const [catNombre, setCatNombre] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catColor, setCatColor] = useState(COLORS[0]); 
  const [catIcono, setCatIcono] = useState('cube');   

  useEffect(() => { 
      api.get('/categorias').then(res => setCategorias(res.data)); 
  }, []);

  const crearCat = async () => {
    if(!catNombre.trim()) return alert("Nombre requerido");
    setLoading(true);
    try {
        await api.post('/categorias', { nombre: catNombre, descripcion: catDesc, colorHex: catColor, icono: catIcono });
        alert("✅ Categoría creada"); window.location.reload();
    } catch(e) { alert("Error"); setLoading(false); }
  };

  const crearProd = async () => {
    if(!prodNombre.trim() || !prodCatId) return alert("Faltan datos");
    setLoading(true);
    try {
        await api.post('/productos', { nombre: prodNombre, unidadMedida: prodUnidad, stockMinimo: prodMin, categoria: {id: prodCatId} });
        alert("✅ Producto creado"); window.location.reload();
    } catch(e) { alert("Error"); setLoading(false); }
  };

  const SelectedIconData = ICON_MAP[catIcono] || ICON_MAP['cube'];
  const SelectedIconComponent = SelectedIconData.component;

  return (
    <div className="page-container" style={{paddingBottom: 100}}>
      <h2 className="header-title">Administración 🛠️</h2>
      
      {/* BOTÓN DE GESTIONAR (NUEVO) */}
      <button className="btn-manage" onClick={() => navigate('/admin/manager')}>
        <Settings size={20} style={{marginRight: 8}} />
        Gestionar y Editar Existentes
      </button>

      <div className="tabs-container">
        <button className={`tab-btn ${tab === 'prod' ? 'active' : ''}`} onClick={() => setTab('prod')}>Nuevo Producto</button>
        <button className={`tab-btn ${tab === 'cat' ? 'active' : ''}`} onClick={() => setTab('cat')}>Nueva Categoría</button>
      </div>

      <div className="form-card fade-in">
        {tab === 'prod' ? (
          <div className="form-content">
              <label className="form-label">Nombre del Producto:</label>
              <input className="input-field" value={prodNombre} onChange={e => setProdNombre(e.target.value)} placeholder="Ej: Jabón Zest" />
              
              <label className="form-label">Categoría:</label>
              <div className="chip-scroll-container">
                  {categorias.map(c => {
                      const IconData = ICON_MAP[c.icono] || ICON_MAP['cube'];
                      const IconComponent = IconData.component;
                      return (
                        <button key={c.id} 
                            className={`chip-btn ${prodCatId === c.id ? 'selected' : ''}`}
                            onClick={() => setProdCatId(c.id)}
                        >
                            <IconComponent size={16} style={{marginRight:5}} />
                            {c.nombre}
                            {prodCatId === c.id && <CheckCircle size={14} style={{marginLeft:5}}/>}
                        </button>
                      );
                  })}
              </div>

              <label className="form-label">Unidad de Medida:</label>
              <div className="chip-scroll-container">
                  {UNITS.map(u => (
                      <button key={u} className={`chip-btn orange ${prodUnidad === u ? 'selected' : ''}`} onClick={() => setProdUnidad(u)}>{u}</button>
                  ))}
              </div>

              <label className="form-label">Stock Mínimo (Alerta):</label>
              <input type="number" className="input-field short" value={prodMin} onChange={e => setProdMin(e.target.value)} />
              
              <button className="btn-submit" onClick={crearProd} disabled={loading}>{loading ? 'Creando...' : 'CREAR PRODUCTO'}</button>
          </div>
        ) : (
          <div className="form-content">
              <label className="form-label">Nombre Categoría:</label>
              <input className="input-field" value={catNombre} onChange={e => setCatNombre(e.target.value)} />
              <label className="form-label">Descripción:</label>
              <input className="input-field" value={catDesc} onChange={e => setCatDesc(e.target.value)} />
              
              <label className="form-label mt-3">Color:</label>
              <div className="chip-scroll-container center-items">
                  {COLORS.map(c => (
                      <div key={c} className={`color-circle-selector ${catColor === c ? 'active' : ''}`} style={{backgroundColor: c}} onClick={() => setCatColor(c)}/>
                  ))}
              </div>

              <label className="form-label mt-3">Icono:</label>
              <div className="chip-scroll-container">
                  {ICON_KEYS.map(key => {
                      const { component: IconCmd, label } = ICON_MAP[key];
                      const isSelected = catIcono === key;
                      return (
                        <div key={key} className={`icon-chip-selector ${isSelected ? 'active' : ''}`}
                            style={isSelected ? {backgroundColor: catColor, borderColor: catColor} : {}}
                            onClick={() => setCatIcono(key)}
                        >
                            <IconCmd size={24} color={isSelected ? 'white' : '#666'} />
                            <span style={{color: isSelected ? 'white' : '#666'}}>{label}</span>
                        </div>
                      )
                  })}
              </div>
              
              <label className="form-label mt-4">Vista Previa:</label>
              <div className="preview-card-container" style={{borderLeftColor: catColor}}>
                  <div className="preview-icon-box"><SelectedIconComponent size={32} color="#555" /></div>
                  <div><h3 className="preview-title">{catNombre || 'Nombre Categoría'}</h3><p className="preview-desc">{catDesc || 'Descripción...'}</p></div>
              </div>

              <button className="btn-submit" style={{backgroundColor: catColor}} onClick={crearCat} disabled={loading}>{loading ? 'Creando...' : 'CREAR CATEGORÍA'}</button>
          </div>
        )}
      </div>
    </div>
  );
}