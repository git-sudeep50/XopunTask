import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../utils/contsant';
import { Plus, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import CreateTaskModal from './Create.Task.Modal';
import { FaClipboardList, FaThLarge } from 'react-icons/fa';
import TaskKanban from './Task.Kanban';
import TaskCard from './TaskCard';

const ProjectDetails = () => {
  const location = useLocation();
  const projectId = location.pathname.split('/').pop();
  const { item } = location.state || {};

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);

  const [display, setDisplay] = useState<'List' | 'Kanban'>('List');
  const [showOptions, setShowOptions] = useState(false);

  const handleSendInvitation = async () => {
    try {
      await axios.post(
        `${BASE_URL}tasks/send-project-invitation`,
        { to: newMemberEmail, projectId },
        { withCredentials: true }
      );
      setOpenAddMemberModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const getTask = async () => {
    try {
      const response = await axios.get(`${BASE_URL}tasks/project-tasks/${projectId}`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getMember = async () => {
    try {
      const response = await axios.get(`${BASE_URL}tasks/project-members/${projectId}`,{withCredentials:true});
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    getTask();
    getMember();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex h-72 flex-col md:flex-row gap-3">
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 border">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Project Details</h1>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">
              Title: <span className="font-medium text-black">{item?.project?.pname}</span>
            </h2>
            <p className="text-gray-600">
              Description:{' '}
              <span className="font-medium text-black">
                {item?.project?.description || 'N/A'}
              </span>
            </p>
            <p className="text-gray-600">
              Due Date:{' '}
              <span className="font-medium text-black">
                {item?.project?.dueDate
                  ? new Date(item.project.dueDate).toLocaleDateString()
                  : 'Not set'}
              </span>
            </p>
          </div>
          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setOpenAddMemberModal(true)}
          >
            ➕ Add Member
          </button>
        </div>

        <div className="w-full md:w-80 bg-white shadow-md overflow-x-auto rounded-lg p-4 border">
          <h2 className="text-xl font-bold text-gray-800 mb-3">👥 Project Members</h2>
          <div className="overflow-y-auto max-h-[400px] space-y-3 pr-2">
            {members.length > 0 ? (
              members.map((member: any, index: number) => (
                <div
                  key={index}
                  className="border p-3 rounded-md bg-gray-50 shadow-sm hover:bg-gray-100 transition"
                >
                  <p className="font-semibold text-gray-800">{member.user.uname}</p>
                  <p className="text-sm text-gray-600">{member.user.uid}</p>
                  <p
                    className={`text-sm ${
                      member.role === 'OWNER' ? 'text-green-600' : 'text-purple-400'
                    } font-medium`}
                  >
                    {member.role}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No members found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 relative">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold text-gray-800">📋 Tasks</h2>
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

       {tasks.length > 0 ? (
  display === "List" ? (
    <div className="h-[360px] max-h-[360px] overflow-y-scroll space-y-4 pr-2">
      {tasks.map((task: any) => (
        <TaskCard key={task.taskId} task={task} refresh={getTask} member={members} />
      ))}
    </div>
  ) : (
    <TaskKanban tasks={tasks} refresh={getTask} members={members} />


  )
) : (
  <p className="text-gray-500 italic">No tasks found.</p>
)}

        <button
          onClick={() => setOpenCreateTaskModal(true)}
          className="fixed bottom-10 right-10 flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </button>
      </div>

      {openAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpenAddMemberModal(false)}
              className="absolute top-2 right-3 text-gray-600 text-xl font-bold hover:text-red-500"
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add Project Member</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendInvitation();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openCreateTaskModal && (
        <CreateTaskModal
          projectId={projectId!}
          onClose={() => setOpenCreateTaskModal(false)}
          onSuccess={getTask}
          uname={[item?.project.owner.uname, item?.project.owner.uid]}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
