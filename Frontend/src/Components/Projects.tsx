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

//type ProjectStatus =  'ASSIGNED'| 'PROGRESS' | 'COMPLETED' | 'EXCEEDED';



interface ProjectCardProps {
  pname: string;
  uname: string;
  dueDate: string;
  status: string;
  role?: string;
}
const Projects: React.FC = () => {
  const [display, setDisplay] = useState<'List' | 'Kanban'>('List');
  const [showOptions, setShowOptions] = useState(false);
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const {email}=useSelector((state:any) => state.user);

 
const getProjects = async () => {
  try {
    const response = await axios.get(BASE_URL + `tasks/projects/${email}`);
    
    setProjects(response.data);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};


  useEffect(()=>{   
  getProjects();
  },[]);

 
const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <div className="min-h-screen bg-gradient-to-br px-4 py-6 relative">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6 mx-auto">
        <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition">Join</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={() =>{ setOpenModal(true);
          setOpenModal(true);
        }}
        >Create New Project</button>
      </div>

      <div className="w-full mx-auto">
        <div className='flex justify-between items-center mb-6 relative'>
          <h1 className="text-2xl font-bold text-gray-800">List of Projects</h1>

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

        {display === 'List' && (
  <div>
    {projects.map((item) => (
      <ProjectCard
        key={item.projectId}
        projectId={item.projectId}
        pname={item.project.pname}
        uname={item.project.owner.uname}
        dueDate={item.project.dueDate ? new Date(item.project.dueDate).toISOString().split('T')[0] : ''}
        status={item.project.status}
        refresh={getProjects}
      />
    ))}
  </div>
)}



        {display === 'Kanban' && (
  <Kanban
    project={projects.map((item) => ({
      projectId: item.projectId,
      pname: item.project.pname,
      uname: item.project.owner.uname,
      dueDate: item.project.dueDate
        ? new Date(item.project.dueDate).toISOString().split('T')[0]
        : '',
      status: item.project.status,
    }))}
  />
)}

      </div>
      {openModal && (
        <CreateProjectModal closeModal={setOpenModal} />
      )}
    </div>
  );
};

export default Projects;
