import axios from "axios";
import config from "../config";
import { loggingOut } from "../utils/helpers";
import { toast } from "react-toastify";

const handleAuthError = (error) => {
  if (
    error.response &&
    (error.response.status === 401 ||
      error.response.data?.message === "Invalid token")
  ) {
    loggingOut();
  }
  toast.error(error.response?.data?.message || "Something went wrong!")
  throw new Error(error.response?.data?.message || "Something went wrong!");
};

export const api = {
  // Get project timeline
  getProjectTimeline: async (projectHash) => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/api/project/${projectHash}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!")
      throw new Error(error);
    }
  },

  // add new project by admin
  addNewProject: async (payload) => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.post(
        `${config.API_BASE_URL}/api/admin/projects`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // admin login
  adminLogin: async (payload) => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/admin/auth/login`,
        payload
      );
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!")
      throw new Error(error);
    }
  },

  // admin refresh token 
  adminRefreshToken: async (payload) => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/admin/auth/refresh`,
        payload,
      );
      return response.data?.access_token;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // get all projects
  getAllProjects: async (projectStatus, page) => {
    const token = localStorage.getItem('access_token');
    console.log("call--", projectStatus)
    const project_status = projectStatus === "all" ? "" : projectStatus
    try {
      let url = `${config.API_BASE_URL}/api/admin/projects?page=${page}`;
      if (typeof project_status === "string" && project_status !== "") {
        url += `&project_status=${project_status}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "true",
        },
      });

      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // delete project
  deleteProject: async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.delete(
        `${config.API_BASE_URL}/api/admin/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // edit project
  editProject: async (id, payload) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.patch(
        `${config.API_BASE_URL}/api/admin/projects/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // get project update details
  getProjectUpdateDetails: async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/api/admin/status-updates?project_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // post add project update details
  postProjectUpdateDetails: async (payload) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/admin/status-updates`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // edit project update details
  editProjectUpdateDetail: async (id, payload) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.patch(
        `${config.API_BASE_URL}/api/admin/status-updates/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // delete project update details
  deleteProjectUpdateDetail: async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.delete(
        `${config.API_BASE_URL}/api/admin/status-updates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // update the project status
  updateProjectStatus: async (id, projectStatus) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/admin/project-flag/${id}`,
        { flag_type: projectStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // change the project url
  changeProjectUrl: async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/admin/projects/reset_hash`,
        {
          project_id: id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  },
};

export default api;
