import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/contsant';

interface CreateTaskModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void; 
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ projectId, uname, onClose, onSuccess }) => {
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    startDate: new Date().toISOString().slice(0, 10), // today
    dueDate: '',
    priority: 'HIGH',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}tasks/create-task`,
        {
          taskName: newTask.taskName,
          description: newTask.description,
          startDate: newTask.startDate, 
          dueDate: newTask.dueDate,
          status: 'ASSIGNED',
          priority: newTask.priority,
          projectId,
          ownerId: uname[1],
        },
        { withCredentials: true }
      );
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
          <input
            type="text"
            placeholder="Task name"
            value={newTask.taskName}
            onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            rows={3}
            className="w-full border rounded p-2"
          />    

           <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={newTask.startDate}
            onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="w-full border rounded p-2"
          >
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
