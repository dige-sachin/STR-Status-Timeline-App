import {
  Box,
  Typography,
  Stack,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const ProjectNotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 100
      }}
    >
      <Box
        sx={{
          border: "1px solid #eee",
          borderRadius: 2,
          p: 5,
          textAlign: "center",
          maxWidth: 600,
          width: "100%",
          backgroundColor: "#fafafa",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <ErrorOutlineIcon sx={{ fontSize: 80, color: "#90caf9" }} />
          <Typography variant="h6" fontWeight="bold">
          This project doesn't exist or has ended
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};
