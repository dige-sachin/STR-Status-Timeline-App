import React from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatDate } from "../utils/helpers";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteIcon from "@mui/icons-material/Delete";

const ProjectStatusList = ({
  isLoading,
  project,
  handleDeleteUpdate,
  handleEditUpdate,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "30px" }}>
        <CircularProgress size={"24px"} />
      </Box>
    );
  }

  if (!project?.length) {
    return <Typography textAlign="center">No updates available!</Typography>;
  }

  return project.map((update) => (
    <Box key={update.id} sx={{ display: "flex" }}>
      <Box
        sx={{
          width: "10%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          mr: { xs: "20px", md: 0 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            background: "#0095ff",
            padding: "10px",
            color: "white",
            borderRadius: "50%",
            display: "flex",
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: "14px" }} />
        </Box>
        <Box sx={{ height: "100%", width: "2px", background: "#d1d5db" }} />
      </Box>
      <Box
        sx={{
          width: "65%",
          marginBottom: "15px",
          display: "flex",
          alignItems: "flex-start",
          padding: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          bgcolor: "rgb(25 118 210 / 4%)",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            // variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#6b7280",
              fontSize: "12.8px",
              opacity: "0.8",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: "15px", m: 0 }} />
              <span style={{ margin: 0, lineHeight: 1 }}>
                {formatDate(update?.updated_at || "") + " " + "(UTC)"}
              </span>
            </Box>
            <Box sx={{ display: "flex" }}>
              <IconButton sx={{ mr: "-6px" }}>
                <EditSquareIcon
                  sx={{ fontSize: "16px" }}
                  onClick={() =>
                    handleEditUpdate(update?._id, update?.description)
                  }
                />
              </IconButton>
              <IconButton>
                <DeleteIcon
                  color="error"
                  sx={{ fontSize: "16px" }}
                  onClick={() => handleDeleteUpdate(update?._id)}
                />
              </IconButton>
            </Box>
          </Typography>
          <Box sx={{ mt: 0.5, fontSize: "16.8px" }}>{update?.description}</Box>
          <Box sx={{ mt: 1, fontSize: "14.8px" }}>
            <strong style={{ color: "#4b5563" }}>Posted by:</strong>{" "}
            {update?.posted_by || ""}
          </Box>
        </Box>
      </Box>
    </Box>
  ));
};

export default ProjectStatusList;
