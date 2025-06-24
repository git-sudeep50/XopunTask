// TaskCard.tsx
import axios from "axios";
import { BASE_URL } from "../utils/contsant";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaClipboardList } from "react-icons/fa";

interface TaskCardProps {
  task: {
    taskId: string;
    taskName: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
  };
  refresh: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, refresh }) => {
  const { taskId, taskName, description, dueDate, priority, status } = task;

  const [currentStatus, setCurrentStatus] = useState(status);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statusColors: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-800",
    PROGRESS: "bg-yellow-100 text-yellow-800",
    ASSIGNED: "bg-red-100 text-red-800",
    EXCEEDED: "bg-gray-100 text-red-600",
  };

  const priorityColors: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-green-100 text-green-700",
  };

  const allStatuses = ["ASSIGNED", "PROGRESS", "COMPLETED", "EXCEEDED"];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    try {
      const res = await axios.patch(
        `${BASE_URL}tasks/update-task/${taskId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(`Task status updated to ${newStatus}`);
        setCurrentStatus(newStatus);
        refresh();
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative bg-gray-50 shadow-lg rounded-lg border border-gray-300 p-4 space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl bg-indigo-500">
          <FaClipboardList />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{taskName}</h3>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center text-sm mt-3">
        <span className="text-gray-500">
          📅 {new Date(dueDate).toLocaleDateString()}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[priority]}`}
        >
          {priority}
        </span>
      </div>
      <div className="flex justify-end relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[currentStatus]}`}
        >
          {currentStatus}
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded shadow z-50">
            {allStatuses
              .filter((s) => s !== currentStatus)
              .map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {s}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
