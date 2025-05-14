import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import api from "../Hooks/api";
import { useParams } from "react-router-dom";
import { ProjectNotFound } from "../Components/ProjectNotFound";
import api from "../hooks/Api";

const ProjectTimeline = () => {
  const [showForm, setShowForm] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [author, setAuthor] = useState("");
  const [project, setProject] = useState(null);
  const [isError, setIsError] = useState(false);
  const { projectHash } = useParams();

  const dummyData = {
    name: "Test Project",
    description: "A test project of the description here",
    start_date: "2025-01-01T00:00:00.000Z",
    end_date: "2025-12-31T00:00:00.000Z",
    status_updates: [
      {
        _id: "...",
        title: "Project started",
        description: "Initial setup completed",
        status: "in_progress",
        progress_percentage: 20,
        posted_by: "John Doe",
        created_at: "2025-05-13T12:45:00.221Z",
      },
      {
        _id: "...",
        title: "Project started",
        description: "Initial setup completed",
        status: "in_progress",
        progress_percentage: 20,
        posted_by: "John Doe",
        created_at: "2025-05-13T12:45:00.221Z",
      },
      {
        _id: "...",
        title: "Project started",
        description: "Initial setup completed",
        status: "in_progress",
        progress_percentage: 20,
        posted_by: "John Doe",
        created_at: "2025-05-13T12:45:00.221Z",
      },
      {
        _id: "...",
        title: "Project started",
        description: "Initial setup completed",
        status: "in_progress",
        progress_percentage: 20,
        posted_by: "John Doe",
        created_at: "2025-05-13T12:45:00.221Z",
      },
    ],
    total_updates: 3,
    latest_status: {
      status: "in_progress",
      progress_percentage: 20,
      created_at: "2025-05-13T12:45:00.221Z",
    },
  };

  useEffect(() => {
    fetchProjectTimeline();
  }, []);

  // Call the getProjectTimeline method
  const fetchProjectTimeline = async () => {
    try {
      const timelineData = await api.getProjectTimeline(projectHash);
      console.log(timelineData);
    } catch (error) {
      // setProject(dummyData);
      setIsError(error);
      console.error("Error fetching project timeline:", error);
    }
  };

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

    setUpdateText("");
    setAuthor("");
    setShowForm(false);
  };

  if (isError) {
    return <ProjectNotFound />;
  }

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
        {project?.name ? project?.name : "Project Timeline"}
      </Typography>
      <Typography gutterBottom sx={{ color: "#4b5563", fontSize: "16px" }}>
        {project?.description
          ? project?.description
          : "Real-time updates on your project's progress"}
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
        {project?.status_updates?.map((update) => (
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
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#6b7280",
                  }}
                >
                  <AccessTimeIcon
                    sx={{ fontSize: "18px", mr: 0.5, mt: -0.25 }}
                  />
                  {update?.created_at}
                </Typography>
                <Box sx={{ mt: 0.5, fontSize: "18px" }}>
                  {update?.description}
                </Box>
                <Box sx={{ mt: 1 }}>
                  <strong style={{ color: "#4b5563" }}>Posted by:</strong>{" "}
                  {update?.posted_by}
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
