import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Consumir from './pages/Consumir';
import AddStock from './pages/AddStock';
import Admin from './pages/Admin';
import Manager from './pages/Manager'; // <--- NUEVO
import Reports from './pages/Reports'; // <--- NUEVO (Asegúrate que exista el archivo)
import BottomNav from './components/BottomNav';

function App() {
  return (
    <div className="app-wrapper">
      <div className="content">
        <Routes>
          {/* Rutas Principales */}
          <Route path="/" element={<Home />} />
          
          {/* Rutas de Producto y Consumo */}
          <Route path="/productos/:id" element={<ProductList />} />
          <Route path="/consumir/:id" element={<Consumir />} />
          <Route path="/add-stock" element={<AddStock />} />
          
          {/* Rutas de Admin */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/manager" element={<Manager />} /> {/* <--- RUTA NUEVA */}
          
          {/* Ruta de Reportes (Ahora sí conectada) */}
          <Route path="/reportes" element={<Reports />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default App;