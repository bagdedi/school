import React from 'react';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { ScholarshipIcon } from '../icons/ScholarshipIcon';
import { CalendarIcon } from '../icons/CalendarIcon';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin!</h1>
        <p className="mt-1 text-gray-600">Here's a snapshot of your school's activities today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<UserGroupIcon />} title="Total Students" value="1,250" color="border-blue-500" />
        <StatCard icon={<AcademicCapIcon />} title="Total Teachers" value="85" color="border-green-500" />
        <StatCard icon={<ScholarshipIcon />} title="Active Scholarships" value="42" color="border-yellow-500" />
        <StatCard icon={<CalendarIcon />} title="Upcoming Events" value="5" color="border-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <div className="bg-green-100 text-green-700 p-2 rounded-full">
                <AcademicCapIcon className="h-5 w-5" />
              </div>
              <p className="text-sm text-gray-600"><span className="font-semibold">Dr. Eleanor Vance</span> was added to the Science department.</p>
              <span className="text-xs text-gray-400 ml-auto">2m ago</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                <UserGroupIcon className="h-5 w-5" />
              </div>
              <p className="text-sm text-gray-600"><span className="font-semibold">Mason Thompson</span>'s enrollment for Grade 10 was confirmed.</p>
               <span className="text-xs text-gray-400 ml-auto">1h ago</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="bg-yellow-100 text-yellow-700 p-2 rounded-full">
                <ScholarshipIcon className="h-5 w-5" />
              </div>
              <p className="text-sm text-gray-600">The "Future Innovators" scholarship applications are now open.</p>
               <span className="text-xs text-gray-400 ml-auto">1d ago</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
           <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Links</h2>
           <ul className="space-y-3">
             <li><a href="#" className="text-blue-600 hover:underline">Add New Student</a></li>
             <li><a href="#" className="text-blue-600 hover:underline">Generate Grade Reports</a></li>
             <li><a href="#" className="text-blue-600 hover:underline">View School Calendar</a></li>
             <li><a href="#" className="text-blue-600 hover:underline">Submit an Announcement</a></li>
           </ul>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
