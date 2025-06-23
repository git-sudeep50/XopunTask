import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../utils/contsant';
import { Plus } from 'lucide-react';
import axios from 'axios';

const ProjectDetails = () => {
  const location = useLocation();
  const projectId = location.pathname.split('/').pop();
  const { item } = location.state || {};

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [openAddMemberModal, setOpenAddMemberModal] = useState<boolean>(false);
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  //const [newMemberRole, setNewMemberRole] = useState<string>('');
  const handleAddMember = () => {
    console.log(`Adding member to project with ID: ${projectId}`);
  };

  const handleCreateTask = () => {
    console.log(`Creating task for project ID: ${projectId}`);
  };

  

  const handleSendInvitation=async()=>{
    try{
        const response=await axios.post(`${BASE_URL}tasks/send-project-invitation`,{to:newMemberEmail,projectId:projectId},{withCredentials:true});

    }
    catch(e){
        console.error(e.error);
    }
  }


  
  const getTask = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks/${projectId}`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getMember = async () => {
    try {
      const response = await axios.get(`${BASE_URL}tasks/project-members/${projectId}`);
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
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 border">
          <h1 className="text-3xl font-bold mb-4 text-gray-800"> Project Details</h1>

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

        



        <div className="w-full md:w-80 bg-white shadow-md rounded-lg p-4 border">
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
                  <p className="text-sm text-purple-600 font-medium">{member.role}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No members found.</p>
            )}
          </div>
        </div>
      </div>



      <div className="mt-10 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Tasks</h2>

        {tasks.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {tasks.map((task: any) => (
              <div
                key={task.taskId}
                className="bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-sm"
              >
                <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No tasks found for this project.</p>
        )}

        <button
          onClick={handleCreateTask}
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
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            required
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            <option value="DEVELOPER">Developer</option>
            <option value="DESIGNER">Designer</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div> */}
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


    </div>
  );
};

export default ProjectDetails;
