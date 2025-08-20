import React, { useState } from 'react';
import type { Teacher } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { Modal } from '../common/Modal';
import { TeacherForm } from './TeacherForm';
import { mockTeachers } from '../timetable/mockData';


const TeacherCard: React.FC<{ teacher: Teacher, onEdit: (teacher: Teacher) => void; onDelete: (teacherId: string) => void; }> = ({ teacher, onEdit, onDelete }) => (
  <div className="relative bg-white rounded-xl shadow-md p-6 text-center flex flex-col items-center transform hover:-translate-y-1 transition-transform">
    <div className="absolute top-2 right-2 flex space-x-1">
        <button
            onClick={() => onEdit(teacher)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Edit ${teacher.firstName} ${teacher.lastName}`}
        >
            <PencilIcon />
        </button>
        <button
            onClick={() => onDelete(teacher.id)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Delete ${teacher.firstName} ${teacher.lastName}`}
        >
            <TrashIcon />
        </button>
    </div>
    <img src={teacher.avatar} alt={`${teacher.firstName} ${teacher.lastName}`} className="w-24 h-24 rounded-full mb-4 mt-8 ring-4 ring-indigo-200" />
    <h3 className="text-lg font-bold text-gray-800">{`${teacher.firstName} ${teacher.lastName}`}</h3>
    <p className="text-indigo-600 font-semibold">{teacher.specialty}</p>
    <p className="text-sm text-gray-500 mt-2">{teacher.email}</p>
  </div>
);

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
    }
  };
  
  const handleSaveTeacher = (teacherData: Omit<Teacher, 'id' | 'avatar' | 'photoUrl' | 'matricule'>) => {
    if (editingTeacher) {
      // Update existing teacher
      setTeachers(
        teachers.map((t) =>
          t.id === editingTeacher.id ? { ...t, ...teacherData, matricule: t.matricule } : t
        )
      );
    } else {
      // Add new teacher
      const newTeacher: Teacher = {
        id: `T${String(teachers.length + 1).padStart(2, '0')}`,
        matricule: `T2024${String(teachers.length + 1).padStart(3, '0')}`,
        ...teacherData,
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      };
      setTeachers([...teachers, newTeacher]);
    }
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const uniqueSubjects = [...new Set(teachers.map(t => t.specialty))].sort();
  
  const filteredTeachers = teachers.filter(teacher => {
    const searchMatch =
      `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const subjectMatch = selectedSubject ? teacher.specialty === selectedSubject : true;

    return searchMatch && subjectMatch;
  });

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
            <p className="mt-1 text-gray-600">Manage your teacher records here.</p>
          </div>
          <button 
            onClick={handleAddTeacher}
            className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon />
            <span className="ml-2">Add Teacher</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <input
            type="search"
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map(teacher => (
            <TeacherCard 
              key={teacher.id} 
              teacher={teacher} 
              onEdit={handleEditTeacher}
              onDelete={handleDeleteTeacher}
            />
          ))}
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
        size="4xl"
      >
        <TeacherForm
          teacher={editingTeacher}
          onSave={handleSaveTeacher}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default TeachersPage;