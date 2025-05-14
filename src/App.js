import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme/theme";
import "./App.css";
import ProjectTimeline from "./Pages/ProjectTimeline";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/projectTimeline/:projectHash" element={<ProjectTimeline />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
