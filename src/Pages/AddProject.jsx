import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import api from "../hooks/Api";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AddProject = ({ projectToEdit = null, onSuccess }) => {
  const isEditMode = Boolean(projectToEdit);

  const initialFormData = {
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    project_status: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [dots, setDots] = useState(".");
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        ...projectToEdit,
        start_date: projectToEdit.start_date
          ? format(new Date(projectToEdit.start_date), "yyyy-MM-dd")
          : "",
        end_date: projectToEdit.end_date
          ? format(new Date(projectToEdit.end_date), "yyyy-MM-dd")
          : "",
      });
    }
  }, [projectToEdit]);

  useEffect(() => {
    let interval;
    if (isSaving) {
      interval = setInterval(() => {
        setDots((prev) => (prev.length >= 4 ? "" : prev + "."));
      }, 320);
    }
    return () => clearInterval(interval);
  }, [isSaving]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    
  if (name === "start_date" || name === "end_date") {
    if (value && !/^\d{0,4}(-\d{0,2}(-\d{0,2})?)?$/.test(value)) {
      // invalid partial date format, ignore change
      return;
    }
    if (value.length === 10) {
      const year = value.split("-")[0];
      if (year.length > 4) {
        // reject input if year is longer than 4 digits
        return;
      }
    }
  }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("call--", projectToEdit);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        project_status: formData.project_status,
      };
      if (isEditMode) {
        await api.editProject(projectToEdit._id, payload);
        toast.success("Project updated successfully!");
      } else {
        await api.addNewProject(payload);
        toast.success("Project created successfully!");
      }
      setOpenSuccess(true);
      setFormData(initialFormData);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return format(date, "yyyy-MM-dd");
  };
  
  return (
    <>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        {isEditMode ? "Edit Project" : "Create New Project"}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {isEditMode
          ? "Update the project details below."
          : "Fill in the details below to add a new project to the timeline."}
      </Typography>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <TextField
          label="Project Name"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextField
          label="Start Date"
          name="start_date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.start_date}
          onChange={handleChange}

          required
          error={!!errors.start_date}
          helperText={errors.start_date}
          inputProps={{
            min: "1900-01-01", // <-- restrict minimum year
            max: formData.end_date 
              ? addDays(formData.end_date, 0)
              : "2099-12-31",  // <-- restrict maximum year
          }}
        />

        <TextField
          label="End Date"
          name="end_date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.end_date}
          onChange={handleChange}
          required
          error={!!errors.end_date}
          helperText={errors.end_date}
          inputProps={{
            min: formData.start_date
            ? addDays(new Date(formData.start_date), 0)
            : "1900-01-01",
          max: "2099-12-31",
          }}
        />

        <TextField
          select
          size="small"
          label="Project Status"
          name="project_status"
          value={formData.project_status}
          onChange={(e) => handleChange(e)}
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
              padding: "16.5px 14px",
            },
            "& .MuiInputBase-input::placeholder": {
              fontSize: "14px",
              padding: "16.5px 14px",
            },
          }}
        >
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="on_hold">On Hold</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSaving}
          sx={{
            mt: 2,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "150px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {isSaving
              ? `${isEditMode ? "Updating" : "Saving"} Project${dots}`
              : isEditMode
              ? "Update Project"
              : "Save Project"}
          </Box>
        </Button>
      </Box>

      <Snackbar
        open={openSuccess}
        autoHideDuration={4000}
        onClose={() => setOpenSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Project {isEditMode ? "updated" : "added"} successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProject;
