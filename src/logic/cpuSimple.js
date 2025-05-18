// 普通CPUロジック（勝てる手、防げる手、ランダム）
export function findBestMoveSimple(squares, myMark, opponentMark) {
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

