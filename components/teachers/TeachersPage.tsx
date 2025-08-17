import React, { useState } from 'react';
import type { Teacher } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { Modal } from '../common/Modal';
import { TeacherForm } from './TeacherForm';

const mockTeachers: Teacher[] = [
  { id: 'T01', name: 'Dr. Eleanor Vance', subject: 'Physics', email: 'eleanor.v@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t01' },
  { id: 'T02', name: 'Mr. Samuel Reed', subject: 'History', email: 'samuel.r@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t02' },
  { id: 'T03', name: 'Ms. Clara Oswald', subject: 'English Literature', email: 'clara.o@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t03' },
  { id: 'T04', name: 'Mr. Alan Turing', subject: 'Computer Science', email: 'alan.t@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t04' },
  { id: 'T05', name: 'Dr. Rosalind Franklin', subject: 'Chemistry', email: 'rosalind.f@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t05' },
  { id: 'T06', name: 'Mr. David Attenborough', subject: 'Biology', email: 'david.a@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=t06' },
];

const TeacherCard: React.FC<{ teacher: Teacher, onEdit: (teacher: Teacher) => void; onDelete: (teacherId: string) => void; }> = ({ teacher, onEdit, onDelete }) => (
  <div className="relative bg-white rounded-xl shadow-md p-6 text-center flex flex-col items-center transform hover:-translate-y-1 transition-transform">
    <div className="absolute top-2 right-2 flex space-x-1">
        <button
            onClick={() => onEdit(teacher)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Edit ${teacher.name}`}
        >
            <PencilIcon />
        </button>
        <button
            onClick={() => onDelete(teacher.id)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Delete ${teacher.name}`}
        >
            <TrashIcon />
        </button>
    </div>
    <img src={teacher.avatar} alt={teacher.name} className="w-24 h-24 rounded-full mb-4 mt-8 ring-4 ring-indigo-200" />
    <h3 className="text-lg font-bold text-gray-800">{teacher.name}</h3>
    <p className="text-indigo-600 font-semibold">{teacher.subject}</p>
    <p className="text-sm text-gray-500 mt-2">{teacher.email}</p>
  </div>
);

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

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
  
  const handleSaveTeacher = (teacherData: Omit<Teacher, 'id' | 'avatar'> & { id?: string }) => {
    if (editingTeacher) {
      // Update existing teacher
      setTeachers(
        teachers.map((t) =>
          t.id === editingTeacher.id ? { ...t, ...teacherData } : t
        )
      );
    } else {
      // Add new teacher
      const newTeacher: Teacher = {
        id: `T${String(teachers.length + 1).padStart(2, '0')}`,
        ...teacherData,
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      };
      setTeachers([...teachers, newTeacher]);
    }
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teachers.map(teacher => (
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