// pages/api/testGitHub.js
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_API_TOKEN}`,
  },
  cache: new InMemoryCache(),
});

export default async function handler(req, res) {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          viewer {
            login
          }
        }
      `,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching from GitHub:", error);
    res.status(500).json({ error: "Error fetching from GitHub" });
  }
}
