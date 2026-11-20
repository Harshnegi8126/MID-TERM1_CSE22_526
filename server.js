const express = require("express");
const app = express();
app.use(express.json());

const books = [];
let id = 1;
const find = (value) => books.find((book) => book.id === Number(value));
const valid = (body) =>
  body &&
  typeof body === "object" &&
  typeof body.title === "string" &&
  body.title.trim() &&
  typeof body.author === "string" &&
  body.author.trim() &&
  typeof body.year === "number" &&
  Number.isFinite(body.year);

app.post("/api/books", (request, response) => {
  if (!valid(request.body)) return response.status(400).json({ error: "Missing data" });
  const { title, author, year } = request.body;
  if (books.some((book) => book.title === title))
    return response.status(409).json({ error: "Same title already exists" });
  const book = { id: id++, title, author, year };
  books.push(book);
  response.status(201).json(book);
});

app.get("/api/books", (request, response) => {
  response.json(
    request.query.author
      ? books.filter((book) => book.author === request.query.author)
      : books
  );
});

app.get("/api/books/:id", (request, response) => {
  const book = find(request.params.id);
  book ? response.json(book) : response.status(404).json({ error: "Book not found" });
});

app.put("/api/books/:id", (request, response) => {
  const book = find(request.params.id);
  if (!book) return response.status(404).json({ error: "Book not found" });
  if (!valid(request.body)) return response.status(400).json({ error: "Missing data" });
  if (books.some((item) => item.id !== book.id && item.title === request.body.title))
    return response.status(409).json({ error: "Same title already exists" });
  book.title = request.body.title;
  book.author = request.body.author;
  book.year = request.body.year;
  response.json(book);
});

app.delete("/api/books/:id", (request, response) => {
  const index = books.findIndex((book) => book.id === Number(request.params.id));
  if (index === -1) return response.status(404).json({ error: "Book not found" });
  books.splice(index, 1);
  response.status(200).json({ message: "Book deleted" });
});

if (require.main === module) {
  app.listen(3000, () => console.log("Books API listening on port 3000"));
}

module.exports = app;
