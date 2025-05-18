import React, { useState } from 'react';

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
    padding: '0 16px',
  },
  boardRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  square: {
    width: '20vw',
    maxWidth: '80px',
    height: '20vw',
    maxHeight: '80px',
    fontSize: '6vw',
    maxFontSize: '32px',
    fontFamily: 'monospace',
    margin: '2vw',
    lineHeight: '1',
    textAlign: 'center',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
  },
  resetButton: {
    marginTop: '20px',
    padding: '8px 16px',
    fontSize: '16px',
  },
};

function Square({ value, onClick }) {
  return (
    <button onClick={onClick} style={styles.square}>
      {value}
    </button>
  );
}

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const winner = calculateWinner(squares);

  const handleClick = (index) => {
    if (squares[index] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[index] = isXTurn ? 'X' : 'O';
    setSquares(nextSquares);
    setIsXTurn(!isXTurn);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setIsXTurn(true);
  };

  return (
    <div style={styles.container}>
      <h1>〇×ゲーム（Tic Tac Toe）</h1>
      <p>{winner ? `勝者: ${winner}` : `次の手番: ${isXTurn ? 'X' : 'O'}`}</p>
      <div>
        {[0, 1, 2].map((row) => (
          <div key={row} style={styles.boardRow}>
            <Square value={squares[row * 3]} onClick={() => handleClick(row * 3)} />
            <Square value={squares[row * 3 + 1]} onClick={() => handleClick(row * 3 + 1)} />
            <Square value={squares[row * 3 + 2]} onClick={() => handleClick(row * 3 + 2)} />
          </div>
        ))}
      </div>
      <button onClick={handleReset} style={styles.resetButton}>リセット</button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
