// app/page.js (or any other page in the `app` directory)
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
            }
          }
        }
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_CONTRIBUTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>GitHub Contributions</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
