"use client";
import { useState, useEffect } from "react";

const SnakeGame = ({ gridData }) => {
  const [snakePosition, setSnakePosition] = useState([0, 1, 2, 3]); // Snake's position (first 4 tiles)
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current tile

  // Function to update the snake's position
  const moveSnake = () => {
    if (currentIndex >= gridData.length) {
      setIsGameOver(true); // End the game when all commits are eaten
      return;
    }

    setSnakePosition((prev) => {
      // Shift the snake's body and add the new head
      return [...prev.slice(1), currentIndex];
    });

    setCurrentIndex((prev) => prev + 1); // Move to the next commit
  };

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 500); // Move snake every 500ms

    return () => clearInterval(interval);
  }, [currentIndex, isGameOver]);

  return (
    <div>
      <h2>{isGameOver ? "Game Over" : "Snake Eating Commits"}</h2>
      <div className="grid">
        {gridData.map((tile, index) => {
          const isSnakeTile = snakePosition.includes(index);
          return (
            <div
              key={index}
              className={`tile ${isSnakeTile ? "snake" : ""}`}
              style={{
                backgroundColor: tile.color,
                width: "20px",
                height: "20px",
                borderRadius: "2px",
              }}
            >
              {/* Snake tile is marked differently */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SnakeGame;
