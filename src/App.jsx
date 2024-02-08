import React, { useState } from 'react';
import NFT from './NFT';
import Staking from './Staking';
import Reward from './Reward';
import LandingPage from './landing'; // Importa il componente Landing
import SwapComponent from './swap.jsx';
import Salagiochi from './salagiochi'
import './NFT.css';
import  './landing.css';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Home'); // Imposta la pagina di default su 'Home'

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <LandingPage />; // Renderizza il componente Landing per la pagina Home
      case 'NFT':
        return <NFT />;
      case 'Staking':
        return <Staking />;
      case 'Reward':
        return <Reward />;
      case 'Swap':
        return <SwapComponent />;
      case 'Games':
        return <Salagiochi />
      default:
        return <LandingPage />; // Se currentPage non corrisponde a nessuna pagina, renderizza la pagina Home
    }
  };

  return (
    <div>
      <nav>
        <ul id="nav">
          <li>
            <button onClick={() => setCurrentPage('Home')}>Home</button> {/* Aggiungi il pulsante Home */}
          </li>
          <li>
            <button onClick={() => setCurrentPage('NFT')}>NFT</button>
          </li>
        </ul>
      </nav>
      {renderPage()}
    </div>
  );
}

export default App;
