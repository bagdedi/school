import React from 'react';
import type { Scholarship } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';

const mockScholarships: Scholarship[] = [
  { id: 'SCH01', name: 'STEM Excellence Grant', amount: 5000, eligibility: 'Grade 12, STEM Major', status: 'Active' },
  { id: 'SCH02', name: 'Future Leaders Award', amount: 7500, eligibility: 'All Grades, Leadership Experience', status: 'Active' },
  { id: 'SCH03', name: 'Creative Arts Scholarship', amount: 3000, eligibility: 'Art or Music Students', status: 'Inactive' },
  { id: 'SCH04', name: 'Athletic Achievement Scholarship', amount: 4000, eligibility: 'Varsity Team Members', status: 'Active' },
];

const ScholarshipCard: React.FC<{ scholarship: Scholarship }> = ({ scholarship }) => {
  const statusColor = scholarship.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const buttonText = scholarship.status === 'Active' ? 'View Applications' : 'View Details';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800">{scholarship.name}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>{scholarship.status}</span>
        </div>
        <p className="text-2xl font-light text-indigo-600 mt-2">${scholarship.amount.toLocaleString()}</p>
        <p className="text-sm text-gray-600 mt-4"><span className="font-semibold">Eligibility:</span> {scholarship.eligibility}</p>
      </div>
      <button className="w-full mt-6 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
        {buttonText}
      </button>
    </div>
  );
};

const ScholarshipPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Scholarship Management</h1>
          <p className="mt-1 text-gray-600">View and manage scholarship information.</p>
        </div>
         <button className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          <PlusIcon />
          <span className="ml-2">Create Scholarship</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockScholarships.map(scholarship => (
          <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>
    </div>
  );
};

export default ScholarshipPage;