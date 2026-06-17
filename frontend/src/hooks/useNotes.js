import { useState, useEffect, useRef } from 'react';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const typingTimeoutRef = useRef(null);

  // Initial Fetch
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("gridlock_token");
      try {
        const response = await fetch("https://relay-blond-nine.vercel.app/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setNotes(data);
      } catch (err) {
        console.error("Failed to load notes");
      }
    };
    fetchNotes();
  }, []);

  // Auto-Save
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    setSaveStatus("Saving...");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(async () => {
      const token = localStorage.getItem("gridlock_token");
      try {
        if (currentNoteId) {
          const response = await fetch(`https://relay-blond-nine.vercel.app/api/notes/${currentNoteId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ content: newText }),
          });
          const updatedNote = await response.json();
          if (response.ok) {
            setSaveStatus("All changes saved");
            setNotes((prev) => prev.map((n) => (n._id === currentNoteId ? updatedNote : n)));
          } else {
            setSaveStatus("Failed to save");
          }
        } else {
          if (newText.trim() === "") return;
          const response = await fetch("https://relay-blond-nine.vercel.app/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ content: newText }),
          });
          const newNote = await response.json();
          if (response.ok) {
            setCurrentNoteId(newNote._id);
            setSaveStatus("All changes saved");
            setNotes((prev) => [newNote, ...prev]);
          } else {
            setSaveStatus("Failed to save");
          }
        }
      } catch (err) {
        setSaveStatus("Offline - Changes not saved");
      }
    }, 1000);
  };

  const handleSelectNote = (note) => {
    setCurrentNoteId(note._id);
    setContent(note.content);
    setSaveStatus("");
  };

  const handleCreateNew = () => {
    setCurrentNoteId(null);
    setContent("");
    setSaveStatus("");
  };

  return {
    notes,
    currentNoteId,
    content,
    saveStatus,
    handleTextChange,
    handleSelectNote,
    handleCreateNew
  };
};