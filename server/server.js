const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Our "database" for this assignment - just an array in memory
let notes = [];
let nextId = 1;

// TODO 1: GET /api/notes - send back the notes array
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// TODO 2: POST /api/notes - build a note from req.body, add it to the array, send it back
app.post("/api/notes", (req, res) => {
  const { title, content } = req.body;
  
  // Validate input
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  
  const newNote = {
    id: nextId++,
    title: title,
    content: content,
    createdAt: new Date()
  };
  
  notes.push(newNote);
  res.status(201).json(newNote);
});

// BONUS: DELETE /api/notes/:id - delete a note by id
app.delete("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  
  notes.splice(noteIndex, 1);
  res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));