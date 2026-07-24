
# 🧩 Sudoku Solver

A simple and efficient Sudoku Solver built to solve standard **9×9 Sudoku puzzles** using the **Backtracking Algorithm**. The application takes an incomplete Sudoku board as input and fills in the missing values while ensuring all Sudoku rules are satisfied.

---

## 📌 Features

- ✅ Solves any valid 9×9 Sudoku puzzle
- ✅ Uses Backtracking algorithm
- ✅ Fast and efficient solution
- ✅ Clean and modular code
- ✅ Easy to understand and modify

---

## 🛠️ Tech Stack

- **Language:** Python
- **Algorithm:** Backtracking

---

## 📂 Project Structure

```
sudoku_solver/
│── solver.py
│── main.py
│── README.md
```

> *(Update the file names if your repository structure is different.)*

---

## 🚀 How It Works

The solver follows these steps:

1. Find an empty cell.
2. Try numbers from **1 to 9**.
3. Check whether placing the number is valid:
   - Number is not present in the current row.
   - Number is not present in the current column.
   - Number is not present in the current 3×3 grid.
4. If valid, place the number and continue recursively.
5. If no number works, backtrack and try another possibility.
6. Continue until the puzzle is solved.

---

## ▶️ Installation

Clone the repository

```bash
git clone https://github.com/Ritikbrijwasi/sudoku_solver.git
```

Go to the project folder

```bash
cd sudoku_solver
```

Run the program

```bash
python main.py
```

---

## 📖 Example

### Input

```
5 3 0 | 0 7 0 | 0 0 0
6 0 0 | 1 9 5 | 0 0 0
0 9 8 | 0 0 0 | 0 6 0
------+-------+------
8 0 0 | 0 6 0 | 0 0 3
4 0 0 | 8 0 3 | 0 0 1
7 0 0 | 0 2 0 | 0 0 6
------+-------+------
0 6 0 | 0 0 0 | 2 8 0
0 0 0 | 4 1 9 | 0 0 5
0 0 0 | 0 8 0 | 0 7 9
```

### Output

```
5 3 4 | 6 7 8 | 9 1 2
6 7 2 | 1 9 5 | 3 4 8
1 9 8 | 3 4 2 | 5 6 7
------+-------+------
8 5 9 | 7 6 1 | 4 2 3
4 2 6 | 8 5 3 | 7 9 1
7 1 3 | 9 2 4 | 8 5 6
------+-------+------
9 6 1 | 5 3 7 | 2 8 4
2 8 7 | 4 1 9 | 6 3 5
3 4 5 | 2 8 6 | 1 7 9
```

---

## ⏱️ Time Complexity

- **Worst Case:** Exponential (Backtracking)
- **Space Complexity:** O(81)

---

## 📈 Future Improvements

- GUI using Tkinter or PyQt
- Upload Sudoku from an image (OCR)
- Sudoku puzzle generator
- Difficulty level detection
- Web-based interface using Flask or React

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---



GitHub: https://github.com/Ritikbrijwasi
