import axios from "axios";
import config from "../config";

export const api = {
  // Get project timeline
  getProjectTimeline: async (projectHash) => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/api/project/${projectHash}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Project not found");
    }
  },

  // Get project summary
  getProjectSummary: async (projectHash) => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/api/project/${projectHash}/summary`
      );
      return response.data;
    } catch (error) {
      throw new Error("Project not found");
    }
  },
};

export default api;
