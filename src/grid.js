import React, { useState } from 'react';

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '50px',
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
    },
    boardRow: {
        display: 'flex',
        justifyContent: 'center',
    },
    square: {
        width: '60px',
        height: '60px',
        fontSize: '32px',
        fontFamily: 'monospace',
        margin: '5px',
        textAlign: 'center',
        lineHeight: '60px',
    },
    resetButton: {
        marginTop: '20px',
        padding: '8px 16px',
        fontSize: '16px',
    },
};

function calculateWinner(board) {
    const lines = [
        // 横
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // 縦
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // 斜め
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ];
    for (const [[r1, c1], [r2, c2], [r3, c3]] of lines) {
        const v1 = board[r1][c1];
        const v2 = board[r2][c2];
        const v3 = board[r3][c3];
        if (v1 && v1 === v2 && v2 === v3) {
            return v1;
        }
    }
    return null;
}

function Square({ value, onClick }) {
    return (
        <button onClick={onClick} style={styles.square}>
            {value}
        </button>
    );
}

function App() {
    const [board, setBoard] = useState(
        Array.from({ length: 3 }, () => Array(3).fill(null))
    );
    const [isXTurn, setIsXTurn] = useState(true);

    const winner = calculateWinner(board);

    const handleClick = (row, col) => {
        if (board[row][col] || winner) return;
        const nextBoard = board.map((r, i) =>
            r.map((cell, j) => (i === row && j === col ? (isXTurn ? 'X' : 'O') : cell))
        );
        setBoard(nextBoard);
        setIsXTurn(!isXTurn);
    };

    const handleReset = () => {
        setBoard(Array.from({ length: 3 }, () => Array(3).fill(null)));
        setIsXTurn(true);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>〇×ゲーム（二次元配列版）</h1>
            <p>{winner ? `勝者: ${winner}` : `次の手番: ${isXTurn ? 'X' : 'O'}`}</p>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={styles.boardRow}>
                    {row.map((cell, colIndex) => (
                        <Square
                            key={`${rowIndex}-${colIndex}`}
                            value={cell}
                            onClick={() => handleClick(rowIndex, colIndex)}
                        />
                    ))}
                </div>
            ))}
            <button onClick={handleReset} style={styles.resetButton}>リセット</button>
        </div>
    );
}

export default App;
