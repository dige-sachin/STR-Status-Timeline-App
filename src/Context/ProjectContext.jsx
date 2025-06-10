import { createContext, useContext, useEffect, useState } from "react";
import api from "../hooks/Api";
import { toast } from "react-toastify";

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext); 

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    next: 0,
    prev: null,
  });
  const [projectUpdatesData, setProjectUpdatesData] = useState([]);
  const [isProjectUpdateloading, setIsProjectUpdateLoading] = useState(true);
  const [isStausApiloading, setIsStatusApiLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);

  const getAllProjects = async ({ projectStatus, page = 1 } = {}) => {
    setLoading(true);

    try {
      const data = await api.getAllProjects(projectStatus, page);

      if (data?.data?.projects) {
        setProjects(data.data.projects);
        setPagination({
          count: data.data.count,
          next: data.data.next,
          prev: data.data.prev,
        });
        setSelectedProject(data.data.projects[0]);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error.message);
    } finally {
      setLoadingButton(null);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const getProjectUpdateDetails = async (id) => {
    setIsProjectUpdateLoading(true);
    try {
      const data = await api.getProjectUpdateDetails(id);

      if (data?.data) {
        setProjectUpdatesData(data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error.message);
    } finally {
      setTimeout(() => setIsProjectUpdateLoading(false), 1000); // Optional delay
    }
  };

  const changeProjectStatus = async (id, isCompleted) => {
    setIsStatusApiLoading(true);
    try {
      const data = await api.updateProjectStatus(id, isCompleted);
      if (!data?.error) {
        setProjects((prev) =>
          prev.map((proj) =>
            proj._id === id ? { ...proj, project_status: isCompleted } : proj
          )
        );

        setSelectedProject((prevProject) =>
          prevProject && prevProject._id === id
            ? { ...prevProject, project_status: isCompleted }
            : prevProject
        );

        toast.success("Project status updated successfully!");
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error.message);
    } finally {
      setIsStatusApiLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
        setProjects,
        loading,
        setLoadingButton,
        loadingButton,
        pagination,
        getAllProjects,
        getProjectUpdateDetails,
        projectUpdatesData,
        isProjectUpdateloading,
        setProjectUpdatesData,
        changeProjectStatus,
        isStausApiloading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
