// pages/index.js
"use client";

import { useQuery, gql } from "@apollo/client";
import { useState } from "react";

const getCurrentYearDateRange = () => {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01T00:00:00Z`;
  const endDate = `${currentYear}-12-31T23:59:59Z`;
  return { startDate, endDate };
};

const { startDate, endDate } = getCurrentYearDateRange();

const GET_CONTRIBUTIONS = gql`
  query GetContributions($from: DateTime!, $to: DateTime!) {
    user(login: "ddzik19") {
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
        });
      });
    }
  );
  return grid;
};

export default function Home() {
  const { loading, error, data } = useQuery(GET_CONTRIBUTIONS, {
    variables: {
      from: startDate,
      to: endDate,
    },
  });

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const gridData = createGrid(data);

  const handleMouseEnter = (event, content) => {
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + window.scrollX + 15,
      y: rect.top + window.scrollY - 30,
      content,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: "" });
  };

  return (
    <div>
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
          gridTemplateRows: "repeat(7, 12px)", // 7 rows for the days of the week
          gridAutoFlow: "column", // Flow items into columns
          gap: "2px",
          position: "relative",
        }}
      >
        {gridData.map((tile, index) => (
          <div
            key={index}
            className="grid-item"
            style={{
              backgroundColor: tile.color || "#ebedf0", // Default GitHub-style color
              width: "12px",
              height: "12px",
            }}
            onMouseEnter={(event) =>
              handleMouseEnter(
                event,
                `Date: ${tile.date}, Commits: ${tile.contributionCount}`
              )
            }
            onMouseLeave={handleMouseLeave}
          ></div>
        ))}
      </div>
    </div>
  );
}
