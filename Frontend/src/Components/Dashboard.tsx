import React from 'react';
import { Briefcase, CheckCircle, Clock } from 'lucide-react'; // Icons (optional, from lucide-react)
import { useSelector } from 'react-redux';

const Dashboard: React.FC = () => {

  const {email,userName}=useSelector((state:any) => state.user);


  const statistics = [
    { title: 'Tasks Completed', icon:  <CheckCircle size={18} />, count: 24, days: 2 },
    { title: 'Tasks Pending', icon: <Clock size={18}/>, count: 10, days: 5 },
    { title: 'In Progress', icon: <Briefcase size={18} />, count: 7, days: 3 },
  ];

  const StatisticCard = (title: string, icon: string, count: number, days: number) => (
    <div className="bg-white h-32 flex flex-col items-center justify-center rounded-lg shadow-md p-4">
      <div className="text-2xl">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      
      <p className="text-2xl font-bold text-gray-800">{count}</p>
      <p className="text-sm text-gray-500">{days} days left</p>
    </div>
  );

  return (
    <div className="flex flex-col relative h-full w-full max-w-6xl mx-auto p-6 bg-gray-100 rounded-xl shadow-lg">
     
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{`Hello ${userName} 👋`}</h1>
        <p className="text-gray-500">Welcome back to your task dashboard!</p>
      </div>

      <p className="font-bold text-xl mb-3">Statistics</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {statistics.map((stat, index) => (
          <div key={index}>{StatisticCard(stat.title, stat.icon, stat.count, stat.days)}</div>
        ))}
      </div>

      <p className="font-bold text-xl mb-3">Projects</p>
      <div className="grid grid-cols-1 mb-3 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-lg shadow-md">
          <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <Briefcase size={18} /> Ongoing Projects
          </h2>
          <p className="text-gray-600">You have 3 ongoing projects.</p>
          <p className="text-sm text-gray-500 mt-2">3 days left</p>
        </div>

        <div className="p-5 bg-white rounded-lg shadow-md">
          <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <CheckCircle size={18} /> Projects Completed
          </h2>
          <p className="text-gray-600">You've completed 12 projects.</p>
          <p className="text-sm text-gray-500 mt-2">Nice work!</p>
        </div>

        <div className="p-5 bg-white rounded-lg shadow-md">
          <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <Clock size={18} /> Pending Projects
          </h2>
          <p className="text-gray-600">You have 2 pending projects.</p>
          <p className="text-sm text-gray-500 mt-2">5 days remaining</p>
        </div>
      </div>
            <p className="font-bold text-xl mb-3">Task Today</p>
        <div className='overflow-y-scroll h-96 bg-black'>

        </div>

    </div>
  );
};

export default Dashboard;
