import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Paper,
  Typography,
  Divider,
  Chip,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Tooltip,
  Select,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  MoreVert,
  Edit,
  Delete,
  CalendarToday,
  Close,
} from "@mui/icons-material";
import api from "../hooks/Api";
import Loader from "../utils/Loader";
import AddProject from "./AddProject";
import AddchartTwoToneIcon from "@mui/icons-material/AddchartTwoTone";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useProjectContext } from "../Context/ProjectContext";
import ProjectStatusList from "../Components/updateStatus";
import ShareIcon from "@mui/icons-material/Share";
import TopicIcon from "@mui/icons-material/Topic";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LinkIcon from "@mui/icons-material/Link";
import { toast } from "react-toastify";

function formatDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return "Invalid date";

  const [date] = dateStr.split("T");
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ViewProject() {
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalopen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [isShowProjectStatus, setIsShowProjectStatus] = useState(true);
  const [isShowAddUpdateModal, setIsShowAddUpdateModal] = useState(false);
  const [isEditUpdateModal, setIsEditUpdateModal] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [isAddUpdateApiLoading, setIsAddUpdateApiLoading] = useState(false);
  const [isUrlChangeModalOpen, setIsUrlChangeModalOpen] = useState(false);

  const projectDropOption = Boolean(anchorEl);
  const hasFetched = useRef(false);

  const {
    getAllProjects,
    projects,
    loading,
    pagination,
    setLoadingButton,
    loadingButton,
    selectedProject,
    setSelectedProject,
    getProjectUpdateDetails,
    projectUpdatesData,
    isProjectUpdateloading,
    setProjectUpdatesData,
    changeProjectStatus,
    isStausApiloading,
  } = useProjectContext();
  const theme = useTheme();

  // Filter projects client-side by search after fetching with status filter
  const filteredProjects = projects?.filter((project) => {
    const searchTerm = search.toLowerCase();
    return (
      project.name?.toLowerCase().includes(searchTerm) ||
      project.project_hash?.toString().toLowerCase().includes(searchTerm)
    );
  });

  // Fetch projects on mount and when statusFilter changes
  useEffect(() => {
    if (hasFetched.current) return; // ignore subsequent calls
    hasFetched.current = true;
    getAllProjects();
    setSelectedProject(null);
    setProjectUpdatesData([]);
    setSearch("");
  }, [statusFilter]);

  useEffect(() => {
    if (selectedProject?._id) {
      getProjectUpdateDetails(selectedProject?._id);
    }
  }, [selectedProject?._id]);

  const handleToggleStatus = (value) => {
    const project_status = value;
    changeProjectStatus(selectedProject?._id, project_status);
  };

  const refetchProjects = () => {
    getAllProjects({ projectStatus: statusFilter });
    setIsModalOpen(false);
  };

  const handleStatusFilterClick = (e) => {
    setStatusFilter(e.target.value);
    getAllProjects({ projectStatus: e.target.value });
  };

  const handleViewMoreClick = (pageBtn) => {
    setLoadingButton(pageBtn);
    if (pageBtn === "next") {
      getAllProjects({ projectStatus: statusFilter, page: pagination.next });
    } else {
      getAllProjects({ projectStatus: statusFilter, page: pagination.prev });
    }
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    try {
      await api.deleteProject(selectedProject._id);
      getAllProjects({ projectStatus: statusFilter });
      setSelectedProject(null);
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Failed to delete projects:", error.message);
    }
  };

  const handleOpenUpdateModal = (isEdit, updateText) => {
    setIsShowAddUpdateModal(true);
    setIsEditUpdateModal(isEdit);
    setUpdateText(updateText || "");
  };

  const handleAddUpdate = async () => {
    setIsAddUpdateApiLoading(true);
    try {
      const payload = {
        project_id: selectedProject._id,
        description: updateText,
      };
      if (isEditUpdateModal?.length) {
        await api.editProjectUpdateDetail(isEditUpdateModal, {
          description: updateText,
        });
        setIsEditUpdateModal("");
        setUpdateText("");
        setIsShowAddUpdateModal(false);
        toast.success("Update edited successfully!");
        setTimeout(() => {
          getProjectUpdateDetails(selectedProject?._id);
        }, 200);
      } else {
        api.postProjectUpdateDetails(payload);
        setUpdateText("");
        setIsShowAddUpdateModal(false);
        toast.success("Update added successfully!");
        setTimeout(() => {
          getProjectUpdateDetails(selectedProject?._id);
        }, 200);
      }
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setTimeout(() => {
        setIsAddUpdateApiLoading(false);
      }, 100);
    }
  };

  const handleDeleteProjectUpdateDetail = async (id) => {
    await api.deleteProjectUpdateDetail(id);
    toast.success("Update delelted successfully!");
    getProjectUpdateDetails(selectedProject?._id);
  };

  const handleShareClick = () => {
    if (selectedProject?.project_hash) {
      const shareUrl = `${window.location.origin}/projectTimeline/${selectedProject?.project_hash}`;
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          toast.success("Link copied successfully!");
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
        });
    }
  };

  const handlehashIdCopyClick = () => {
    if (selectedProject?.project_hash) {
      const projectHashId = `${selectedProject?.project_hash}`;
      navigator.clipboard
        .writeText(projectHashId)
        .then(() => {
          toast.success("#ID copied successfully!");
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
        });
    }
  };

  if (loading && pagination.next === 0) {
    return (
      <Box
        sx={{
          height: "calc(100dvh - 80px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 75px)",
          bgcolor: "#f5f5f5",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: 250,
            flexShrink: 0,
            p: 2,
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            bgcolor: "#ffffff",
            height: "calc(100dvh - 110px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Status Filter Dropdown */}
          <TextField
            select
            size="small"
            label="Filter Project By Status"
            value={statusFilter}
            onChange={(e) => handleStatusFilterClick(e)}
            fullWidth
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                fontSize: "14px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "14px",
              },
              "& .MuiSelect-select": {
                fontSize: "14px",
              },
              "& .MuiInputBase-input::placeholder": {
                fontSize: "14px",
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="on_hold">On Hold</MenuItem>
          </TextField>

          {/* Search Input */}
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search projects by Name/Hash-ID"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={!projects?.length}
            sx={{ mb: 2 }}
            InputProps={{
              sx: {
                fontSize: "14px",
                "&::placeholder": {
                  fontSize: "14px",
                },
              },
            }}
          />
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            <List>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => {
                  const isSelected = selectedProject?._id === project._id;
                  return (
                    <ListItemButton
                      key={project._id}
                      selected={isSelected}
                      onClick={() => {
                        setSelectedProject(project);
                        setIsShowProjectStatus(true);
                      }}
                      sx={{ borderRadius: 1, mb: 1 }}
                    >
                      <ListItemText
                        primary={
                          project.name.length > 56
                            ? project.name.slice(0, 54) + "..."
                            : project.name
                        }
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: isSelected ? "black !important" : "inherit",
                        }}
                      />
                    </ListItemButton>
                  );
                })
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2, py: 1 }}
                >
                  No projects found.
                </Typography>
              )}
            </List>
          </Box>
          {pagination.count > 10 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: "0px 10px",
                mt: "4px",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleViewMoreClick("prev")}
                disabled={loadingButton === "prev" || pagination.prev === null}
                sx={{
                  textTransform: "none",
                }}
              >
                Prev{" "}
                {loadingButton === "prev" && loading && (
                  <RefreshOutlinedIcon
                    sx={{
                      fontSize: "20px",
                      marginLeft: 1,
                      "@keyframes spin": {
                        from: { transform: "rotate(0deg)" },
                        to: { transform: "rotate(360deg)" },
                      },
                      animation: "spin 0.5s linear infinite",
                    }}
                  />
                )}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleViewMoreClick("next")}
                disabled={loadingButton === "next" || pagination.next === null}
                sx={{
                  textTransform: "none",
                }}
              >
                Next{" "}
                {loadingButton === "next" && loading && (
                  <RefreshOutlinedIcon
                    sx={{
                      fontSize: "20px",
                      marginLeft: 1,
                      "@keyframes spin": {
                        from: { transform: "rotate(0deg)" },
                        to: { transform: "rotate(360deg)" },
                      },
                      animation: "spin 0.5s linear infinite",
                    }}
                  />
                )}
              </Button>
            </Box>
          )}
        </Box>

        {/* Detail view */}
        <Box sx={{ flex: 1, py: 2, overflowY: "auto", px: 4 }}>
          {projects?.length ? (
            <Paper elevation={3} sx={{ p: 2.9, borderRadius: "8px" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  {selectedProject?.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Tooltip title="Change project URL">
                    <IconButton
                      onClick={() => setIsUrlChangeModalOpen(true)}
                      sx={{ ml: "0px !important" }}
                    >
                      <LinkIcon fontSize="16px" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Click to copy #ID">
                    <IconButton
                      onClick={handlehashIdCopyClick}
                      sx={{ color: "#4b5563" }}
                    >
                      <InfoOutlinedIcon fontSize="16px" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share project link">
                    <IconButton
                      onClick={handleShareClick}
                      sx={{ ml: "0px !important" }}
                    >
                      <ShareIcon fontSize="16px" />
                    </IconButton>
                  </Tooltip>

                  <Select
                    value={
                      selectedProject?.project_status === "completed"
                        ? "Completed"
                        : selectedProject?.project_status === "in_progress"
                        ? "In Progress"
                        : "On Hold"
                    }
                    onChange={(e) => handleToggleStatus(e.target.value)}
                    size="small"
                    renderValue={() =>
                      isStausApiloading ? (
                        <CircularProgress
                          size={20}
                          sx={{ color: "white", ml: 1 }}
                        />
                      ) : selectedProject?.project_status === "completed" ? (
                        "Completed"
                      ) : selectedProject?.project_status === "in_progress" ? (
                        "In Progress"
                      ) : (
                        "On Hold"
                      )
                    }
                    sx={{
                      width: "130px",
                      "& fieldset": {
                        border: "none",
                      },
                      "& .MuiSelect-icon": {
                        color: "white", // icon color
                      },
                      fontSize: "14px",
                      fontWeight: "600",
                      backgroundColor:
                        selectedProject?.project_status === "completed"
                          ? theme.palette.success.main
                          : selectedProject?.project_status === "in_progress"
                          ? theme.palette.warning.main
                          : theme.palette.info.main,
                      color: "white",
                      borderRadius: "20px",
                      textAlign: "center",
                    }}
                    disabled={isStausApiloading}
                  >
                    <MenuItem value="in_progress" sx={{ fontSize: "14px" }}>
                      In Progress
                    </MenuItem>
                    <MenuItem value="completed" sx={{ fontSize: "14px" }}>
                      Completed
                    </MenuItem>
                    <MenuItem value="on_hold" sx={{ fontSize: "14px" }}>
                      On Hold
                    </MenuItem>
                  </Select>
                  {/* </Tooltip> */}
                  <IconButton
                    aria-label="more"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    size="small"
                    sx={{ ml: "0px !important" }}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={projectDropOption}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    MenuListProps={{
                      dense: true,
                      sx: { py: 0.5 },
                    }}
                    PaperProps={{
                      sx: { minWidth: 60, boxShadow: 3, borderRadius: 1.5 },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        setIsModalOpen(true);
                      }}
                      sx={{ px: 1.5, py: 0.8, fontSize: "10px" }}
                    >
                      <Edit sx={{ fontSize: "14px", mr: "5px" }} />
                      <ListItemText
                        primaryTypographyProps={{ fontSize: "14px" }}
                      >
                        Edit
                      </ListItemText>
                    </MenuItem>
                    <MenuItem
                      sx={{ px: 1.5, py: 0.8, fontSize: "10px" }}
                      onClick={() => handleDelete()}
                    >
                      <Delete
                        color="error"
                        sx={{ fontSize: "14px", mr: "5px" }}
                      />
                      <ListItemText
                        primaryTypographyProps={{ fontSize: "14px" }}
                      >
                        Delete
                      </ListItemText>
                    </MenuItem>
                  </Menu>
                </Stack>
              </Stack>

              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {selectedProject?.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday fontSize="small" />
                  <Typography variant="body2">
                    <strong>Start:</strong>{" "}
                    {formatDate(selectedProject?.start_date)}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday fontSize="small" />
                  <Typography variant="body2">
                    <strong>End:</strong>{" "}
                    {formatDate(selectedProject?.end_date)}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          ) : (
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                p: 2.9,
              }}
            >
              <Box sx={{ fontSize: 64, color: "#cbd5e1" }}>
                <TopicIcon sx={{ fontSize: 64 }} />
              </Box>
              <Typography variant="h6" color="text.secondary" fontWeight="bold">
                No projects available
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                You haven't added any projects yet. Click below to get started.
              </Typography>
              <Button
                variant="contained"
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
            </Paper>
          )}

          {/* project updates section */}
          {projects.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: "8px",
                maxHeight: "calc(100dvh - 375px)",
                overflow: "auto",
                mt: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon color="white" />}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "bold",
                    p: "6px 10px",
                    fontSize: "14px",
                  }}
                  onClick={() => handleOpenUpdateModal(false, "")}
                >
                  Add Update
                </Button>
                <IconButton
                  variant="contained"
                  color="primary"
                  sx={{
                    color: "#6b7280",
                  }}
                  onClick={() => setIsShowProjectStatus(!isShowProjectStatus)}
                >
                  {!isShowProjectStatus ? (
                    <ExpandMoreIcon />
                  ) : (
                    <ExpandLessIcon />
                  )}
                </IconButton>
              </Box>
              {isShowProjectStatus && (
                <Box
                  sx={{
                    overflow: "auto",
                    maxHeight: "calc(100dvh - 440px)",
                  }}
                >
                  <ProjectStatusList
                    isLoading={isProjectUpdateloading}
                    project={projectUpdatesData}
                    handleDeleteUpdate={handleDeleteProjectUpdateDetail}
                    handleEditUpdate={handleOpenUpdateModal}
                  />
                </Box>
              )}
            </Paper>
          )}
        </Box>
      </Box>

      {/* AddUpdate Modal */}
      <Dialog
        open={isShowAddUpdateModal}
        onClose={() => setIsShowAddUpdateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <IconButton
          aria-label="close"
          onClick={() => {
            setIsShowAddUpdateModal(false);
            setIsEditUpdateModal("");
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {!isEditUpdateModal.length
              ? "New Project Update"
              : "Edit Project Update"}
          </Typography>
          <TextField
            label="Update Details"
            placeholder="Enter project update details..."
            fullWidth
            multiline
            rows={3}
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value.replace(/^\s+/, ""))}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!updateText || isAddUpdateApiLoading}
            onClick={() => handleAddUpdate()}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              height: "40px",
              width: "151px",
            }}
          >
            {isAddUpdateApiLoading ? (
              <CircularProgress size={18} color="white" />
            ) : (
              "Submit Update"
            )}
          </Button>
        </DialogContent>
      </Dialog>

      {/* AddProject Modal */}
      <Dialog
        open={isModalopen}
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
          <Close />
        </IconButton>
        <DialogContent dividers>
          <AddProject
            projectToEdit={selectedProject}
            onSuccess={() => refetchProjects()}
          />
        </DialogContent>
      </Dialog>

      {/* Change Url Modal */}
      <Dialog
        open={isUrlChangeModalOpen}
        slotProps={{
          paper: {
            sx: {
              padding: "16px",
            },
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => setIsUrlChangeModalOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogTitle sx={{ padding: 0 }}>Change Project URL</DialogTitle>
        <DialogContent sx={{ maxWidth: "400px", padding: 0 }}>
          <DialogContentText sx={{ fontSize: "15px", py: 1 }}>
            Are you sure you want to change the current project URL? This action
            might break existing links.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 0 }}>
          <Button
            onClick={() => setIsUrlChangeModalOpen(false)}
            color="primary"
            variant="outlined"
            sx={{ fontSize: "12px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setIsUrlChangeModalOpen(false);
              try {
                const response = await api.changeProjectUrl(
                  selectedProject?._id
                );
                toast.success(response.message);
                refetchProjects(); // optional
              } catch (error) {
                console.error("Failed to change URL:", error);
                toast.error("Failed to change project URL.");
              }
            }}
            color="error"
            variant="contained"
            sx={{ fontSize: "12px" }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
