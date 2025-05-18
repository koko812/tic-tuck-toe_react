import React, { useState } from 'react';
import Square from './components/Square';
import styles from './App.module.css';
import { findBestMoveSimple } from './logic/cpuSimple';
import { findBestMoveMinimax } from './logic/cpuMinimax';
import { calculateWinner } from './logic/calculateWinner';

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
      <div className={styles.container}>
        <h1>ようこそ 〇×ゲームへ</h1>
        <p>モードを選んでください</p>
        <button
          className={styles.titleButton}
          onClick={() => startGame('single')}
          dangerouslySetInnerHTML={{ __html: '1人で遊ぶ<br />（普通CPU）' }}
        />
        <button
          className={styles.titleButton}
          onClick={() => startGame('hard')}
          dangerouslySetInnerHTML={{ __html: '1人で遊ぶ<br />（強いCPU）' }}
        />
        <button
          className={styles.titleButton}
          onClick={() => startGame('multi')}
        >
          2人で遊ぶ
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
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
          <div key={row} className={styles.boardRow}>
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
      <button className={styles.resetButton} onClick={handleResetGameState}>
        リセット
      </button>
      <button className={styles.returnButton} onClick={returnToTitle}>
        タイトルに戻る
      </button>
    </div>
  );
}

export default App;
