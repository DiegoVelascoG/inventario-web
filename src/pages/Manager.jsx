import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ChevronLeft, Pencil, X } from 'lucide-react';
import { ICON_MAP } from './Admin'; // Reutilizamos el mapa de iconos

// Constantes (mismas que Admin)
const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#009688', '#E91E63', '#607D8B', '#795548'];
const UNITS = ['UNIDADES', 'LITROS', 'KILOS', 'GRAMOS', 'MILILITROS'];
const ICON_KEYS = Object.keys(ICON_MAP);

export default function Manager() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('producto'); 
  const [items, setItems] = useState([]);
  
  // Modal y Edición
  const [editingItem, setEditingItem] = useState(null); // Si no es null, muestra modal
  
  // Form States
  const [formNombre, setFormNombre] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIcono, setFormIcono] = useState('cube');
  const [formColor, setFormColor] = useState('#4CAF50');
  const [formUnidad, setFormUnidad] = useState('');
  const [formMinimo, setFormMinimo] = useState('');

  // Cargar datos al cambiar modo
  const cargarDatos = () => {
    const endpoint = mode === 'producto' ? '/productos' : '/categorias';
    api.get(endpoint).then(res => setItems(res.data));
  };

  useEffect(() => { cargarDatos(); }, [mode]);

  // Abrir Editor
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormNombre(item.nombre);
    if(mode === 'categoria') {
        setFormDesc(item.descripcion || '');
        setFormIcono(item.icono || 'cube');
        setFormColor(item.colorHex || '#4CAF50');
    } else {
        setFormUnidad(item.unidadMedida);
        setFormMinimo(item.stockMinimo);
    }
  };

  // Guardar Cambios
  const handleSave = async () => {
    try {
        if(mode === 'categoria') {
            await api.put(`/categorias/${editingItem.id}`, {
                nombre: formNombre,
                descripcion: formDesc,
                icono: formIcono,
                colorHex: formColor
            });
        } else {
            await api.put(`/productos/${editingItem.id}`, {
                nombre: formNombre,
                unidadMedida: formUnidad,
                stockMinimo: Number(formMinimo),
                categoria: editingItem.categoria
            });
        }
        alert("✅ Actualizado");
        setEditingItem(null); // Cerrar modal
        cargarDatos(); // Refrescar lista
    } catch(e) { alert("Error al actualizar"); }
  };

  return (
    <div className="page-container">
      <div className="nav-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft /></button>
        <h2>Gestionar {mode === 'producto' ? 'Productos' : 'Categorías'}</h2>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${mode === 'producto' ? 'active' : ''}`} onClick={() => setMode('producto')}>Productos</button>
        <button className={`tab-btn ${mode === 'categoria' ? 'active' : ''}`} onClick={() => setMode('categoria')}>Categorías</button>
      </div>

      <div className="list">
        {items.map(item => (
            <div key={item.id} className="list-item" style={{borderLeft: mode==='categoria' ? `5px solid ${item.colorHex}` : 'none'}}>
                <div className="item-info">
                    {mode === 'categoria' && ICON_MAP[item.icono] && 
                        <div style={{color: item.colorHex}}>
                            {(() => { const I = ICON_MAP[item.icono].component; return <I size={24}/> })()}
                        </div>
                    }
                    <div>
                        <h4>{item.nombre}</h4>
                        <p>{mode === 'producto' ? `${item.unidadMedida} • Min: ${item.stockMinimo}` : item.descripcion}</p>
                    </div>
                </div>
                <button className="edit-circle-btn" onClick={() => handleEdit(item)}>
                    <Pencil size={16} color="white"/>
                </button>
            </div>
        ))}
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {editingItem && (
        <div className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header">
                    <h3>Editar {mode === 'producto' ? 'Producto' : 'Categoría'}</h3>
                    <button className="close-btn" onClick={() => setEditingItem(null)}><X size={24}/></button>
                </div>
                
                <div className="modal-body">
                    <label className="form-label">Nombre:</label>
                    <input className="input-field" value={formNombre} onChange={e => setFormNombre(e.target.value)}/>

                    {mode === 'categoria' ? (
                        <>
                            <label className="form-label">Descripción:</label>
                            <input className="input-field" value={formDesc} onChange={e => setFormDesc(e.target.value)}/>
                            
                            <label className="form-label mt-3">Color:</label>
                            <div className="chip-scroll-container center-items">
                                {COLORS.map(c => (
                                    <div key={c} className={`color-circle-selector ${formColor === c ? 'active' : ''}`} style={{backgroundColor: c}} onClick={() => setFormColor(c)}/>
                                ))}
                            </div>

                            <label className="form-label mt-3">Icono:</label>
                            <div className="chip-scroll-container">
                                {ICON_KEYS.map(key => {
                                    const { component: IconCmd, label } = ICON_MAP[key];
                                    const isSelected = formIcono === key;
                                    return (
                                        <div key={key} className={`icon-chip-selector ${isSelected ? 'active' : ''}`}
                                            style={isSelected ? {backgroundColor: formColor, borderColor: formColor} : {}}
                                            onClick={() => setFormIcono(key)}
                                        >
                                            <IconCmd size={24} color={isSelected ? 'white' : '#666'} />
                                            <span style={{color: isSelected ? 'white' : '#666'}}>{label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            <label className="form-label">Unidad:</label>
                            <div className="chip-scroll-container">
                                {UNITS.map(u => (
                                    <button key={u} className={`chip-btn orange ${formUnidad === u ? 'selected' : ''}`} onClick={() => setFormUnidad(u)}>{u}</button>
                                ))}
                            </div>
                            <label className="form-label">Stock Mínimo:</label>
                            <input type="number" className="input-field short" value={formMinimo} onChange={e => setFormMinimo(e.target.value)}/>
                        </>
                    )}

                    <button className="btn-submit" style={{marginTop: 20, backgroundColor: mode==='categoria' ? formColor : '#4CAF50'}} onClick={handleSave}>
                        GUARDAR CAMBIOS
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}