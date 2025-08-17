import React, { useState, useEffect } from 'react';
import type { Student } from '../../types';

interface StudentFormProps {
  student: Student | null;
  onSave: (studentData: Omit<Student, 'id' | 'avatar'>) => void;
  onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        grade: String(student.grade),
      });
    } else {
      setFormData({ name: '', email: '', grade: '' });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.grade) {
        alert("Please fill all fields.");
        return;
    }
    onSave({
      name: formData.name,
      email: formData.email,
      grade: Number(formData.grade),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
       <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
       <div>
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
        <input
          type="number"
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {student ? 'Save Changes' : 'Add Student'}
        </button>
      </div>
    </form>
  );
};