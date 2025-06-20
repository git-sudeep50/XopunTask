import React, { useState } from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom'


interface ModalProps{
    closeModal:React.Dispatch<React.SetStateAction<boolean>>
}

const CreateProjectModal:React.FC<ModalProps> = ({closeModal}) => {
    
   
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
            <h2 className='text-xl font-semibold mb-4'>Create New Project</h2>
            <form>
            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Project Name</label>
                <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter project name'
                />
            </div>
            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Description</label>
                <textarea
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter project description'
                ></textarea>
            </div>
            <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Due Date</label>
                <input
                type='date'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />  
            </div>
            <button
                type='submit'
                className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
            >
                Create Project
            </button>
            </form>
        </div>
      
    </div>
  )
}

export default CreateProjectModal
