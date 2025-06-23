import axios from "axios";
import { BASE_URL } from "../utils/contsant";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaClipboardList } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router-dom";

interface ProjectCardProps {
  item: {
    projectId: string;
    project: {
      pname: string;
      owner: {
        uname: string;
        uid: string;
      };
      dueDate: string;
      status: string;
    };
  };
  role?: string;
}


const ProjectCard: React.FC<ProjectCardProps & { projectId: string; refresh: () => void }> = ({
  item,
  refresh,
}) => {
  const projectId = item.projectId;
  const pname = item.project.pname;
  const uname = [item.project.owner.uname, item.project.owner.uid];
  const dueDate = item.project.dueDate
    ? new Date(item.project.dueDate).toISOString().split('T')[0]
    : '';
  const status = item.project.status;

  const [currentStatus, setCurrentStatus] = useState(status);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const statusColors = {
    'COMPLETED': 'bg-green-100 text-green-800',
    'PROGRESS': 'bg-yellow-100 text-yellow-800',
    'ASSIGNED': 'bg-red-100 text-red-800',
    'EXCEEDED': 'bg-gray-100 text-red-600',
  };
  console.log(uname[1]);
  
  const allStatuses = ['ASSIGNED', 'PROGRESS', 'COMPLETED', 'EXCEEDED'];
  const {email}=useSelector((state:any) => state.user);
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    try {
      const response = await axios.patch(BASE_URL + `tasks/update-project/${projectId}`, {
        // pid: projectId,
        status:newStatus,
      });
      if (response.status === 200) {
        toast.success(`Successfully updated to ${newStatus}`);
        setCurrentStatus(newStatus);
        setIsDropdownOpen(false);
        refresh();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="relative cursor-pointer h-fit bg-gray-50 shadow-2xl rounded-lg w-full mb-4 border border-gray-700"
      // onClick={() => {
      //   navigate(`/home/project/${projectId}`, { state: { item: item } });
      // }}
    >
      <div className='flex justify-between items-center'>
        <div  onClick={() => {
        navigate(`/home/project/${projectId}`, { state: { item: item } });
       }}>
          <div className="flex ml-2 mt-2 items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl bg-pink-500">
              <FaClipboardList />
            </div>
            <div className="text-sm font-bold text-black">{pname}</div>
          </div>
          <p className="text-black text-base font-normal ml-2 mb-1">
            Due Date: <span className="text-black font-medium">{dueDate}</span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 mr-4 relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[currentStatus]}`}
          >
            {currentStatus}
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded shadow z-50">
              {allStatuses.filter(s => s !== currentStatus).map((s) => (

                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <p className="text-black text-base font-normal mt-1">
            Owner: <span className="font-semibold text-black">{uname[1]===email? <span className="text-green-500">You</span> : uname[0]}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ProjectCard;