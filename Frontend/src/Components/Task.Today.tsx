import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../utils/contsant';
import TodayTaskCard from './Today.Task.Card';

const TaskToday = () => {
  const { email } = useSelector((state: any) => state.user);
  const [tasks, setTasks] = useState([]);
  const date = new Date().toISOString().split('T')[0];

  const getTaskToday = async () => {
    try {
      const response = await axios.get(`${BASE_URL}tasks/assigned-tasks/${email}/${date}`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
    }
  };

  useEffect(() => {
    getTaskToday();
  }, [date]);

  return (
    <div className="w-full mx-auto">
      {tasks.length > 0 ? (
        <div className="mb-3">
          {tasks.map((task: any) => (
            <TodayTaskCard key={task.tid} task={task} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No tasks assigned today.</p>
      )}
    </div>
  );
};

export default TaskToday;
