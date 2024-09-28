const express = require("express");
const path = require("path");
const Parser = require("rss-parser");

const app = express();
const port = process.env.PORT || 3000;
const parser = new Parser();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route for the root path
app.get("/main.css", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.css"));
});

app.get("/scalability/systems/2020/02/03/scaling-100k.html", (req, res) => {
  res.redirect("https://blog.alexpareto.com/p/scaling-100k");
});

app.get("/2020/06/15/thundering-herds.html", (req, res) => {
  res.redirect("https://blog.alexpareto.com/p/thundering-herds");
});

app.get("/2020/09/13/choosing-tech-stack.html", (req, res) => {
  res.redirect("https://blog.alexpareto.com/p/choosing-tech-stack");
});

app.get("/feed.xml", (req, res) => {
  res.redirect("https://blog.alexpareto.com/feed.xml");
});

app.get("/api/feed", async (req, res) => {
  try {
    const feedUrl = "https://blog.alexpareto.com/feed.xml";
    const response = await fetch(feedUrl);
    const feedData = await response.text();
    const feed = await parser.parseString(feedData);

    const simplifiedFeed = {
      title: feed.title,
      description: feed.description,
      items: feed.items
        .map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          content: item.content,
        }))
        .slice(0, 10),
    };

    res.json(simplifiedFeed);
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    res.status(500).json({ error: "Failed to fetch RSS feed" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
