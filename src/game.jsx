import React, { useState, useEffect, useRef } from 'react';

const PenguinRace = () => {
  const [raceNumber, setRaceNumber] = useState(1);
  const [raceTime, setRaceTime] = useState(0);
  const [bettingEnabled, setBettingEnabled] = useState(false);
  const [winnerAnnounced, setWinnerAnnounced] = useState(false);
  const [winner, setWinner] = useState(null);
  const [betAmount, setBetAmount] = useState(0);
  const [selectedPenguin, setSelectedPenguin] = useState(null);
  const [userPoints, setUserPoints] = useState(1000);
  const [isWinner, setIsWinner] = useState(false);
  const [raceLog, setRaceLog] = useState([]);
  const [betHistory, setBetHistory] = useState([]);
  const [winnerHistory, setWinnerHistory] = useState([]);
  const canvasRef = useRef(null);
  const penguinImage = useRef(null);
  const penguinPositions = useRef([0, 0, 0, 0, 0]);

useEffect(() => {
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  const trackWidth = canvas.width - 40;
  const trackHeight = canvas.height - 40;

  const drawTrack = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw track border
  context.strokeStyle = '#000';
  context.lineWidth = 4;
  context.strokeRect(20, 20, trackWidth, trackHeight);

  // Draw start and finish lines
  context.beginPath();
  context.moveTo(20, 20);
  context.lineTo(20, 20 + trackHeight);
  context.moveTo(20 + trackWidth, 20);
  context.lineTo(20 + trackWidth, 20 + trackHeight);
  context.stroke();

  // Draw finish line
  const finishLineX = 20 + trackWidth * 0.9;
  context.beginPath();
  context.moveTo(finishLineX, 20);
  context.lineTo(finishLineX, 20 + trackHeight);
  context.strokeStyle = 'red';
  context.lineWidth = 2;
  context.stroke();

  // Draw penguins
  penguinPositions.current.forEach((position, index) => {
    const x = 20 + position;
    const y = 20 + trackHeight / 6 + index * (trackHeight / 6);
    context.drawImage(penguinImage.current, x, y, 40, 40);
  });
};

  const calculatePenguinPositions = () => {
    if (winnerAnnounced) {
      penguinPositions.current[winner - 1] += (trackWidth / 1) * (raceTime / 7);
    }
  };

  if (raceTime === 0) {
    // Reset penguin positions
    penguinPositions.current = [0, 0, 0, 0, 0];
  }

  calculatePenguinPositions();
  drawTrack();
}, [raceTime, winnerAnnounced]);


  
  useEffect(() => {
    const raceInterval = setInterval(() => {
      setRaceTime((time) => time + 1);
    }, 10000);

    return () => clearInterval(raceInterval);
  }, []);

  useEffect(() => {
    if (raceTime === 0) {
      setBettingEnabled(true);
      setWinnerAnnounced(false);
      setWinner(null);
      setSelectedPenguin(null);
      setIsWinner(false);
      setRaceLog([]);
    } else if (raceTime === 5) {
      setBettingEnabled(false);
      // Aggiornamento durante la gara
      const event = getRandomEvent(selectedPenguin);
      setRaceLog((log) => [...log, event]);
    } else if (raceTime === 6) {
      const randomWinner = Math.floor(Math.random() * 5) + 1;
      setWinner(randomWinner);
      setWinnerAnnounced(true);
      if (randomWinner === selectedPenguin) {
        setIsWinner(true);
        const winningAmount = betAmount * 5;
        setUserPoints(userPoints + winningAmount);
        setRaceLog((log) => [
          ...log,
          `Penguin #${selectedPenguin} have won the race! You win ${winningAmount} token.`
        ]);
      } else {
        setUserPoints(userPoints - betAmount);
        setRaceLog((log) => [
          ...log,
          `Penguin #${selectedPenguin} have lose the race. You lose ${betAmount} token.`
        ]);
      }
      setBetHistory((history) => [...history, { betAmount, penguinNumber: selectedPenguin }]);
      setWinnerHistory((history) => [...history, randomWinner]);
    } else if (raceTime === 7) {
      setRaceNumber((number) => number + 1);
      setRaceTime(0);
    }
  }, [raceTime]);

  const placeBet = (amount, penguinNumber) => {
    if (bettingEnabled) {
      setBetAmount(amount);
      setSelectedPenguin(penguinNumber);
      setRaceLog((log) => [
        ...log,
        `Scommessa piazzata sul Penguin ${penguinNumber}`
      ]);
    } else {
      setRaceLog((log) => [...log, 'Bets are closed for this race!']);
    }
  };

  const handleAmountChange = (event) => {
    setBetAmount(Number(event.target.value));
  };

  const calculateWinningAmount = () => {
    if (isWinner) {
      return betAmount * 5;
    } else {
      return 0;
    }
  };

  const getRandomEvent = (selectedPenguin) => {
    const events = [
      "The penguin 1 is in the lead!",
      "The penguin 2 is in the lead!",
      "The penguin 3 is in the lead!",
      "The penguin 4 is in the lead!",
      "The penguin 5 is in the lead!",
      "Overtake! Penguin 1 surpasses the opponents!",
      "Overtake! Penguin 2 surpasses the opponents!",
      "Overtake! Penguin 3 surpasses the opponents!",
      "Overtake! Penguin 4 surpasses the opponents!",
      "Overtake! Penguin 5 surpasses the opponents!",
      "Fall! Penguin 1 loses some positions.",
      "Fall! Penguin 2 loses some positions.",
      "Fall! Penguin 3 loses some positions.",
      "Fall! Penguin 4 loses some positions.",
      "Fall! Penguin 5 loses some positions.",
      "Fun moment! Penguin 1 slips but quickly gets back up!",
      "Fun moment! Penguin 2 slips but quickly gets back up!",
      "Fun moment! Penguin 3 slips but quickly gets back up!",
      "Fun moment! Penguin 4 slips but quickly gets back up!",
      "Fun moment! Penguin 5 slips but quickly gets back up!",
    ];
    const randomIndex = Math.floor(Math.random() * events.length);
    return events[randomIndex];
  };

  return (
    <div>
      <h2>Run, Penguins, Run!</h2>
      <p>Race #{raceNumber}</p>
      <p>Time: {raceTime} minutes</p>
      <div>
        {bettingEnabled ? (
          <div>
            <p>Select amount for bet:</p>
            <select value={betAmount} onChange={handleAmountChange}>
              <option value={0}>0</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={60}>60</option>
              <option value={70}>70</option>
              <option value={80}>80</option>
              <option value={90}>90</option>
              <option value={100}>100</option>
            </select>
            <p>Choose the winner:</p>
            <div>
              {[1, 2, 3, 4, 5].map((pinguin) => (
                <button key={pinguin} onClick={() => placeBet(betAmount, pinguin)}>
                  Penguin #{pinguin}
                </button>
              ))}
            </div>
            {selectedPenguin && (
              <p>You Bet {betAmount} on #{selectedPenguin}</p>
            )}
          </div>
        ) : (
          <p>Bets are Closed!</p>
        )}
        {winnerAnnounced ? (
          <div>
            <p>Vincitore: Penguin #{winner}</p>
            {isWinner ? (
              <p>You win {calculateWinningAmount()} token!</p>
            ) : (
              <p>You lose {betAmount} token.</p>
            )}
          </div>
        ) : (
          <p>Make your game</p>
        )}
        <h3>Race Events:</h3>
        <ul>
          {raceLog.map((logItem, index) => (
            <li key={index}>{logItem}</li>
          ))}
        </ul>
        <h3>Bet History:</h3>
        <ul>
          {betHistory.map((bet, index) => (
            <li key={index}>
              Bet amount: {bet.betAmount}, Penguin: {bet.penguinNumber}
            </li>
          ))}
        </ul>
        <h3>Winner History:</h3>
        <ul>
          {winnerHistory.map((winner, index) => (
            <li key={index}>Winner: Penguin #{winner}</li>
          ))}
        </ul>
      </div>
      <p>Token Balance: {userPoints}</p>
      <canvas ref={canvasRef} width={600} height={400} style={{ border: '1px solid black' }} />
      <img
        src="https://static.vecteezy.com/system/resources/previews/018/248/994/original/penguin-on-a-transparent-background-png.png"
        alt="Penguin"
        ref={penguinImage}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PenguinRace;
