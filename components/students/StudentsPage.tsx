import React, { useState, useMemo } from 'react';
import type { Student, Classe, SharedFilterState } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { Modal } from '../common/Modal';
import { StudentForm } from './StudentForm';

interface StudentsPageProps {
  optionalSubjects: string[];
  classes: Classe[];
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  filters: SharedFilterState;
  onFilterChange: (filterName: keyof SharedFilterState, value: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onResetFilters: () => void;
}

const StudentsPage: React.FC<StudentsPageProps> = ({ 
  optionalSubjects, 
  classes, 
  students, 
  setStudents,
  filters,
  onFilterChange,
  searchQuery,
  setSearchQuery,
  onResetFilters,
}) => {
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      setStudents(students.filter((student) => student.id !== studentId));
    }
  };
  
  const handleSaveStudent = (studentData: Omit<Student, 'id' | 'avatar' | 'photoUrl' | 'matricule'>) => {
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
        matricule: `S2024${String(students.length + 1).padStart(3, '0')}`,
        ...studentData,
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      };
      setStudents([...students, newStudent]);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const uniqueNiveaux = useMemo(() => [...new Set(classes.map(c => c.niveau))].sort(), [classes]);
  
  const availableSpecialites = useMemo(() => {
    if (!filters.niveau) {
      return [...new Set(classes.map(c => c.specialite))].sort();
    }
    return [...new Set(classes.filter(c => c.niveau === filters.niveau).map(c => c.specialite))].sort();
  }, [filters.niveau, classes]);

  const availableClasses = useMemo(() => {
    if (!filters.niveau || !filters.specialite) {
      return [];
    }
    return classes
      .filter(c => c.niveau === filters.niveau && c.specialite === filters.specialite)
      .map(c => c.name)
      .sort();
  }, [filters.niveau, filters.specialite, classes]);


  const filteredStudents = students.filter(student => {
    const searchMatch =
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchQuery.toLowerCase());
    
    const niveauMatch = filters.niveau ? student.academicLevel === filters.niveau : true;
    const specialiteMatch = filters.specialite ? student.academicSpecialty === filters.specialite : true;
    const classeMatch = filters.classe ? student.classe === filters.classe : true;

    return searchMatch && niveauMatch && specialiteMatch && classeMatch;
  });


  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Étudiants</h1>
            <p className="mt-1 text-gray-600">Gérez les dossiers de vos étudiants ici.</p>
          </div>
          <button
            onClick={handleAddStudent}
            className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon />
            <span className="ml-2">Ajouter un étudiant</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="search"
            placeholder="Rechercher par nom ou matricule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:col-span-2 lg:col-span-1"
          />
          <select
            value={filters.niveau}
            onChange={(e) => onFilterChange('niveau', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tous les Niveaux</option>
            {uniqueNiveaux.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <select
            value={filters.specialite}
            onChange={(e) => onFilterChange('specialite', e.target.value)}
            disabled={!filters.niveau}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          >
            <option value="">Toutes les Spécialités</option>
            {availableSpecialites.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <select
            value={filters.classe}
            onChange={(e) => onFilterChange('classe', e.target.value)}
            disabled={!filters.niveau || !filters.specialite}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          >
            <option value="">Toutes les Classes</option>
            {availableClasses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-4 font-semibold">Nom</th>
                <th className="py-3 px-4 font-semibold">Matricule</th>
                <th className="py-3 px-4 font-semibold">Niveau</th>
                <th className="py-3 px-4 font-semibold">Spécialité</th>
                <th className="py-3 px-4 font-semibold">Classe</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} className="w-10 h-10 rounded-full mr-4" />
                      <span>{`${student.firstName} ${student.lastName}`}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{student.matricule}</td>
                  <td className="py-3 px-4">{student.academicLevel}</td>
                  <td className="py-3 px-4">{student.academicSpecialty}</td>
                  <td className="py-3 px-4">{student.classe || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={`Modifier ${student.firstName} ${student.lastName}`}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={`Supprimer ${student.firstName} ${student.lastName}`}
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
        title={editingStudent ? 'Modifier Étudiant' : 'Ajouter un nouvel étudiant'}
        size="4xl"
      >
        <StudentForm
          student={editingStudent}
          onSave={handleSaveStudent}
          onCancel={() => setIsModalOpen(false)}
          optionalSubjects={optionalSubjects}
          classes={classes}
        />
      </Modal>
    </>
  );
};

export default StudentsPage;