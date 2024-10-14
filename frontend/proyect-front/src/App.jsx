import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SidebarMenu from './components/SidebarMenu'; 
import Footer from './components/Footer'; 
import Home from './pages/Home';

import './styles/app.css';

function App() {
  return (
    <Router>
      <div className="container-fluid d-flex flex-column min-vh-100">
          <header className="p-header">
            <Header />
          </header>

        <div className="row flex-grow-1">
          <aside className="col-2 bg-secondary text-white p-3">
            <SidebarMenu />
          </aside>

          <main className="col-10 p-3">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Otras rutas comentadas */}
              {/* <Route path="/about" element={<About />} /> */}
            </Routes>
          </main>
        </div>

        <div className="row">
          <footer className="col-12 bg-dark text-white text-center p-2 mt-auto">
            <Footer />
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App
