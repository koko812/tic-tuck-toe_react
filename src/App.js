import React, { useState } from 'react';

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const winner = calculateWinner(squares);

  const handleClick = (index) => {
    if (squares[index] || winner) return; // 既に置かれてる or 勝者が出てる

    const nextSquares = squares.slice();
    nextSquares[index] = isXTurn ? 'X' : 'O';
    setSquares(nextSquares);
    setIsXTurn(!isXTurn);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setIsXTurn(true);
  };

  const renderSquare = (i) => (
    <button
      onClick={() => handleClick(i)}
      style={{
        width: '60px',
        height: '60px',
        fontSize: '32px',
        fontFamily: 'monospace',  // ← 等幅フォントに！
        margin: '5px',
        lineHeight: '60px',       // ← 高さ調整（必要なら）
        textAlign: 'center',
        verticalAlign: 'middle',
      }}
    >
      {squares[i]}
    </button>
  );

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>〇×ゲーム（Tic Tac Toe）</h1>
      <p>{winner ? `勝者: ${winner}` : `次の手番: ${isXTurn ? 'X' : 'O'}`}</p>
      <div>
        {[0, 1, 2].map((row) => (
          <div key={row}>
            {renderSquare(row * 3)}
            {renderSquare(row * 3 + 1)}
            {renderSquare(row * 3 + 2)}
          </div>
        ))}
      </div>
      <button onClick={handleReset} style={{ marginTop: '20px' }}>リセット</button>
    </div>
  );
}

// 勝者判定の関数
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // 横
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // 縦
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // 斜め
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
