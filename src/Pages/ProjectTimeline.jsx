import React, { useState } from "react";
import { Box, Typography, Button, TextField, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ProjectTimeline = () => {
  const [updates, setUpdates] = useState([
    {
      id: 1,
      date: "May 7, 2025 at 10:30 AM",
      text: "Project kickoff meeting completed. Initial requirements gathered and team roles assigned.Project kickoff meeting completed. Initial requirements gathered and team roles assigned.Project kickoff meeting completed. Initial requirements gathered and team roles assigned.Project kickoff meeting completed. Initial requirements gathered and team roles assigned.Project kickoff meeting completed. Initial requirements gathered and team roles assigned.Project kickoff meeting completed. Initial requirements gathered and team roles assigned.Project kickoff meeting completed. Initial requirements gathered and team roles assigned.",
      author: "Sarah Johnson",
    },
    {
      id: 2,
      date: "May 6, 2025 at 3:15 PM",
      text: "Design mockups for homepage completed and sent for review. Awaiting client feedback.",
      author: "Michael Chen",
    },
    {
      id: 3,
      date: "May 5, 2025 at 11:45 AM",
      text: "Database schema finalized. Backend development started with API endpoints planning.",
      author: "Alex Rodriguez",
    },
    {
      id: 4,
      date: "May 2, 2025 at 2:00 PM",
      text: "User stories prioritized and added to sprint backlog. First sprint planning completed.",
      author: "Taylor Wilson",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [author, setAuthor] = useState("");

  const handleAddUpdate = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const newUpdate = {
      id: Date.now(),
      date: formattedDate,
      text: updateText,
      author,
    };

    setUpdates([newUpdate, ...updates]);
    setUpdateText("");
    setAuthor("");
    setShowForm(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 800,
        mx: "auto",
        my: "20px",
        padding: "30px",
        borderRadius: "8px",
      }}
    >
      <Typography
        sx={{ color: "#1f2937", fontSize: "1.875rem", fontWeight: 700 }}
      >
        Project Timeline
      </Typography>
      <Typography gutterBottom sx={{ color: "#4b5563", fontSize: "16px" }}>
        Real-time updates on your project's progress
      </Typography>

      {/* future use */}
      {/* {!showForm ? (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
          sx={{ mb: 2, background: "#0095ff", fontSize: "15px" }}
        >
          Add Update
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={() => setShowForm(false)}
          sx={{ mb: 2, fontSize: "15px" }}
        >
          Cancel
        </Button>
      )} */}

      {showForm && (
        <Paper
          elevation={4}
          sx={{ mb: 3, padding: "24px", borderRadius: "8px" }}
        >
          <Typography variant="h6" gutterBottom>
            New Project Update
          </Typography>
          <TextField
            label="Update Details"
            placeholder="Enter project update details..."
            fullWidth
            multiline
            rows={3}
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Your Name"
            placeholder="Enter your name"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleAddUpdate}
            disabled={!updateText || !author}
          >
            Submit Update
          </Button>
        </Paper>
      )}

      <Box sx={{ mt: "16px" }}>
        {updates.map((update) => (
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                width: "10%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                mr: { xs: "28px", md: 0 },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  background: "#0095ff",
                  padding: "15px",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: "20px" }} />
              </Box>
              <Box
                sx={{ height: "100%", width: "2px", background: "#d1d5db" }}
              />
            </Box>
            <Box
              key={update.id}
              sx={{
                width: "90%",
                marginBottom: "20px",
                display: "flex",
                alignItems: "flex-start",
                padding: "24px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <AccessTimeIcon sx={{ fontSize: "16px", mr: 0.5 }} />
                  {update.date}
                </Typography>
                <Box sx={{ mt: 0.5, fontSize: "18px" }}>{update.text}</Box>
                <Box sx={{ mt: 1 }}>
                  <strong style={{ color: "#4b5563" }}>Posted by:</strong>{" "}
                  {update.author}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ProjectTimeline;
