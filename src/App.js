// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Products from './pages/Products';
import InvestorRelations from './pages/InvestorRelations';
import Contact from './pages/Contact';
import ServiceDetail from './pages/ServiceDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/products" element={<Products />} />
          <Route path="/investor-relations" element={<InvestorRelations />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/services/:id" element={<ServiceDetail />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
