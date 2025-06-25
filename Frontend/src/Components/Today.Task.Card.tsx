import React from 'react';
import { FaClipboardList } from 'react-icons/fa';

interface Task {
  tid: string;
  tname: string;
  description: string;
  startDate: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ASSIGNED' | 'PROGRESS' | 'COMPLETED' | 'EXCEEDED';
  ownerId: string;
  projectId: string;
}

interface TodayTaskCardProps {
  task: Task;
}

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-800',
  PROGRESS: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-red-100 text-red-800',
  EXCEEDED: 'bg-gray-100 text-red-600',
};

const priorityColors: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700',
};

const TodayTaskCard: React.FC<TodayTaskCardProps> = ({ task }) => {
  return (
    <div className="bg-white border border-gray-300 h-fit rounded-md shadow-md p-4 hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg">
          <FaClipboardList />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{task.tname}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      <div className="text-sm text-gray-500 mb-1">
        📅 Start: {new Date(task.startDate).toLocaleDateString()}
      </div>
      <div className="text-sm text-gray-500 mb-2">
        ⏰ Due: {new Date(task.dueDate).toLocaleDateString()}
      </div>
      <div className="flex justify-between items-center text-xs mt-2">
        <span className={`px-2 py-1 rounded-full font-semibold ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded-full font-semibold ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>
    </div>
  );
};

export default TodayTaskCard;
