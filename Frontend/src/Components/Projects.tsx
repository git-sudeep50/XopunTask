import { SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { FaClipboardList, FaThLarge } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import Kanban from './Kanban';
import CreateProjectModal from './Create.Project.Modal';

type ProjectStatus = 'Completed' | 'In Progress' | 'Pending';

interface Project {
  title: string;
  owner: string;
  dueDate: string;
  status: ProjectStatus;
}

interface ProjectCardProps extends Project {
  onStatusChange: (newStatus: ProjectStatus) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, owner, dueDate, status, onStatusChange }) => {
  const [open, setOpen] = useState(false);

  const statusColors = {
    'Completed': 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Pending': 'bg-red-100 text-red-800',
  };

  const statuses: ProjectStatus[] = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="relative cursor-pointer h-fit bg-gray-50 shadow-2xl rounded-lg w-full mb-4 border border-gray-700">
      <div className='flex justify-between items-center'>
        <div>
          <div className="flex ml-2 mt-2 items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl bg-pink-500">
              <FaClipboardList />
            </div>
            <div className="text-sm font-bold text-black">{title}</div>
          </div>
          <p className="text-black text-base font-normal ml-2 mb-1">
            Due Date: <span className="text-black font-medium">{dueDate}</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 mr-4 relative">
          {/* Status dropdown */}
          <button
            onClick={() => setOpen(!open)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
          >
            {status}
          </button>
          {open && (
            <div className="absolute top-full mt-2 bg-white border border-gray-200 shadow-md rounded-md z-10 w-32">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setOpen(false);
                    onStatusChange(s);
                  }}
                  className={`block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 ${
                    s === status ? 'font-bold bg-gray-100' : ''
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <p className="text-black text-base font-normal mt-1">
            Owner: <span className="font-semibold text-black">{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [display, setDisplay] = useState<'List' | 'Kanban'>('List');
  const [showOptions, setShowOptions] = useState(false);

  const [projects, setProjects] = useState<Project[]>([
    {
      title: 'XopunTask Frontend',
      owner: 'Sakil',
      dueDate: '2023-10-01',
      status: 'In Progress',
    },
    {
      title: 'Admin Panel UI',
      owner: 'Ripon',
      dueDate: '2023-10-10',
      status: 'Completed',
    },
    {
      title: 'Backend API Integration',
      owner: 'Sudeep',
      dueDate: '2023-10-15',
      status: 'Pending',
    },
  ]);

  const updateStatusAPI = (title: string, newStatus: ProjectStatus): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.1 ? resolve() : reject(new Error("Network error"));
      }, 1000);
    });
  };

  const handleStatusChange = async (index: number, newStatus: ProjectStatus) => {
    const { title } = projects[index];
    toast.promise(
      updateStatusAPI(title, newStatus),
      {
        loading: `Updating status for "${title}"...`,
        success: `"${title}" updated to ${newStatus}`,
        error: `Failed to update "${title}"`,
      }
    ).then(() => {
      const updated = [...projects];
      updated[index].status = newStatus;
      setProjects(updated);
    });
  };
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
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                {...project}
                onStatusChange={(newStatus) => handleStatusChange(index, newStatus)}
              />
            ))}
          </div>
        )}

        {display === 'Kanban' && (
          <Kanban project={projects}/>
        )}
      </div>
      {openModal && (
        <CreateProjectModal closeModal={setOpenModal} />
      )}
    </div>
  );
};

export default Projects;
