import axios from 'axios';
import React, { useState } from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/contsant';
import toast, { Toaster } from 'react-hot-toast';


interface ModalProps{
    closeModal:React.Dispatch<React.SetStateAction<boolean>>
}

const JoinProject:React.FC<ModalProps> = ({closeModal}) => {
   const [projectId, setProjectId] = useState<string>('');

    const {email}=useSelector((state:any) => state.user);

    const handleJoinProject=async()=>{
        const projectData={
            projectId,
            memberId: email,
        }
        console.log("Project Data: ", projectData);
        const response=await axios.post(BASE_URL+"tasks/join-project",projectData,{withCredentials:true});
        if(response.status===200){
            toast.success("Project joined successfully");
            closeModal(false);
        }
    }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <button
                className='ml-80 mt-0 text-2xl hover:text-gray-700'
                onClick={()=> {console.log("close modal");
                
                    closeModal(false)}}
            >
                <IoIosCloseCircleOutline />
            </button>
            <h2 className='text-xl font-semibold mb-4'>Join Project</h2>
            <p className='mb-3 text-gray-700'>You may get a Project Id in your email.Check your inbox or spam folder.</p>
            <form>
            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Project ID</label>
                <input
                type='text'
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter The Project ID'
                />
            </div>
           
            
            <button
                type='submit'
                className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                onClick={handleJoinProject}
            >
                Join Project
            </button>
            </form>
        </div>
      
    </div>
  )
}

export default JoinProject
