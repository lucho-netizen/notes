import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  AppBar,
  Toolbar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "./App.css";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    //mode Dark
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios
      .get("http://localhost:5000/api/notes")
      .then((response) => setNotes(response.data))
      .catch((error) => console.log(error));
  };

  const addNote = () => {
    if (title === "" || content === "") {
      showSnackbar("Title and content are required");
      return;
    }
    axios
      .post("http://localhost:5000/api/notes", { title, content })
      .then((response) => {
        setNotes([...notes, response.data]);
        setTitle("");
        setContent("");
        showSnackbar("Note added successfully");
      })
      .catch((error) => console.log(error));
  };

  const openEditModalHandler = (note) => {
    setEditNoteId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setOpenEditModal(true);
  };

  const closeEditModalHandler = () => {
    setEditNoteId(null);
    setEditTitle("");
    setEditContent("");
    setOpenEditModal(false);
  };

  const updateNote = (id) => {
    axios
      .put(`http://localhost:5000/api/notes/${editNoteId}`, {
        title: editTitle,
        content: editContent,
      })
      .then((response) => {
        const updatedNotes = notes.map((note) => {
          if (note._id === id) {
            return {
              ...note,
              title: response.data.title,
              content: response.data.content,
            };
          }
          return note;
        });
        setNotes(updatedNotes);
        closeEditModalHandler(); // Cerrar el modal después de la actualización
        showSnackbar("Note updated successfully");
      })
      .catch((error) => console.log(error));
  };

  const deleteNote = (id) => {
    axios
      .delete(`http://localhost:5000/api/notes/${id}`)
      .then((response) => {
        setNotes(notes.filter((note) => note._id !== id));
        showSnackbar("Note deleted successfully");
      })
      .catch((error) => console.log(error));
  };
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 3000); // Ocultar el snackbar después de 3 segundos
  };

    
  return (
    <div
      className={`app-container ${darkMode ? "dark-mode" : ""}`}
      maxWidth="false"
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={darkMode ? "dark-mode-text" : ""}>
            {" "}
            Notes
          </Typography>
          <IconButton color="inherit" aria-label="mode" onClick={handleToggleDarkMode}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="false" className="main-container">
        <Box mt={4}>
          <Paper
            elevation={3}
            className={darkMode ? "dark-mode" : ""}
            style={{ padding: "16px" }}
          >
            <Typography
              variant="h5"
              gutterBottom
              className={darkMode ? "dark-mode-text" : ""}
            >
              Add a New Note
            </Typography>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputLabelProps={{
                className: darkMode ? "dark-mode-text" : "",
              }}
              InputProps={{
                className: darkMode ? "dark-mode-text" : "",
              }}
            />
            <TextField
              label="Content"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              InputLabelProps={{
                className: darkMode ? "dark-mode-text" : "",
              }}
              InputProps={{
                className: darkMode ? "dark-mode-text" : "",
              }}
            />
            
            {/* Button send */}
            <Box mt={2}> 
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addNote}
              >
                Add Note
              </Button>
            </Box>

          </Paper>
        </Box>
        <Box mt={4}>
          <Typography variant="h5" className={darkMode ? "dark-mode-text" : ""}>
            Notes
          </Typography>
          <List>
            {notes.map((note) => (
              <ListItem key={note._id} alignItems="flex-start" divider>
                <ListItemText
                  primary={note.title}
                  secondary={note.content}
                  primaryTypographyProps={{
                    className: darkMode ? "dark-mode-text" : "",
                  }}
                  secondaryTypographyProps={{
                    className: darkMode ? "dark-mode-text" : "",
                  }}
                />
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => openEditModalHandler(note)}
                >
                  <EditIcon className={darkMode ? 'dark-mode-text' : ''}  />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteNote(note._id)}
                >
                  <DeleteIcon className={darkMode ? 'dark-mode-text' : ''} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Modal de Edición */}
        <Dialog open={openEditModal} onClose={closeEditModalHandler}>
          <DialogTitle className={darkMode ? 'dark-mode-text' : ''} >Edit Note</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              InputLabelProps={{
                className: darkMode ? 'dark-mode-text' : ''
            }}
            InputProps={{
                className: darkMode ? 'dark-mode-text' : ''
            }}
            />
            <TextField
              label="Content"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              InputLabelProps={{
                className: darkMode ? 'dark-mode-text' : ''
            }}
            InputProps={{
                className: darkMode ? 'dark-mode-text' : ''
            }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateNote(editNoteId)}
            >
              Update
            </Button>
            <Button variant="contained" onClick={closeEditModalHandler}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </div>
  );
};

export default App;
