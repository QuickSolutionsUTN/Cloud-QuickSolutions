import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importar router
import Header from './components/Header'; // Importar el Header
import SidebarMenu from './components/SidebarMenu'; // Importar el Sidebar
import Home from './pages/Home'; // Importar la página principal

import './styles/app.css';

function App() {
  return (
    <Router>
    <div className="container-fluid">
      <header>
        <Header /> {/* Renderizar el Header solo una vez */}
      </header>
      <div className="row">
        <aside className="col-md-3">
          <SidebarMenu /> {/* Renderizar el Sidebar solo una vez */}
        </aside>
        <main className="col-md-9">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* Otras rutas se pueden agregar aquí */}
          </Routes>
        </main>
      </div>
    </div>
  </Router>
  )
}

export default App
