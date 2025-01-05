"use client";

import { useQuery, gql } from "@apollo/client";
import { useState, useEffect, useRef } from "react";

// Function to return the date range for the selected year
const getDateRangeForYear = (year) => {
  const startDate = `${year}-01-01T00:00:00Z`;
  const endDate = `${year}-12-31T23:59:59Z`;
  return { startDate, endDate };
};

const GET_CONTRIBUTIONS = gql`
  query GetContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

const createGrid = (data) => {
  const grid = [];
  data?.user?.contributionsCollection?.contributionCalendar?.weeks?.forEach(
    (week) => {
      week.contributionDays.forEach((day) => {
        grid.push({
          date: day.date,
          contributionCount: day.contributionCount,
          color: day.color,
          x: parseInt(day.date.split("-")[1]), // Extract x-coordinate from the date (month)
          y: parseInt(day.date.split("-")[2]), // Extract y-coordinate from the date (day)
        });
      });
    }
  );
  return grid;
};

export default function Home() {
  const [username, setUsername] = useState(""); // State for storing the input username
  const [submittedUsername, setSubmittedUsername] = useState(""); // State to store the submitted username
  const [selectedYear, setSelectedYear] = useState("2024"); // State for the selected year

  const { startDate, endDate } = getDateRangeForYear(selectedYear); // Get date range based on selected year

  // Query to fetch contributions
  const { loading, error, data } = useQuery(GET_CONTRIBUTIONS, {
    variables: {
      login: submittedUsername, // Pass the submitted username dynamically
      from: startDate,
      to: endDate,
    },
    skip: !submittedUsername, // Skip the query if no username is submitted
  });

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  const handleSubmit = () => {
    setSubmittedUsername(username); // Update the submitted username to trigger the query
  };

  if (loading && !submittedUsername) return <p>Enter a username to search</p>;
  if (error) return <p>Error: {error.message}</p>;

  const gridData = createGrid(data);

  // Function to find the first level 1 target (tile with the least contributions)
  const findFirstTarget = (grid) => {
    let target = null;
    let minContributions = Infinity;

    for (const tile of grid) {
      if (
        tile.contributionCount > 0 &&
        tile.contributionCount < minContributions
      ) {
        minContributions = tile.contributionCount;
        target = tile;
      }
    }
    return target;
  };

  // Finding the target tile
  const targetTile = findFirstTarget(gridData);

  // Snake Setup
  const [snake, setSnake] = useState({
    position: { x: 15, y: 0 }, // Initialize snake at position (0, 0)
    direction: "right",
  });

  const snakeRef = useRef(snake.position); // Store the snake position in a ref to avoid unnecessary re-renders

  // Function to move the snake step by step
  const moveSnakeStepByStep = (targetPosition) => {
    const { x: targetX, y: targetY } = targetPosition;
    const { x: currentX, y: currentY } = snake.position;

    let newX = currentX;
    let newY = currentY;

    if (newX < targetX) {
      newX++;
    } else if (newX > targetX) {
      newX--;
    }

    if (newY < targetY) {
      newY++;
    } else if (newY > targetY) {
      newY--;
    }

    // Only update state if the snake is still not at the target
    if (newX !== currentX || newY !== currentY) {
      setSnake({ position: { x: newX, y: newY }, direction: snake.direction });
      snakeRef.current = { x: newX, y: newY }; // Update position in ref
    }
  };

  // Start the snake movement animation
  useEffect(() => {
    if (!targetTile) return; // Wait until target is found

    const interval = setInterval(() => {
      moveSnakeStepByStep({
        x: targetTile.x, // Target x-coordinate
        y: targetTile.y, // Target y-coordinate
      });
    }, 500); // Move the snake every 500ms (adjust speed as needed)

    return () => clearInterval(interval);
  }, [targetTile]); // Ensure this effect runs when targetTile changes

  const handleMouseEnter = (event, tile) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + window.scrollX + 15,
      y: rect.top + window.scrollY - 30,
      content: `${tile.date} - ${tile.contributionCount} contributions`,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: "" });
  };

  return (
    <div>
      {/* Input field for username */}
      <input
        type="text"
        placeholder="Enter GitHub Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)} // Update username state
        style={{
          marginBottom: "20px",
          padding: "8px",
          fontSize: "14px",
          width: "250px",
        }}
      />

      {/* Year selection dropdown */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)} // Update selected year state
        style={{
          padding: "8px",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
      </select>

      {/* Submit button to trigger the query */}
      <button
        onClick={handleSubmit}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Search
      </button>

      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            backgroundColor: "#333",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          {tooltip.content}
        </div>
      )}

      <div
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateRows: "repeat(7, 12px)",
          gridAutoFlow: "column",
          gap: "2px",
          position: "relative",
        }}
      >
        {/* Grid tiles */}
        {gridData.map((tile, index) => (
          <div
            key={index}
            className="grid-item"
            style={{
              backgroundColor: tile.color || "#ebedf0",
              width: "12px",
              height: "12px",
            }}
            onMouseEnter={(e) => handleMouseEnter(e, tile)}
            onMouseLeave={handleMouseLeave}
          />
        ))}

        {/* Snake position */}
        <div
          style={{
            position: "absolute",
            left: `${snake.position.x * 12}px`, // Use 12px to align with grid size
            top: `${snake.position.y * 12}px`, // Use 12px to align with grid size
            width: "12px",
            height: "12px",
            backgroundColor: "#800080",
          }}
        />
      </div>

      {/* Display the first level 1 target */}
      {targetTile && (
        <div>
          <p>
            First target tile: {targetTile.date} with{" "}
            {targetTile.contributionCount} contributions
          </p>
        </div>
      )}
    </div>
  );
}
