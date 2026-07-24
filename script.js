// ============================================================
//  SUDOKU SOLVER — Full JS Implementation
// ============================================================

// --- DOM References ---
const boardEl = document.getElementById('board');
const statusBar = document.getElementById('statusBar');
const statusMsg = document.getElementById('statusMessage');
const statusDot = document.getElementById('statusDot');
const solveBtn = document.getElementById('solveBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const validateBtn = document.getElementById('validateBtn');
const solveTimeEl = document.getElementById('solveTime');
const filledCountEl = document.getElementById('filledCount');
const confettiCanvas = document.getElementById('confettiCanvas');

const N = 9;
let cells = [];
let isSolving = false;

// ============================================================
//  1. BOARD CREATION
// ============================================================

function createBoard() {
    boardEl.innerHTML = '';
    cells = [];

    for (let i = 0; i < N * N; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'cell';
        input.min = 0;
        input.max = 9;
        input.maxLength = 1;
        input.dataset.index = i;

        // Placeholder styling
        input.placeholder = '0';

        input.addEventListener('input', onCellInput);
        input.addEventListener('keydown', onCellKeydown);
        input.addEventListener('focus', onCellFocus);
        input.addEventListener('blur', onCellBlur);
        input.addEventListener('click', onCellClick);

        boardEl.appendChild(input);
        cells.push(input);
    }

    updateFilledCount();
}

// ============================================================
//  2. SUDOKU SOLVER ALGORITHM (translated from C++)
// ============================================================

function getBoard() {
    const board = [];
    for (let i = 0; i < N; i++) {
        board[i] = [];
        for (let j = 0; j < N; j++) {
            const val = parseInt(cells[i * N + j].value) || 0;
            board[i][j] = val;
        }
    }
    return board;
}

function isSafe(board, row, col, num) {
    // Check row
    for (let x = 0; x < N; x++) {
        if (board[row][x] === num) return false;
    }
    // Check column
    for (let x = 0; x < N; x++) {
        if (board[x][col] === num) return false;
    }
    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
}

function solveSudoku(board) {
    let row = -1;
    let col = -1;
    let empty = false;

    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            if (board[r][c] === 0) {
                row = r;
                col = c;
                empty = true;
                break;
            }
        }
        if (empty) break;
    }

    if (!empty) return true;

    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) return true;

            board[row][col] = 0;
        }
    }
    return false;
}

// ============================================================
//  3. SOLVE ACTION
// ============================================================

async function solve() {
    if (isSolving) return;

    // Clear any previous state
    removeCellHighlights();
    setStatus('Solving...', 'neutral');
    solveBtn.disabled = true;
    isSolving = true;

    const board = getBoard();
    const startTime = performance.now();

    // Use setTimeout to allow UI to update before heavy computation
    await sleep(50);

    const solved = solveSudoku(board);
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

    solveTimeEl.textContent = `${elapsed}s`;

    if (solved) {
        // Animate filling in the solved values
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const idx = i * N + j;
                const cell = cells[idx];
                const original = parseInt(cell.value) || 0;

                if (original === 0) {
                    cell.value = board[i][j];
                    cell.classList.remove('user', 'error');
                    cell.classList.add('solved');
                } else {
                    cell.classList.remove('error');
                    cell.classList.add('fixed');
                }
                // Small stagger for visual effect
                await sleep(8);
            }
        }

        setStatus('Solved successfully! 🎉', 'success');
        triggerConfetti();
        updateFilledCount();
    } else {
        setStatus('No solution exists for this puzzle.', 'error');
    }

    solveBtn.disabled = false;
    isSolving = false;
}

// ============================================================
//  4. VALIDATE
// ============================================================

function validate() {
    removeCellHighlights();

    const board = getBoard();

    // Check for invalid entries (duplicates)
    let hasError = false;

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const val = board[i][j];
            if (val === 0) continue;

            // Temporarily set to 0 to check if placement is valid
            board[i][j] = 0;
            if (!isSafe(board, i, j, val)) {
                cells[i * N + j].classList.add('error');
                hasError = true;
            }
            board[i][j] = val;
        }
    }

    if (hasError) {
        setStatus('Conflicts found! Cells with errors are highlighted in pink.', 'error');
    } else {
        setStatus('No conflicts! The puzzle looks valid ✅', 'success');
    }

    updateFilledCount();
}

// ============================================================
//  5. CLEAR
// ============================================================

function clearBoard() {
    if (isSolving) return;

    cells.forEach((cell) => {
        cell.value = '';
        cell.classList.remove('fixed', 'user', 'solved', 'error', 'highlighted', 'same-number');
    });

    solveTimeEl.textContent = '—';
    setStatus('Board cleared. Enter numbers (1-9) or leave empty.', 'neutral');
    updateFilledCount();
    cells[0]?.focus();
}

// ============================================================
//  6. SAMPLE PUZZLES
// ============================================================

const SAMPLES = [
    // Easy
    [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    // Medium
    [
        [0, 0, 0, 2, 6, 0, 7, 0, 1],
        [6, 8, 0, 0, 7, 0, 0, 9, 0],
        [1, 9, 0, 0, 0, 4, 5, 0, 0],
        [8, 2, 0, 1, 0, 0, 0, 4, 0],
        [0, 0, 4, 6, 0, 2, 9, 0, 0],
        [0, 5, 0, 0, 0, 3, 0, 2, 8],
        [0, 0, 9, 3, 0, 0, 0, 7, 4],
        [0, 4, 0, 0, 5, 0, 0, 3, 6],
        [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    // Hard
    [
        [0, 0, 0, 0, 0, 0, 2, 0, 0],
        [0, 8, 0, 0, 0, 7, 0, 9, 0],
        [6, 0, 2, 0, 0, 0, 5, 0, 0],
        [0, 7, 0, 0, 6, 0, 0, 0, 0],
        [0, 0, 0, 9, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 2, 0, 0, 4, 0],
        [0, 0, 5, 0, 0, 0, 6, 0, 3],
        [0, 9, 0, 4, 0, 0, 0, 7, 0],
        [0, 0, 6, 0, 0, 0, 0, 0, 0],
    ],
];

let sampleIndex = 0;

function loadSample() {
    if (isSolving) return;

    // Cycle through samples
    const puzzle = SAMPLES[sampleIndex % SAMPLES.length];
    sampleIndex++;

    clearBoard();

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const idx = i * N + j;
            const val = puzzle[i][j];
            if (val !== 0) {
                cells[idx].value = val;
                cells[idx].classList.add('fixed');
            }
        }
    }

    const difficulty = ['Easy', 'Medium', 'Hard'][(sampleIndex - 1) % 3];
    setStatus(`Loaded ${difficulty} puzzle. Click Solve!`, 'neutral');
    updateFilledCount();
}

// ============================================================
//  7. CELL EVENT HANDLERS
// ============================================================

function onCellInput(e) {
    const cell = e.target;
    let val = cell.value.trim();

    // Allow only 1-9 or empty
    if (val === '') {
        cell.value = '';
        cell.classList.remove('user', 'error');
        updateFilledCount();
        return;
    }

    const num = parseInt(val);
    if (isNaN(num) || num < 1 || num > 9) {
        cell.value = '';
        cell.classList.remove('user', 'error');
        updateFilledCount();
        return;
    }

    // Don't modify fixed cells
    if (cell.classList.contains('fixed')) {
        cell.value = cell.dataset.originalValue || '';
        return;
    }

    cell.value = num;
    cell.classList.add('user');
    cell.classList.remove('error', 'solved');
    updateFilledCount();
}

function onCellKeydown(e) {
    const cell = e.target;
    const idx = parseInt(cell.dataset.index);
    let targetIdx = -1;

    if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        targetIdx = idx + 1;
        if (targetIdx >= N * N) targetIdx = 0;
    } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        targetIdx = idx - 1;
        if (targetIdx < 0) targetIdx = N * N - 1;
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        targetIdx = idx + N;
        if (targetIdx >= N * N) targetIdx = idx % N;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        targetIdx = idx - N;
        if (targetIdx < 0) targetIdx = (N - 1) * N + (idx % N);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        // Move to next cell
        targetIdx = idx + 1;
        if (targetIdx >= N * N) targetIdx = 0;
    } else if (e.key === 'Backspace' && !cell.value) {
        // Move to previous cell when backspace on empty
        e.preventDefault();
        targetIdx = idx - 1;
        if (targetIdx >= 0) {
            const prev = cells[targetIdx];
            prev.value = '';
            prev.classList.remove('user', 'error', 'solved');
            prev.focus();
            updateFilledCount();
        }
        return;
    }

    if (targetIdx >= 0 && targetIdx < N * N) {
        cells[targetIdx].focus();
    }
}

function onCellFocus(e) {
    const cell = e.target;
    const val = cell.value;
    cell.select();

    // Highlight same row, column, and box
    highlightRelated(cell);
}

function onCellBlur(e) {
    // Don't remove highlights immediately to allow click
    setTimeout(() => {
        removeCellHighlights();
    }, 150);
}

function onCellClick(e) {
    const cell = e.target;
    highlightRelated(cell);
}

// ============================================================
//  8. HIGHLIGHTING
// ============================================================

function highlightRelated(cell) {
    removeCellHighlights();

    const idx = parseInt(cell.dataset.index);
    const row = Math.floor(idx / N);
    const col = idx % N;
    const val = cell.value;

    // Highlight same row, column, and box cells
    for (let i = 0; i < N * N; i++) {
        const r = Math.floor(i / N);
        const c = i % N;
        const sameRow = r === row;
        const sameCol = c === col;
        const sameBox = Math.floor(r / 3) === Math.floor(row / 3) &&
            Math.floor(c / 3) === Math.floor(col / 3);

        if (sameRow || sameCol || sameBox) {
            cells[i].classList.add('highlighted');
        }

        // Also highlight same number across the board
        if (val && cells[i].value === val && i !== idx) {
            cells[i].classList.add('same-number');
        }
    }
}

function removeCellHighlights() {
    cells.forEach((c) => {
        c.classList.remove('highlighted', 'same-number');
    });
}

// ============================================================
//  9. UI HELPERS
// ============================================================

function setStatus(message, type) {
    statusMsg.textContent = message;
    statusBar.className = 'status-bar';
    if (type === 'success') {
        statusBar.classList.add('success');
    } else if (type === 'error') {
        statusBar.classList.add('error');
    }
}

function updateFilledCount() {
    let count = 0;
    cells.forEach((c) => {
        if (c.value && parseInt(c.value) > 0) count++;
    });
    filledCountEl.textContent = count;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
//  10. CONFETTI 🎉
// ============================================================

let confettiPieces = [];
let confettiAnimId = null;

function triggerConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#a29bfe', '#55efc4', '#ff7675', '#74b9ff'];
    confettiPieces = [];

    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            opacity: 1,
        });
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    animateConfetti(ctx);
}

function animateConfetti(ctx) {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    let alive = false;

    confettiPieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rot += p.rotSpeed;

        if (p.y > confettiCanvas.height + 20) {
            p.opacity -= 0.02;
        }

        if (p.opacity > 0) {
            alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rot * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }
    });

    if (alive) {
        confettiAnimId = requestAnimationFrame(() => animateConfetti(ctx));
    } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

// ============================================================
//  11. KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                solve();
                break;
            case 'l':
            case 'L':
                e.preventDefault();
                loadSample();
                break;
            case 'c':
            case 'C':
                e.preventDefault();
                clearBoard();
                break;
        }
    }
});

// ============================================================
//  12. INITIALIZE
// ============================================================

createBoard();
loadSample();

// Event listeners
solveBtn.addEventListener('click', solve);
clearBtn.addEventListener('click', clearBoard);
sampleBtn.addEventListener('click', loadSample);
validateBtn.addEventListener('click', validate);

// Resize confetti canvas on window resize
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

console.log('🚀 Sudoku Solver ready!');
console.log('📌 Shortcuts: Ctrl+Enter (Solve), Ctrl+L (Load), Ctrl+C (Clear)');

