import React, { useState, useMemo } from 'react';
import type { Student, AttestationType } from '../../types';
import { FilterIcon } from '../icons/FilterIcon';
import { ResetIcon } from '../icons/ResetIcon';
import { AttestationSelectionModal } from './AttestationSelectionModal';

// This tells TypeScript that we expect `process` to be available in the global
// scope, as provided by the execution environment.
declare const process: any;

const mockAttestationStudents: Student[] = [
    { id: 'S001', matricule: '0046/2025', firstName: 'ali', lastName: 'amine', academicDiploma: 'Licences', academicSpecialty: 'business intelligence', academicLevel: '1ère Année', dateOfBirth: '2000-01-28', idNumber: '13456888', idType: 'CIN', email: '', gender: '', nationality: '', address: '', phone: '', placeOfBirth: '', studyLevel: '', bacYear: '', schoolYear: '2025/2026', avatar:'' },
    { id: 'S002', matricule: '0009/2025', firstName: 'aloui', lastName: 'hemi', academicDiploma: 'Licences', academicSpecialty: 'business intelligence', academicLevel: '2ème Année', dateOfBirth: '2001-03-15', idNumber: '12345678', idType: 'CIN', email: '', gender: '', nationality: '', address: '', phone: '', placeOfBirth: '', studyLevel: '', bacYear: '', schoolYear: '2025/2026', avatar:'' },
    { id: 'S003', matricule: '0030/2025', firstName: 'amine', lastName: 'ghada', academicDiploma: 'Licences', academicSpecialty: 'business information system', academicLevel: '3ème Année', dateOfBirth: '1999-11-20', idNumber: '87654321', idType: 'CIN', email: '', gender: '', nationality: '', address: '', phone: '', placeOfBirth: '', studyLevel: '', bacYear: '', schoolYear: '2025/2026', avatar:'' },
    { id: 'S004', matricule: '0015/2025', firstName: 'amor', lastName: 'mabrouk', academicDiploma: 'Licences', academicSpecialty: 'business information system', academicLevel: '2ème Année', dateOfBirth: '2001-07-22', idNumber: '11223344', idType: 'CIN', email: '', gender: '', nationality: '', address: '', phone: '', placeOfBirth: '', studyLevel: '', bacYear: '', schoolYear: '2025/2026', avatar:'' },
    { id: 'S005', matricule: '0022/2025', firstName: 'arfaoui', lastName: 'hamid', academicDiploma: 'Master', academicSpecialty: 'MBA', academicLevel: '1ère Année', dateOfBirth: '1998-02-10', idNumber: '44332211', idType: 'CIN', email: '', gender: '', nationality: '', address: '', phone: '', placeOfBirth: '', studyLevel: '', bacYear: '', schoolYear: '2025/2026', avatar:'' },
    { id: 'S006', matricule: '0047/2025', firstName: 'aroubi', lastName: 'hoyem', academicDiploma: 'Licences', academicSpecialty: 'business intelligence', academicLevel: '3ème Année', dateOfBirth: '1999-09-01', idNumber: '55667788', idType: 'CIN', email: '', gender: '', nationality: '', address: '', phone: '', placeOfBirth: '', studyLevel: '', bacYear: '', schoolYear: '2025/2026', avatar:'' },
    { id: 'S007', matricule: '0048/2025', firstName: 'azizi', lastName: 'chayma', academicDiploma: 'Licences', academicSpecialty: 'business intelligence', academicLevel: '3ème Année', dateOfBirth: '1999-12-30', idNumber: '99887766', idType: 'CIN', email: '', gender: '', nationality: '', address: '', phone: '', placeOfBirth: '', studyLevel: '', bacYear: '', schoolYear: '2025/2026', avatar:'' },
];


const AttestationPage: React.FC = () => {
  const [students] = useState(mockAttestationStudents);
  const [search, setSearch] = useState('');
  const [diplome, setDiplome] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [niveau, setNiveau] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleAttestationClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleGenerate = (type: AttestationType) => {
    if (!selectedStudent) return;

    // The API key is required to access attestation pages in the deployment environment.
    // As per guidelines, it must be sourced from process.env.API_KEY.
    const apiKey = process.env.API_KEY;
    const studentData = encodeURIComponent(JSON.stringify(selectedStudent));
    const keyQueryParam = apiKey ? `&key=${apiKey}` : '';
    
    if (type === 'inscription' || type === 'both') {
      window.open(`/attestation/inscription?student=${studentData}${keyQueryParam}`, '_blank');
    }
    if (type === 'presence' || type === 'both') {
      window.open(`/attestation/presence?student=${studentData}${keyQueryParam}`, '_blank');
    }

    setIsModalOpen(false);
    setSelectedStudent(null);
  };


  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`;
      const searchLower = search.toLowerCase();
      
      return (
        (fullName.toLowerCase().includes(searchLower) || student.matricule.includes(searchLower)) &&
        (diplome ? student.academicDiploma === diplome : true) &&
        (specialite ? student.academicSpecialty === specialite : true) &&
        (niveau ? student.academicLevel === niveau : true)
      );
    });
  }, [students, search, diplome, specialite, niveau]);
  
  const resetFilters = () => {
      setSearch('');
      setDiplome('');
      setSpecialite('');
      setNiveau('');
  }

  const uniqueDiplomas = [...new Set(students.map(s => s.academicDiploma))];
  const uniqueSpecialites = [...new Set(students.map(s => s.academicSpecialty))];
  const uniqueNiveaux = [...new Set(students.map(s => s.academicLevel))];

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-white bg-blue-600 p-4 rounded-t-md">Filtres</h2>
          <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div>
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                      <input type="text" id="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, prénom ou matricule" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                      <label htmlFor="diplome" className="block text-sm font-medium text-gray-700 mb-1">Diplôme</label>
                      <select id="diplome" value={diplome} onChange={e => setDiplome(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                          <option value="">Tous les diplômes</option>
                          {uniqueDiplomas.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="specialite" className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                      <select id="specialite" value={specialite} onChange={e => setSpecialite(e.target.value)} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                          <option value="">Toutes les spécialités</option>
                           {uniqueSpecialites.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                   <div>
                      <label htmlFor="niveau" className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                      <select id="niveau" value={niveau} onChange={e => setNiveau(e.target.value)} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                          <option value="">Tous les niveaux</option>
                           {uniqueNiveaux.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                  </div>
              </div>
              <div className="flex justify-end space-x-2">
                  <button className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      <FilterIcon className="mr-2"/>
                      Appliquer
                  </button>
                   <button onClick={resetFilters} className="flex items-center bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                      <ResetIcon className="mr-2"/>
                      Réinitialiser
                  </button>
              </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-lg font-semibold text-white bg-gray-700 p-4">Étudiants - 2025/2026</h2>
           <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-800 text-white uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">#</th>
                  <th className="py-3 px-4 font-semibold">Matricule</th>
                  <th className="py-3 px-4 font-semibold">Nom Complet</th>
                  <th className="py-3 px-4 font-semibold">Diplôme</th>
                  <th className="py-3 px-4 font-semibold">Spécialité</th>
                  <th className="py-3 px-4 font-semibold">Niveau</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredStudents.map((student, index) => (
                  <tr key={student.matricule} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{index + 1}</td>
                    <td className="py-3 px-4">{student.matricule}</td>
                    <td className="py-3 px-4 capitalize">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="py-3 px-4">{student.academicDiploma}</td>
                    <td className="py-3 px-4">{student.academicSpecialty}</td>
                    <td className="py-3 px-4">{student.academicLevel}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleAttestationClick(student)} className="bg-teal-500 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-teal-600 transition-colors">
                          Attestation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AttestationSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onGenerate={handleGenerate}
        />
      )}
    </>
  );
};

export default AttestationPage;