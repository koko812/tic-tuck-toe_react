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
    color: 'blue',
  },
  oStyle: {
    color: 'red',
  },
  highlight: {
    backgroundColor: 'lightyellow',
  },
  resetButton: {
    marginTop: '20px',
    padding: '8px 16px',
    fontSize: '16px',
  },
  titleButton: {
    marginTop: 20,
    padding: '12px 24px',
    fontSize: '20px',
    display: 'block',       // 縦並びにする
    width: '200px',         // ボタン幅を揃える（任意）
    marginLeft: 'auto',
    marginRight: 'auto',
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
  const [mode, setMode] = useState(null); // 'single', 'hard', 'multi'

  const result = calculateWinner(squares);
  const winner = typeof result === 'string' ? result : result?.winner;

  const highlightSquares = Array(9).fill(false);
  if (result && result.line) {
    for (const i of result.line) highlightSquares[i] = true;
  }

  const handleResetGameState = () => {
    setSquares(Array(9).fill(null));
    setIsXTurn(true);
  };

  const startGame = (selectedMode) => {
    handleResetGameState();
    setMode(selectedMode);
    setView('game');
  };

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

    if ((mode === 'single' || mode === 'hard') && isXTurn === true) {
      setTimeout(() => {
        let cpuMove;
        if (mode === 'single') {
          cpuMove = findBestMoveSimple(nextSquares, 'O', 'X');
        } else if (mode === 'hard') {
          cpuMove = findBestMoveMinimax(nextSquares, 'O', 'X');
        }
        if (cpuMove !== undefined) {
          const newSquares = nextSquares.slice();
          newSquares[cpuMove] = 'O';
          setSquares(newSquares);
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
          1人で遊ぶ<br />（普通CPU）
        </button>
        <button style={styles.titleButton} onClick={() => startGame('hard')}>
          1人で遊ぶ<br />（強いCPU）
        </button>
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

// 普通CPUロジック（勝てる手、防げる手、ランダム）
function findBestMoveSimple(squares, myMark, opponentMark) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const line = [squares[a], squares[b], squares[c]];
    if (line.filter(m => m === myMark).length === 2 && line.includes(null)) {
      return [a, b, c].find(i => squares[i] === null);
    }
  }

  for (const [a, b, c] of lines) {
    const line = [squares[a], squares[b], squares[c]];
    if (line.filter(m => m === opponentMark).length === 2 && line.includes(null)) {
      return [a, b, c].find(i => squares[i] === null);
    }
  }

  const emptyIndices = squares.map((v, i) => (v === null ? i : null)).filter(i => i !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

// 強いCPUロジック（Minimax）
function findBestMoveMinimax(squares, myMark, opponentMark) {
  function evaluate(board) {
    const result = calculateWinner(board);
    if (result && result.winner === myMark) return 10;
    if (result && result.winner === opponentMark) return -10;
    if (result === 'draw') return 0;
    return null;
  }

  function minimax(board, isMaximizing) {
    const score = evaluate(board);
    if (score !== null) return score;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = myMark;
          const score = minimax(board, false);
          board[i] = null;
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = opponentMark;
          const score = minimax(board, true);
          board[i] = null;
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  }

  let bestMove = null;
  let bestScore = -Infinity;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = myMark;
      const score = minimax(squares, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
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
