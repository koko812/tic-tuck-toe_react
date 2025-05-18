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
  titleButton: {
    marginTop: '40px',
    padding: '12px 24px',
    fontSize: '20px',
  },
  returnButton: {
    marginTop: '20px',
    padding: '8px 16px',
    fontSize: '16px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

function Square({ value, onClick, highlight }) {
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
  const [view, setView] = useState('title');
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [mode, setMode] = useState(null); // 'single' or 'multi'

  const result = calculateWinner(squares);
  const winner = typeof result === 'string' ? result : result?.winner;

  const highlightSquares = Array(9).fill(false);
  if (result && result.line) {
    for (const i of result.line) highlightSquares[i] = true;
  }

  // 🟢 1. ゲーム状態だけをリセット（盤面、手番）
  const handleResetGameState = () => {
    setSquares(Array(9).fill(null));
    setIsXTurn(true);
  };

  // 🟢 2. 指定モードでゲーム開始（タイトル → ゲーム画面へ）
  const startGame = (selectedMode) => {
    handleResetGameState();
    setMode(selectedMode);
    setView('game');
  };

  // 🟢 3. タイトルに戻る（状態・モードをすべて初期化）
  const returnToTitle = () => {
    handleResetGameState();
    setMode(null);
    setView('title');
  };

  const handleClick = (index) => {
    if (squares[index] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[index] = isXTurn ? 'X' : 'O';
    setSquares(nextSquares);
    setIsXTurn(!isXTurn);

    // CPU行動（1人プレイ時）
    if (mode === 'single' && isXTurn === true) {
      setTimeout(() => {
        const index = findBestMove(nextSquares, 'O', 'X');
        if (index !== undefined) {
          nextSquares[index] = 'O';
          setSquares([...nextSquares]);
          setIsXTurn(true);
        }
      }, 300);
    }
  };

  if (view === 'title') {
    return (
      <div style={styles.container}>
        <h1>ようこそ 〇×ゲームへ</h1>
        <p>モードを選んでください</p>
        <button style={styles.titleButton} onClick={() => startGame('single')}>
          1人で遊ぶ
        </button>
        <br />
        <button style={styles.titleButton} onClick={() => startGame('multi')}>
          2人で遊ぶ
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>〇×ゲーム（Tic Tac Toe）</h1>
      <p>
        {winner === 'draw'
          ? '引き分けです'
          : winner
            ? `勝者: ${winner}`
            : `次の手番: ${isXTurn ? 'X' : 'O'}`}
      </p>
      <div>
        {[0, 1, 2].map((row) => (
          <div key={row} style={styles.boardRow}>
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onClick={() => handleClick(index)}
                  highlight={highlightSquares[index]}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={handleResetGameState} style={styles.resetButton}>
        リセット
      </button>
      <button onClick={returnToTitle} style={styles.returnButton}>
        タイトルに戻る
      </button>
    </div>
  );
}


function findBestMove(squares, myMark, opponentMark) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  // 勝てる手を探す
  for (const [a, b, c] of lines) {
    const line = [squares[a], squares[b], squares[c]];
    const marks = line.filter(Boolean);
    if (marks.filter(m => m === myMark).length === 2 && line.includes(null)) {
      return [a, b, c].find(i => squares[i] === null);
    }
  }

  // 防ぐべき手を探す
  for (const [a, b, c] of lines) {
    const line = [squares[a], squares[b], squares[c]];
    const marks = line.filter(Boolean);
    if (marks.filter(m => m === opponentMark).length === 2 && line.includes(null)) {
      return [a, b, c].find(i => squares[i] === null);
    }
  }

  // ランダムに選ぶ
  const emptyIndices = squares.map((v, i) => v === null ? i : null).filter(i => i !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  if (squares.every(Boolean)) {
    return 'draw';
  }
  return null;
}

export default App;
