# Damian Dzik - snake-game

---

### Stack

- Nextjs
- GraphQL
- Vercel

---

### Info

The projects uses **Nextjs** as the frontend framework. I decided to stick with **Nextjs** as this is the main tool I use on a daily basis. I also implemented **GraphQL** to fetch the GitHub contribution data for a specific year. This is the easiest way I found to do this, scraping the website would not work as the contribution data on the profile page is dynamic and even using the **puppeteer** library would not work (tried it myself after completing the test)

---

### Project Overview

The code test fetches the contribution data from **GitHub** using **GraphQL**. A token had to be generated in order to access **GitHub**. In order to run the web app on your own machine you would need the token and add it into the **next.config.mjs** file under the name **NEXT_PUBLIC_GITHUB_API_TOKEN**

here is an example of the **next.config** file

```jsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GITHUB_API_TOKEN: "the github token here :P",
  },
};

export default nextConfig;
```

I did not exactly follow the intructions in the email from Sinead on how the code test should function (using the handle in the url). This is because I was kind of short on time, so I decided to add two fields on the page, one for the **username** and one for the **year** of which we want to fetch the data for. Moving the app to a dynamic route implementation would be quite simple, we would just have to use the ` useParams()` function to get the **github handle** from the url. that would look something like this:

```jsx
import { useParams } from "next/navigation";
const ContributionPage = () => {
  const { _githubHandle } = useParams();
  return <>rendering content here :P</>;
};
```

and then we would have to assign the **gihub handle** to our **GraphQL** query.

##### Snake Movement

For the snake movement I was not able to get it to animate the way as on the demo provided. I think in order to achieve that we would have to use the **A\*** algorithm... which would still be quite difficult to implement, especially since we are using a web app (would be easier in a game for sure, have done that before :P) If this was just a pure **JavaScript** project then it would probably be easier :P

The **GitHub** contribution calendar assigns levels to the dates that contain contributions, so I decided to stick with that and assign levels to the different colors, lightest green being **level 1** and darkest being **level 4** just like on the **GitHub** profile pages contribution calendar.

To move the snake, I decided to get the screen position of the first target (**level 1** square with the least contributions made) and then try to animate the snake to that position. It sort of works but the position of the snake is a little bit off on the x axis. I did not have time to implement collision with the squares, to make it look as if the snake was eating the contributions, but that should not be too difficult. I assume we would just have to compare the snakes screen position wiht the targets and if they are exactly the same then we would change the color of the square to the gray color and then find a new target for the snake.

---

#### AI Tools

For the AI tool of choice I decided to use **ChatGPT** as this is the everyday AI tool that I use on my personal work and other aspects of my life. I ahve also used the **Opera** browsers AI (Aria? I think) for comparison but I ended up sticking with **ChatGPT**.

---

### Production

The project is available @ snake-game.damiandzik.com

The Project is hosted on **Vercel** and was added as a subdomain on my main domain **damiandzik.com**

Last time I checked the SSL cert was still being generated. Hopefully by the time you review my code test, the SSL cert is generated and verified :P

---

# PS

I think I will implement a GitHub calendar on my portfolio page since it looks quite cool :P Firstly I'll need to re-design my portfolio page since I am kinda bored of the white and yellow color scheme.... maybe I'll go with green and black? :O
