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
  // 画面の状態。'title' = タイトル画面, 'game' = ゲーム画面
  const [view, setView] = useState('title');

  // 各マスの状態（X, O, または null）を保持する配列。初期状態はすべて null。
  const [squares, setSquares] = useState(Array(9).fill(null));

  // 現在の手番が X か O かを管理するブール値。true = X の番。
  const [isXTurn, setIsXTurn] = useState(true);

  // 勝者や引き分け、または勝利ラインを含む判定結果を取得
  const result = calculateWinner(squares);

  // result がオブジェクトなら winner を抽出し、文字列 'draw' の場合はそのまま代入
  const winner = typeof result === 'string' ? result : result?.winner;

  // ハイライト対象マスを管理する一時配列（表示専用なので useState ではない）
  const highlightSquares = Array(9).fill(false);
  if (result && result.line) {
    for (const i of result.line) highlightSquares[i] = true;
  }

  // マスがクリックされたときの処理。条件を満たすと状態更新。
  const handleClick = (index) => {
    // すでにマスが埋まっているか、勝者が決定している場合は何もしない
    if (squares[index] || winner) return;

    // 新しい盤面配列を作成し、該当マスに現在の手番を反映
    const nextSquares = squares.slice();
    nextSquares[index] = isXTurn ? 'X' : 'O';
    setSquares(nextSquares);

    // 次の手番に切り替え
    setIsXTurn(!isXTurn);
  };

  // リセット処理。盤面を初期化し、手番も X に戻す。
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setIsXTurn(true);
  };

  // タイトル画面の表示処理（view が 'title' のときのみ）
  if (view === 'title') {
    return (
      <div style={styles.container}>
        <h1>ようこそ 〇×ゲームへ</h1>
        <p>React の状態遷移を体験しよう！</p>
        {/* 「ゲーム開始」ボタンを押すと view を 'game' に変更してゲーム画面へ遷移 */}
        <button style={styles.titleButton} onClick={() => setView('game')}>
          ゲーム開始
        </button>
      </div>
    );
  }

  // ゲーム画面（view === 'game'）の表示処理
  return (
    <div style={styles.container}>
      <h1>〇×ゲーム（Tic Tac Toe）</h1>
      <p>
        {/* 状況に応じて「次の手番」「勝者」「引き分け」を表示 */}
        {winner === 'draw'
          ? '引き分けです'
          : winner
          ? `勝者: ${winner}`
          : `次の手番: ${isXTurn ? 'X' : 'O'}`}
      </p>
      <div>
        {/* 盤面を 3 行分描画。各行に 3 つの Square を表示 */}
        {[0, 1, 2].map((row) => (
          <div key={row} style={styles.boardRow}>
            <Square value={squares[row * 3]} onClick={() => handleClick(row * 3)} highlight={highlightSquares[row * 3]} />
            <Square value={squares[row * 3 + 1]} onClick={() => handleClick(row * 3 + 1)} highlight={highlightSquares[row * 3 + 1]} />
            <Square value={squares[row * 3 + 2]} onClick={() => handleClick(row * 3 + 2)} highlight={highlightSquares[row * 3 + 2]} />
          </div>
        ))}
      </div>
      {/* 盤面リセットボタン */}
      <button onClick={handleReset} style={styles.resetButton}>リセット</button>

      {/* 勝敗が決まった後にタイトル画面へ戻れるよう、ボタンを条件付きで表示 */}
      {(winner || result === 'draw') && (
        <button onClick={() => setView('title')} style={styles.returnButton}>
          タイトルに戻る
        </button>
      )}
    </div>
  );
}

// 盤面から勝者を判定する関数。3つのマスが同じ文字で埋まっていれば勝利。
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
      return { winner: squares[a], line: [a, b, c] }; // 勝者の記号と揃ったマスの配列を返す
    }
  }
  if (squares.every(Boolean)) {
    return 'draw'; // 全てのマスが埋まっていたら引き分け
  }
  return null; // まだ勝敗がついていない場合
}

export default App;
