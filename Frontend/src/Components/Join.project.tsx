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
    
   const [title, setTitle] = useState<string>('');
   const [description, setDescription] = useState<string>('');
   const [endDate, setEndDate] = useState<string>('');
    const {email}=useSelector((state:any) => state.user);

    const handleCreateProject=async()=>{
        const projectData={
            title,
            description,
            endDate,
            userId: email,
        }
        console.log("Project Data: ", projectData);
        const response=await axios.post(BASE_URL+"tasks/create-project",projectData,{withCredentials:true});
        if(response.status===200){
            toast.success("Project created successfully");
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
            <form>
            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Project ID</label>
                <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter The Project ID'
                />
            </div>
            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Description</label>
                <textarea
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter project description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Due Date</label>
                <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />  
            </div>
            <button
                type='submit'
                className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                onClick={handleCreateProject}
            >
                Create Project
            </button>
            </form>
        </div>
      
    </div>
  )
}

export default JoinProject
