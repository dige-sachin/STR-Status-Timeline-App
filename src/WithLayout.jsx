import React from "react";
import { Box, Paper } from "@mui/material";

const withLayout = (WrappedComponent) => {
  const paperLayout = (props) => (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 700,
          p: 3,
          borderRadius: 2,
        }}
      >
        <WrappedComponent {...props} />
      </Paper>
    </Box>
  );

  return paperLayout;
};

export default withLayout;
