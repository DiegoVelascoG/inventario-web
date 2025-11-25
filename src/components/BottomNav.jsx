import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, BarChart2 } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav">
      <button 
        className={isActive('/') ? 'active' : ''} 
        onClick={() => navigate('/')}
      >
        <Home size={24} />
        <span>Inicio</span>
      </button>

      <button 
        className={isActive('/admin') ? 'active' : ''} 
        onClick={() => navigate('/admin')}
      >
        <PlusCircle size={24} />
        <span>Crear</span>
      </button>

      <button 
        className={isActive('/reportes') ? 'active' : ''} 
        onClick={() => navigate('/reportes')}
      >
        <BarChart2 size={24} />
        <span>Reportes</span>
      </button>
    </div>
  );
}