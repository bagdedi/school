import React, { useState } from 'react';
import type { Student } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { Modal } from '../common/Modal';
import { StudentForm } from './StudentForm';

const mockStudents: Student[] = [
  { id: 'S001', name: 'Olivia Chen', grade: 11, email: 'olivia.c@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'S002', name: 'Benjamin Carter', grade: 12, email: 'ben.c@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { id: 'S003', name: 'Sophia Rodriguez', grade: 10, email: 'sophia.r@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
  { id: 'S004', name: 'Liam Goldberg', grade: 11, email: 'liam.g@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
  { id: 'S005', name: 'Ava Nguyen', grade: 9, email: 'ava.n@northwood.edu', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d' },
];

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter((student) => student.id !== studentId));
    }
  };
  
  const handleSaveStudent = (studentData: Omit<Student, 'id' | 'avatar'> & { id?: string }) => {
    if (editingStudent) {
      // Update existing student
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id ? { ...s, ...studentData } : s
        )
      );
    } else {
      // Add new student
      const newStudent: Student = {
        id: `S${String(students.length + 1).padStart(3, '0')}`,
        ...studentData,
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      };
      setStudents([...students, newStudent]);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };


  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Students</h1>
            <p className="mt-1 text-gray-600">Manage your student records here.</p>
          </div>
          <button
            onClick={handleAddStudent}
            className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon />
            <span className="ml-2">Add Student</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Student ID</th>
                <th className="py-3 px-4 font-semibold">Grade</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-4" />
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{student.id}</td>
                  <td className="py-3 px-4">{student.grade}</td>
                  <td className="py-3 px-4">{student.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={`Edit ${student.name}`}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={`Delete ${student.name}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <StudentForm
          student={editingStudent}
          onSave={handleSaveStudent}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default StudentsPage;