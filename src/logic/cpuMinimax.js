// 強いCPUロジック（Minimax）
import { calculateWinner } from './calculateWinner';

export function findBestMoveMinimax(squares, myMark, opponentMark) {
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
