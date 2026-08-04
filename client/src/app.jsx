import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(16);

  // TODO 3: on page load, fetch all notes from GET /api/notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNotes(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch notes: " + err.message);
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, []);

  // TODO 4: send a POST request with { title, content }, then update the list
  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and content");
      return;
    }
    
    try {
      setError(null);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: title.trim(), 
          content: content.trim() 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newNote = await response.json();
      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError("Failed to add note: " + err.message);
      console.error("Error adding note:", err);
    }
  };

  // BONUS: Delete a note
  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok && response.status !== 204) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError("Failed to delete note: " + err.message);
      console.error("Error deleting note:", err);
    }
  };

  // Handle Enter key to add note
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && title.trim() && content.trim()) {
      handleAddNote();
    }
  };

  // Font size controls
  const increaseFontSize = () => setFontSize(Math.min(fontSize + 2, 30));
  const decreaseFontSize = () => setFontSize(Math.max(fontSize - 2, 12));

  return (
    <div className="app-container" style={{ fontSize: `${fontSize}px` }}>
      <div className="header-section">
        <h1>📝 MicroNotes</h1>
        <div className="font-controls">
          <button onClick={decreaseFontSize} className="font-btn" title="Decrease font size">A-</button>
          <span className="font-size-display">{fontSize}px</span>
          <button onClick={increaseFontSize} className="font-btn" title="Increase font size">A+</button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="input-section">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Note title..."
          className="title-input"
          disabled={loading}
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Note content..."
          className="content-input"
          disabled={loading}
        />
        <button 
          onClick={handleAddNote} 
          disabled={loading || !title.trim() || !content.trim()}
        >
          Add Note
        </button>
      </div>

      <div className="notes-count">
        {notes.length} {notes.length === 1 ? "note" : "notes"}
      </div>

      <div className="notes-list-wrapper">
        {loading ? (
          <div className="loading-message">Loading notes...</div>
        ) : (
          <ul className="notes-list">
            {notes.length === 0 ? (
              <li className="empty-message">No notes yet. Add one above!</li>
            ) : (
              notes.map((note) => (
                <li key={note.id} className="note-item">
                  <div className="note-content">
                    <span className="note-title">{note.title}</span>
                    <span className="note-text">{note.content}</span>
                    <span className="note-date">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="delete-btn"
                    aria-label="Delete note"
                  >
                    ✕
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;