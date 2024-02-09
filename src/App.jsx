import React, { useState } from 'react';
import NFT from './NFT';
import LandingPage from './landing'; // Importa il componente Landing
import './NFT.css';
import  './landing.css';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Home'); // Imposta la pagina di default su 'Home'

  const renderPage = () => {
    switch (currentPage) {
      case 'NFT':
        return <NFT />;
      default:
        return <NFT />; // Se currentPage non corrisponde a nessuna pagina, renderizza la pagina Home
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
}

export default App;
