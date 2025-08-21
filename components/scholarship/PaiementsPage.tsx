import React, { useState, useMemo } from 'react';
import type { Student, Classe, SharedFilterState, Payment, TuitionFee } from '../../types';
import { tuitionFees } from './mockPaymentData';
import { PaymentModal } from './PaymentModal';
import { PencilSquareIcon } from '../icons/PencilSquareIcon';

interface PaiementsPageProps {
  students: Student[];
  classes: Classe[];
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  filters: SharedFilterState;
  onFilterChange: (filterName: keyof SharedFilterState, value: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onResetFilters: () => void;
}

const getPaymentStatus = (totalPaid: number, totalDue: number) => {
  if (totalPaid <= 0) {
    return { text: 'Non Payé', color: 'bg-red-100 text-red-800' };
  }
  if (totalPaid >= totalDue) {
    return { text: 'Payé', color: 'bg-green-100 text-green-800' };
  }
  return { text: 'Partiel', color: 'bg-yellow-100 text-yellow-800' };
};

const PaiementsPage: React.FC<PaiementsPageProps> = ({
  students,
  classes,
  payments,
  setPayments,
  filters,
  onFilterChange,
  searchQuery,
  setSearchQuery,
  onResetFilters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const studentPaymentData = useMemo(() => {
    return students.map(student => {
      const studentPayments = payments.filter(p => p.studentId === student.id);
      const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);

      const feeInfo = tuitionFees.find(f => f.niveau === student.academicLevel && f.specialite === student.academicSpecialty);
      const totalDue = feeInfo?.total || 0;
      
      const balance = totalDue - totalPaid;
      const status = getPaymentStatus(totalPaid, totalDue);

      return {
        ...student,
        totalPaid,
        balance,
        status,
      };
    });
  }, [students, payments]);

  const handleManageClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };
  
  const uniqueNiveaux = useMemo(() => [...new Set(classes.map(c => c.niveau))].sort(), [classes]);
  const availableSpecialites = useMemo(() => {
    if (!filters.niveau) return [...new Set(classes.map(c => c.specialite))].sort();
    return [...new Set(classes.filter(c => c.niveau === filters.niveau).map(c => c.specialite))].sort();
  }, [filters.niveau, classes]);
  const availableClasses = useMemo(() => {
    if (!filters.niveau || !filters.specialite) return [];
    return classes.filter(c => c.niveau === filters.niveau && c.specialite === filters.specialite).map(c => c.name).sort();
  }, [filters.niveau, filters.specialite, classes]);

  const filteredStudents = useMemo(() => {
    return studentPaymentData.filter(student => {
      const searchMatch =
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.matricule.toLowerCase().includes(searchQuery.toLowerCase());
      const niveauMatch = filters.niveau ? student.academicLevel === filters.niveau : true;
      const specialiteMatch = filters.specialite ? student.academicSpecialty === filters.specialite : true;
      const classeMatch = filters.classe ? student.classe === filters.classe : true;
      return searchMatch && niveauMatch && specialiteMatch && classeMatch;
    });
  }, [studentPaymentData, searchQuery, filters]);

  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Paiements</h1>
            <p className="mt-1 text-gray-600">Suivez et gérez les frais de scolarité des étudiants.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="search"
            placeholder="Rechercher par nom ou matricule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:col-span-2 lg:col-span-1"
          />
          <select value={filters.niveau} onChange={(e) => onFilterChange('niveau', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Tous les Niveaux</option>
            {uniqueNiveaux.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
          <select value={filters.specialite} onChange={(e) => onFilterChange('specialite', e.target.value)} disabled={!filters.niveau} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
            <option value="">Toutes les Spécialités</option>
            {availableSpecialites.map(spec => <option key={spec} value={spec}>{spec}</option>)}
          </select>
          <select value={filters.classe} onChange={(e) => onFilterChange('classe', e.target.value)} disabled={!filters.niveau || !filters.specialite} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
            <option value="">Toutes les Classes</option>
            {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="py-3 px-4 font-semibold">Étudiant</th>
                <th className="py-3 px-4 font-semibold">Matricule</th>
                <th className="py-3 px-4 font-semibold">Classe</th>
                <th className="py-3 px-4 font-semibold text-center">Statut</th>
                <th className="py-3 px-4 font-semibold text-right">Montant Payé</th>
                <th className="py-3 px-4 font-semibold text-right">Solde Restant</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredStudents.map(student => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} className="w-10 h-10 rounded-full mr-4" />
                      <span>{`${student.firstName} ${student.lastName}`}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{student.matricule}</td>
                  <td className="py-3 px-4">{student.classe}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.status.color}`}>
                      {student.status.text}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">{student.totalPaid.toFixed(2)} TND</td>
                  <td className="py-3 px-4 text-right font-medium text-red-600">{student.balance.toFixed(2)} TND</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleManageClick(student)} className="flex items-center justify-center w-full bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">
                      <PencilSquareIcon className="mr-1.5"/>
                      Gérer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedStudent && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          student={selectedStudent}
          payments={payments}
          setPayments={setPayments}
          tuitionFees={tuitionFees}
        />
      )}
    </>
  );
};

export default PaiementsPage;