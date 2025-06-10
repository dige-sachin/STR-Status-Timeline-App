import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Loader from "../utils/Loader";
import api from "../hooks/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await api.adminLogin(formData);
      // Save tokens and role to localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("role", data.role);
      const loginTime = Date.now();
      localStorage.setItem("login_time", loginTime);
      toast.success("Login Successfully!")
      navigate("/admin/viewProject");

      console.error("Login failed:", data);
      // Optionally, redirect or update UI here after login
    } catch (error) {
      toast.error(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 500,
        mx: "auto",
        my: 6,
        p: 4,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ViewQuiltIcon sx={{ color: "#3b82f6", fontSize: "45px" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            fontSize: "14px",
            gap: "0px",
            color: "#6b7280",
          }}
        >
          <span>Admin</span>
          <span style={{ marginTop: "-4px" }}>Panel</span>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Name"
          name="username"
          type="name"
          fullWidth
          required
          value={formData.username}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  sx={{
                    color: "#8fb1f4",
                    fontSize: "24px",
                  }}
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, height: "40px", bgcolor: "#3b82f6" }}
        >
          {isLoading ? <CircularProgress size={16} color="white" /> : "Log In"}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminLogin;
