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
  xStyle: {
    color: 'blue', // X は青で表示
  },
  oStyle: {
    color: 'red', // O は赤で表示
  },
  highlight: {
    backgroundColor: 'lightyellow', // 勝者マスのハイライト用
  },
  resetButton: {
    marginTop: '20px',
    padding: '8px 16px',
    fontSize: '16px',
  },
};

// Square は value, onClick, highlight を props として受け取る
function Square({ value, onClick, highlight }) {
  // X/O の色と勝者マスハイライトを合成
  const style = {
    ...styles.square,
    ...(value === 'X' ? styles.xStyle : value === 'O' ? styles.oStyle : {}),
    ...(highlight ? styles.highlight : {}),
  };
  return (
    <button onClick={onClick} style={style}>
      {value}
    </button>
  );
}

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null)); // 9マス分の状態（null, 'X', 'O'）を保持
  const [isXTurn, setIsXTurn] = useState(true); // 手番のトラッキング

  const result = calculateWinner(squares); // 勝者（'X' or 'O'）または 'draw' または null
  const winner = typeof result === 'string' ? result : result?.winner;
  const highlightSquares = Array(9).fill(false);
  if (result && result.line) {
    for (const i of result.line) highlightSquares[i] = true;
  }

  const handleClick = (index) => {
    if (squares[index] || winner) return; // 既に埋まっている or 勝敗が決まっているなら無視

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
      <p>
        {/* 勝敗に応じたメッセージ表示 */}
        {winner === 'draw'
          ? '引き分けです'
          : winner
          ? `勝者: ${winner}`
          : `次の手番: ${isXTurn ? 'X' : 'O'}`}
      </p>
      <div>
        {[0, 1, 2].map((row) => (
          <div key={row} style={styles.boardRow}>
            <Square value={squares[row * 3]} onClick={() => handleClick(row * 3)} highlight={highlightSquares[row * 3]} />
            <Square value={squares[row * 3 + 1]} onClick={() => handleClick(row * 3 + 1)} highlight={highlightSquares[row * 3 + 1]} />
            <Square value={squares[row * 3 + 2]} onClick={() => handleClick(row * 3 + 2)} highlight={highlightSquares[row * 3 + 2]} />
          </div>
        ))}
      </div>
      <button onClick={handleReset} style={styles.resetButton}>リセット</button>
    </div>
  );
}

// 勝者判定と、勝利ラインの情報も返すよう拡張
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
      return { winner: squares[a], line: [a, b, c] }; // 勝利者とラインを返す
    }
  }
  if (squares.every(Boolean)) {
    return 'draw'; // 引き分け
  }
  return null;
}

export default App;
