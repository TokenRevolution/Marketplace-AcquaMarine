import React from 'react';
import PenguinRace from './CrazyPenguin';

class Salagiochi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameOpen: false,
    };
  }

  handleDivClick = () => {
    this.setState({ isGameOpen: true });
  };

  render() {
    const { isGameOpen } = this.state;

    if (isGameOpen) {
      return <PenguinRace />;
    }

    return (
      <div className="salagiochi-container">
        <div className="game-item" onClick={this.handleDivClick}>
          <img className="game-image" src="https://media.tenor.com/-NAtxEIRPvYAAAAM/crazy-penguin-tongue-out.gif" alt="Game 1" />
          <div className="game-description">
            <h2>Crazy Pinguin</h2>
            <p>This game will allow you to bet on the outcome of a race of 10 penguins, choose the winning penguin and place your bets.</p>
          </div>
        </div>
        <div className="game-item" onClick={this.handleDivClick}>
          <img className="game-image" src="https://dyn1.heritagestatic.com/lf?set=path%5B7%2F4%2F3%2F6%2F7436623%5D&call=url%5Bfile%3Aproduct.chain%5D" alt="Game 2" />
          <div className="game-description">
            <h2>Dogs Roulette</h2>
            <p>Descrizione del gioco 2...</p>
          </div>
        </div>
        {/* Aggiungi altri div per gli altri giochi */}
      </div>
    );
  }
}

export default Salagiochi;
