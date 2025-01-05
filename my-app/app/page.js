"use client";

import { useQuery, gql } from "@apollo/client";

const GET_CONTRIBUTIONS = gql`
  query {
    user(login: "ddzik19") {
      contributionsCollection(
        from: "2024-01-01T00:00:00Z"
        to: "2024-12-31T23:59:59Z"
      ) {
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
  // Create the grid layout from data
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
  const { loading, error, data } = useQuery(GET_CONTRIBUTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const gridData = createGrid(data);

  return (
    <div>
      <h1>GitHub Snake Game - Contribution Heatmap</h1>
      <div className="grid">
        {gridData.map((tile, index) => (
          <div
            key={index}
            className="tile"
            style={{
              backgroundColor: tile.color,
              width: "20px",
              height: "20px",
            }}
          >
            {/* Tile representing the contribution day */}
          </div>
        ))}
      </div>
    </div>
  );
}
