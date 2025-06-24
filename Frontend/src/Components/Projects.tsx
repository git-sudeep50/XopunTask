import { SlidersHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaThLarge } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Kanban from './Kanban';
import CreateProjectModal from './Create.Project.Modal';
import axios from 'axios';
import { BASE_URL } from '../utils/contsant';
import { useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import JoinProject from './Join.project';


const Loader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
  </div>
);


const Projects: React.FC = () => {
  const [display, setDisplay] = useState<'List' | 'Kanban'>('List');
  const [showOptions, setShowOptions] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { email } = useSelector((state: any) => state.user);

  const getProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL + `tasks/projects/${email}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const [openCreateProjectModal, setOpenCreateProjectModal] = useState<boolean>(false);
  const [openJoinModal, setOpenJoinModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gradient-to-br px-4 py-6 relative">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6 mx-auto">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
          onClick={() => setOpenJoinModal(true)}
        >
          Join a New Project
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={() => setOpenCreateProjectModal(true)}
        >
          Create New Project
        </button>
      </div>

      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-6 relative">
          <h1 className="text-2xl font-bold text-gray-800">List of All Projects</h1>

          <div className="relative">
            <button
              className="text-black px-3 py-2 bg-gray-300 flex flex-col items-center rounded-md hover:bg-gray-400"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="text-xs">Display</span>
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    setDisplay('List');
                    setShowOptions(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 ${
                    display === 'List' ? 'bg-gray-200 font-semibold' : ''
                  }`}
                >
                  <FaClipboardList /> List
                </button>
                <button
                  onClick={() => {
                    setDisplay('Kanban');
                    setShowOptions(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 ${
                    display === 'Kanban' ? 'bg-gray-200 font-semibold' : ''
                  }`}
                >
                  <FaThLarge /> Kanban
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : display === 'List' ? (
          <div>
            {projects.map((item) => (
              <ProjectCard
                key={item.projectId}
                item={item}
                
                refresh={getProjects}
              />
            ))}
          </div>
        ) : (
          <Kanban
            project={projects.map((item) => ({
              projectId: item.projectId,
              pname: item.project.pname,
              uname: [item.project.owner.uname, item.project.owner.uid],
              dueDate: item.project.dueDate
                ? new Date(item.project.dueDate).toISOString().split('T')[0]
                : '',
              status: item.project.status,
            }))}
          />
        )}
      </div>

      {openCreateProjectModal && (
        <CreateProjectModal closeModal={setOpenCreateProjectModal} />
      )}
      {openJoinModal && <JoinProject closeModal={setOpenJoinModal} />}
    </div>
  );
};

export default Projects;
