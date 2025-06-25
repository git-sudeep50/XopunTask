import axios from "axios";
import { BASE_URL } from "../utils/contsant";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaClipboardList, FaChevronDown, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";

interface TaskCardProps {
  task: {
    taskId: string;
    tname: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
  };
  member: any[]; // Ideally: Array<{ projectId: string; user: { uname: string } }>
  refresh: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, member, refresh }) => {
  const { taskId, tname, description, dueDate, priority, status } = task;
  const [members, setMembers] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openAssignedMember, setOpenAssignedMember] = useState<boolean>(false);
const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { email } = useSelector((state: any) => state.user);

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

  useEffect(() => {
    const names = member.map((e) => e.user.uname);
    setMembers(names);
  }, [member]);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    try {
      const res = await axios.patch(
        `${BASE_URL}tasks/update-task/${taskId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(`Status updated to ${newStatus}`);
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
    <div className="relative bg-white shadow-md rounded-xl border p-5 space-y-4 hover:shadow-xl transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-indigo-500 shadow-md">
          <FaClipboardList />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{tname}</h3>
      </div>

      <p className="text-sm text-gray-600 line-clamp-3">{description}</p>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">
          📅 {new Date(dueDate).toLocaleDateString()}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${priorityColors[priority]}`}
        >
          {priority}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[currentStatus]} transition`}
          >
            {currentStatus}
            <FaChevronDown className="text-[10px]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {allStatuses
                .filter((s) => s !== currentStatus)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className="block w-full px-4 py-2 ml-7 text-left text-sm hover:bg-gray-100"
                  >
                    {s}
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold text-gray-500">Assigned to:</p>
          <div className="flex items-center gap-1">
            
            <button
              onClick={() => setOpenAssignedMember((prev) => !prev)}
              className="text-sm text-indigo-600 hover:underline"
            >
             <FaUser className="text-blue-600" />
            </button>
             {selectedMembers.length > 0
                ? selectedMembers.join(", ")
                : "None"}
          </div>
        </div>
      </div>

      {openAssignedMember && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-3 space-y-2">
            {members.map((memberName, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(memberName)}
                  onChange={() => {
                    setSelectedMembers((prev) =>
                      prev.includes(memberName)
                        ? prev.filter((m) => m !== memberName)
                        : [...prev, memberName]
                    );
                  }}
                />
                {memberName}
              </label>
            ))}
          </div>
        </div>

      )}
    </div>
  );
};

export default TaskCard;
