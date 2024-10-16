import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SidebarMenu from './components/SidebarMenu'; 
import Footer from './components/Footer'; 
import Home from './pages/Home';
import EquiposPage from './pages/EquiposPage.jsx';
import SolicitudesAlquiler from './pages/SolicitudesAlquiler.jsx';
import SolicitudesRevision from './pages/SolicitudesRevision.jsx';
import TopNavbar from './components/TopNavbar.jsx';
import LoginButton from './components/LoginButton.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <header className="p-header bg-dark p-2 d-flex justify-content-between">
          <TopNavbar />
          <LoginButton />
        </header>

        <div className="row flex-grow-1">
          <aside className="p-sidebar bg-dark col-1">
            <SidebarMenu />
          </aside>

          <main className="col-11 p-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/equipos" element={<EquiposPage />} /> {/* Página de equipos */}
              <Route path="/solicitudes_alq" element={<SolicitudesAlquiler />} /> {/* Página de solicitudes de alquiler */}
              <Route path="/solicitudes_rev" element={<SolicitudesRevision />} /> {/* Página de solicitudes de revisión */}
            </Routes>
          </main>
        </div>
      </Router>

      <Footer />
    </div>
  );
}

export default App
