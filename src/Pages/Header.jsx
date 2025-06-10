import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import AddProject from "./AddProject";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import AddchartTwoToneIcon from "@mui/icons-material/AddchartTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { loggingOut } from "../utils/helpers";
import { useProjectContext } from "../Context/ProjectContext";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { getAllProjects } = useProjectContext();

  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    loggingOut();
  };

  const refetchProjects = () => {
    
    getAllProjects();
    setIsModalOpen(false);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        sx={{
          backgroundColor: "#fff",
          color: "#333",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          height: "75px",
          justifyContent: "center",
          borderBottom: "1px solid #ddd",
          padding: "0 40px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left Side: Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => window.location.reload()}
          >
            <ViewQuiltIcon
              sx={{ color: "#3b82f6", fontSize: "45px", mr: 0.5 }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: 1.1,
              }}
            >
              <span>Admin</span>
              <span style={{ marginTop: "-1px" }}>Panel</span>
            </Box>
          </Box>

          {/* Right Side: View + Button + Avatar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <AddchartTwoToneIcon /> Add Project
            </Button>

            <IconButton
              onClick={handleUserIconClick}
              size="small"
              aria-controls={open ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{
                ml: 1,
                color: "#3b82f6",
                bgcolor: "#e0e7ff", 
                width: 40,
                height: 40,
                borderRadius: "50%",
                "&:hover": {
                  bgcolor: "#c7d2fe",
                },
              }}
            >
              <PersonIcon fontSize="medium" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 120,
                },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </AppBar>

      {/* AddProject Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <IconButton
          aria-label="close"
          onClick={() => setIsModalOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <AddProject onSuccess={() => refetchProjects()} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
