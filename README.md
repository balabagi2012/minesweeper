# Minesweeper Game

This is a Minesweeper game built with React, TypeScript, and Vite.

## Project Setup

This project uses Vite as a build tool. To get started, you need to have Node.js installed on your machine. After that, you can clone this repository and install the dependencies.

```bash
git clone https://github.com/balabagi2012/minesweeper.git
cd minesweeper
npm install
```

## Running the Game
To start the game, run the following command in your terminal:
```
npm run dev
```

This will start the development server. You can then open your browser and go to http://localhost:5137 to play the game.

## Game Rules

The rules of the game are the same as the classic Minesweeper game:

- The game board is a grid of cells, some of which contain mines.
- The goal of the game is to reveal all cells that do not contain a mine.
- When you reveal a cell, if it contains a mine, you lose the game.
- If the cell does not contain a mine, it will display the number of neighboring cells that contain mines.
- You can flag a cell to indicate that you think it contains a mine.

## Project Structure
The main game logic is in the App.tsx file. This file contains the React component that renders the game board and handles user interactions.

## Demo
The demo site has deployed to Vercel, and you can visit at https://minesweeper-chi-woad.vercel.app/.