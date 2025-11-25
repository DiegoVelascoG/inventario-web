import { useState, useEffect } from 'react';
import api from '../api/api';
import { TrendingDown, Calendar, DollarSign, Activity } from 'lucide-react';

export default function Reports() {
  const [data, setData] = useState([]);
  const [financiero, setFinanciero] = useState({ gastoEsteMes: 0, promedioMensual: 0 });
  const [loading, setLoading] = useState(true);

  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1; 
  const anioActual = hoy.getFullYear();
  const nombreMes = hoy.toLocaleString('es-ES', { month: 'long' });

  // Formateador de dinero (Ej: $1,250.00)
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        // Llamamos a las dos APIs en paralelo
        const [resLista, resFinanzas] = await Promise.all([
            api.get(`/reportes/mensual?mes=${mesActual}&anio=${anioActual}`),
            api.get(`/reportes/financiero?mes=${mesActual}&anio=${anioActual}`)
        ]);
        
        setData(resLista.data);
        setFinanciero(resFinanzas.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarTodo();
  }, []);

  if (loading) return <div className="loading">Calculando gastos...</div>;

  return (
    <div className="page-container">
      <h2 className="header-title">Reportes 📊</h2>
      <p className="month-subtitle">{nombreMes} {anioActual}</p>

      {/* --- GRID DE RESUMEN FINANCIERO --- */}
      <div className="stats-grid">
          {/* Tarjeta 1: Gasto del Mes (Verde/Rojo) */}
          <div className="stat-card primary">
             <div className="stat-icon-bg"><DollarSign color="white" size={24}/></div>
             <div>
                 <span className="stat-label">Gastado este Mes</span>
                 <div className="stat-value">{formatMoney(financiero.gastoEsteMes)}</div>
             </div>
          </div>

          {/* Tarjeta 2: Promedio (Azul) */}
          <div className="stat-card secondary">
             <div className="stat-icon-bg"><Activity color="white" size={24}/></div>
             <div>
                 <span className="stat-label">Promedio Mensual</span>
                 <div className="stat-value sub">{formatMoney(financiero.promedioMensual)}</div>
             </div>
          </div>
      </div>

      <h3 style={{marginBottom: '15px', color: '#333', marginTop: '20px'}}>Detalle de Movimientos:</h3>
      
      <div className="list">
        {data.length === 0 ? (
            <div className="empty-state"><p>No hay consumo registrado este mes.</p></div>
        ) : (
            data.map(item => {
                // Calculamos el costo de este movimiento específico para mostrarlo
                const costoMovimiento = item.cantidadConsumida * (item.inventario?.precioUnitario || 0);
                
                return (
                    <div key={item.id} className="list-item no-hover">
                        <div className="item-info">
                            <div className="icon-box-report">
                                <TrendingDown size={20} color="#D32F2F" />
                            </div>
                            <div>
                                <h4>{item.inventario?.producto?.nombre || 'Desconocido'}</h4>
                                <div className="date-row">
                                    <Calendar size={12} style={{marginRight:4}}/>
                                    <span>{item.fechaConsumo}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="qty-container">
                            {/* Mostramos DINERO en grande y cantidad en chico */}
                            <span className="qty-text">{formatMoney(costoMovimiento)}</span>
                            <span className="unit-text">-{item.cantidadConsumida} {item.inventario?.producto?.unidadMedida}</span>
                        </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
}