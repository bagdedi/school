import React, { useState } from 'react';
import type { Teacher } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { Modal } from '../common/Modal';
import { TeacherForm } from './TeacherForm';
import { EyeIcon } from '../icons/EyeIcon';
import { TeacherDetailsModal } from './TeacherDetailsModal';

interface TeachersPageProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherCard: React.FC<{ 
  teacher: Teacher;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacherId: string) => void;
  onDetails: (teacher: Teacher) => void;
}> = ({ teacher, onEdit, onDelete, onDetails }) => (
  <div className="bg-white rounded-xl shadow-md p-6 text-center flex flex-col items-center transform hover:-translate-y-1 transition-transform">
    <img src={teacher.avatar} alt={`${teacher.firstName} ${teacher.lastName}`} className="w-24 h-24 rounded-full mb-4 ring-4 ring-indigo-200" />
    <h3 className="text-lg font-bold text-gray-800">{`${teacher.firstName} ${teacher.lastName}`}</h3>
    <p className="text-indigo-600 font-semibold">{teacher.specialty}</p>
    <p className="text-sm text-gray-500 mt-2">{teacher.email}</p>
    <div className="mt-auto pt-4 border-t border-gray-100 w-full flex justify-center space-x-2">
       <button
            onClick={() => onDetails(teacher)}
            className="p-2.5 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            title="Détails"
            aria-label={`Détails de ${teacher.firstName} ${teacher.lastName}`}
        >
            <EyeIcon />
        </button>
        <button
            onClick={() => onEdit(teacher)}
            className="p-2.5 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            title="Modifier"
            aria-label={`Modifier ${teacher.firstName} ${teacher.lastName}`}
        >
            <PencilIcon />
        </button>
        <button
            onClick={() => onDelete(teacher.id)}
            className="p-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            title="Supprimer"
            aria-label={`Supprimer ${teacher.firstName} ${teacher.lastName}`}
        >
            <TrashIcon />
        </button>
    </div>
  </div>
);

const TeachersPage: React.FC<TeachersPageProps> = ({ teachers, setTeachers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [teacherForDetails, setTeacherForDetails] = useState<Teacher | null>(null);

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };
  
  const handleDetailsClick = (teacher: Teacher) => {
    setTeacherForDetails(teacher);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
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
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Enseignants</h1>
            <p className="mt-1 text-gray-600">Gérez les dossiers de vos enseignants ici.</p>
          </div>
          <button 
            onClick={handleAddTeacher}
            className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon />
            <span className="ml-2">Ajouter un enseignant</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <input
            type="search"
            placeholder="Rechercher par nom, email, ou matière..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Toutes les matières</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        {selectedSubject && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-md">
                <p className="font-bold">
                    {filteredTeachers.length} enseignant(s) trouvé(s) pour la matière : {selectedSubject}
                </p>
            </div>
        )}


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map(teacher => (
            <TeacherCard 
              key={teacher.id} 
              teacher={teacher} 
              onEdit={handleEditTeacher}
              onDelete={handleDeleteTeacher}
              onDetails={handleDetailsClick}
            />
          ))}
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? 'Modifier Enseignant' : 'Ajouter un nouvel enseignant'}
        size="4xl"
      >
        <TeacherForm
          teacher={editingTeacher}
          onSave={handleSaveTeacher}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {isDetailsModalOpen && teacherForDetails && (
        <TeacherDetailsModal
            teacher={teacherForDetails}
            onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </>
  );
};

export default TeachersPage;