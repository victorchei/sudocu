let currentGrid = [];
let solutionGrid = [];
let currentLevel = 'easy';

const levelDifficulty = {
  easy: 40,
  medium: 50,
  hard: 60,
};

// Ініціалізація обробників подій
document.querySelectorAll('.level-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentLevel = btn.dataset.level;
    startGame();
  });
});

document.getElementById('newGame').addEventListener('click', startGame);
document.getElementById('checkSolution').addEventListener('click', checkSolution);
document.getElementById('solve').addEventListener('click', solvePuzzle);

function startGame() {
  document.querySelector('.level-selector').style.display = 'none';
  document.querySelector('.game-container').style.display = 'block';
  generateSudoku();
  renderGrid();
  document.getElementById('message').textContent = '';
}

function generateSudoku() {
  solutionGrid = createSolvedGrid();
  currentGrid = JSON.parse(JSON.stringify(solutionGrid));
  removeNumbers(levelDifficulty[currentLevel]);
}

function createSolvedGrid() {
  const grid = Array(9)
    .fill()
    .map(() => Array(9).fill(0));
  fillGrid(grid);
  return grid;
}

function fillGrid(grid) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        shuffle(numbers);
        for (let num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(grid, row, col, num) {
  // Перевірка рядка та стовпця
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) {
      return false;
    }
  }

  // Перевірка 3x3 блоку
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
}

function removeNumbers(count) {
  let removed = 0;
  while (removed < count) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (currentGrid[row][col] !== 0) {
      currentGrid[row][col] = 0;
      removed++;
    }
  }
}

function renderGrid() {
  const gridContainer = document.getElementById('sudokuGrid');
  gridContainer.innerHTML = '';

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('input');
      cell.type = 'text';
      cell.maxLength = 1;
      cell.className = 'sudoku-cell';
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (currentGrid[row][col] !== 0) {
        cell.value = currentGrid[row][col];
        cell.classList.add('given');
        cell.readOnly = true;
      }

      cell.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value && !/^[1-9]$/.test(value)) {
          e.target.value = '';
        }
        e.target.classList.remove('error');
      });

      cell.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          moveFocus(e);
        }
      });

      gridContainer.appendChild(cell);
    }
  }
}

function moveFocus(e) {
  e.preventDefault();
  const currentCell = e.target;
  let row = parseInt(currentCell.dataset.row);
  let col = parseInt(currentCell.dataset.col);

  switch (e.key) {
    case 'ArrowUp':
      row = Math.max(0, row - 1);
      break;
    case 'ArrowDown':
      row = Math.min(8, row + 1);
      break;
    case 'ArrowLeft':
      col = Math.max(0, col - 1);
      break;
    case 'ArrowRight':
      col = Math.min(8, col + 1);
      break;
  }

  const cells = document.querySelectorAll('.sudoku-cell');
  const targetCell = Array.from(cells).find(
    (cell) => parseInt(cell.dataset.row) === row && parseInt(cell.dataset.col) === col
  );

  if (targetCell) {
    targetCell.focus();
  }
}

function checkSolution() {
  const cells = document.querySelectorAll('.sudoku-cell');
  let isCorrect = true;
  let isEmpty = false;

  cells.forEach((cell) => {
    cell.classList.remove('error');
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const value = parseInt(cell.value);

    if (!value) {
      isEmpty = true;
      return;
    }

    if (value !== solutionGrid[row][col]) {
      cell.classList.add('error');
      isCorrect = false;
    }
  });

  const message = document.getElementById('message');
  if (isEmpty) {
    message.textContent = 'Заповніть всі клітинки!';
    message.className = 'message error';
  } else if (isCorrect) {
    message.textContent = "🎉 Вітаємо! Ви розв'язали судоку!";
    message.className = 'message success';
  } else {
    message.textContent = 'Є помилки. Спробуйте ще раз!';
    message.className = 'message error';
  }
}

function solvePuzzle() {
  const cells = document.querySelectorAll('.sudoku-cell');
  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    cell.value = solutionGrid[row][col];
    cell.classList.remove('error');
  });

  const message = document.getElementById('message');
  message.textContent = "Судоку розв'язано!";
  message.className = 'message success';
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
