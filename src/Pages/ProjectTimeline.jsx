import React, { useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useParams } from "react-router-dom";
import { ProjectNotFound } from "../Components/ProjectNotFound";
import api from "../hooks/Api";
import Loader from "../utils/Loader";
import { formatDate } from "../utils/helpers";

const ProjectTimeline = () => {
  const [author, setAuthor] = useState("");
  const [project, setProject] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { projectHash } = useParams();

  useEffect(() => {
    fetchProjectTimeline();
  }, []);

  // Call the getProjectTimeline method
  const fetchProjectTimeline = async () => {
    setIsLoading(true);
    try {
      const resp = await api.getProjectTimeline(projectHash);
      console.log("data--", resp);

      setProject(resp?.data);
    } catch (error) {
      setIsError(error);
      console.error("Error fetching project timeline:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  const renderProjectTimelineCard = () => {
    if (!project?.status_updates?.length) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="300px"
          border="1px solid #e5e7eb"
          borderRadius="12px"
          p={4}
          textAlign="center"
          bgcolor="#f9fafb"
          mt={8}
        >
          <ChatBubbleOutlineIcon
            sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }}
          />
          <Typography variant="h6" color="text.secondary" fontWeight="medium">
            No project updates yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Status updates will appear here once your project starts
            progressing.
          </Typography>
        </Box>
      );
    }
    return project?.status_updates?.map((update) => (
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: "10%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            mr: { xs: "20px", md: 1.5 },
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
          <Box sx={{ height: "100%", width: "2px", background: "#d1d5db" }} />
        </Box>
        <Box
          key={update.id}
          sx={{
            width: "85%",
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
              <AccessTimeIcon sx={{ fontSize: "18px", mr: 0.5, mt: -0.25 }} />
              {formatDate(update?.created_at)}
            </Typography>
            <Box sx={{ mt: 0.5, fontSize: "18px" }}>{update?.description}</Box>
            <Box sx={{ mt: 1 }}>
              <strong style={{ color: "#4b5563" }}>Posted by:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>
                {update?.posted_by}
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    ));
  };

  const renderContent = () => {
    if (isLoading) return <Loader />;

    if (isError) return <ProjectNotFound />;
    return (
      <>
        <Box
          sx={{
            p: { xs: "30px 0 0 30px", md: 0 },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#1f2937",
              fontSize: "1.875rem",
              fontWeight: 700,
              mr: 1,
            }}
          >
            {project?.name}
          </Typography>

          {/* Info icon with tooltip on hover */}
          <Tooltip title={project?.description || "No description"}>
            <IconButton sx={{ color: "#4b5563", mt: "-10px", ml: "-8px" }}>
              <InfoOutlinedIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography gutterBottom sx={{ color: "#4b5563", fontSize: "16px" }}>
          Real-time updates on your project's progress
        </Typography>

        <Box
          sx={{
            p: { xs: "30px", md: "10px" },
            mt: "10px",
            height: { xs: "calc(100dvh - 150px)", md: "calc(100dvh - 250px)" },
            overflow: "auto",
          }}
        >
          {renderProjectTimelineCard()}
        </Box>
      </>
    );
  };

  return <Box height="calc(100dvh - 130px)">{renderContent()}</Box>;
};

export default ProjectTimeline;
