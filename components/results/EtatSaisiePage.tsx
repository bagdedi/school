import React, { useState, useMemo } from 'react';
import type { Classe, Student, StudentGrades, SharedFilterState, Term } from '../../types';
import { mockEvents } from '../timetable/mockData';
import { mockSubjectCoefficients } from '../scholarship/mockSubjectData';
import { findAssessmentRule } from '../scholarship/continuousAssessmentData';
import { ResetIcon } from '../icons/ResetIcon';

// Props interface
interface EtatSaisiePageProps {
  classes: Classe[];
  students: Student[];
  grades: StudentGrades[];
}

type SaisieStatus = 'complet' | 'partiellement complet' | 'en attente';

interface SubjectStatus {
  subjectName: string;
  teacherName: string;
  status: SaisieStatus;
}

const terms: Term[] = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

const getStatusBadge = (status: SaisieStatus) => {
  switch (status) {
    case 'complet':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Complet</span>;
    case 'partiellement complet':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Partiellement Complet</span>;
    case 'en attente':
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">En Attente</span>;
  }
};

const EtatSaisiePage: React.FC<EtatSaisiePageProps> = ({ classes, students, grades }) => {
  const [filters, setFilters] = useState<Omit<SharedFilterState, 'option'>>({ niveau: '', specialite: '', classe: '' });
  const [selectedTerm, setSelectedTerm] = useState<Term>('Trimestre 1');

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => {
        const newFilters = { ...prev, [filterName]: value };
        if (filterName === 'niveau') {
            newFilters.specialite = '';
            newFilters.classe = '';
        } else if (filterName === 'specialite') {
            newFilters.classe = '';
        }
        return newFilters;
    });
  };

  const resetFilters = () => setFilters({ niveau: '', specialite: '', classe: '' });

  const uniqueNiveaux = useMemo(() => [...new Set(classes.map(c => c.niveau))].sort(), [classes]);
  const availableSpecialites = useMemo(() => {
    if (!filters.niveau) return [];
    return [...new Set(classes.filter(c => c.niveau === filters.niveau).map(c => c.specialite))].sort();
  }, [filters.niveau, classes]);
  const availableClasses = useMemo(() => {
    if (!filters.niveau || !filters.specialite) return [];
    return classes.filter(c => c.niveau === filters.niveau && c.specialite === filters.specialite).map(c => c.name).sort((a,b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [filters.niveau, filters.specialite, classes]);

  const statusData = useMemo<SubjectStatus[]>(() => {
    if (!filters.classe) return [];

    const selectedClass = classes.find(c => c.name === filters.classe);
    if (!selectedClass) return [];

    const studentsInClass = students.filter(s => s.classe === selectedClass.name);
    if (studentsInClass.length === 0) return [];

    const subjectsForClass = mockSubjectCoefficients.filter(sc =>
        sc.level === selectedClass.niveau && sc.specialization === selectedClass.specialite
    );

    return subjectsForClass.map(subjectInfo => {
        const teacherEvent = mockEvents.find(e => e.className.startsWith(selectedClass.name) && e.subject === subjectInfo.subject);
        const teacherName = teacherEvent?.teacher || 'Non assigné';

        const assessmentRule = findAssessmentRule(subjectInfo);
        const expectedExamsCount = assessmentRule?.exams.length || 0;

        let studentsWithFullGrades = 0;
        let studentsWithAnyGrade = 0;
        
        studentsInClass.forEach(student => {
            const studentGradeData = grades.find(g => g.studentId === student.id && g.term === selectedTerm);
            const subjectGrade = studentGradeData?.grades.find(sg => sg.subjectName === subjectInfo.subject);

            if (subjectGrade) {
                const enteredGradesCount = Object.values(subjectGrade.notes).filter(note => note !== null).length;
                if (enteredGradesCount > 0) {
                    studentsWithAnyGrade++;
                }
                if (expectedExamsCount > 0 && enteredGradesCount === expectedExamsCount) {
                    studentsWithFullGrades++;
                }
            }
        });

        let status: SaisieStatus = 'en attente';
        if (studentsWithFullGrades === studentsInClass.length && studentsInClass.length > 0) {
            status = 'complet';
        } else if (studentsWithAnyGrade > 0) {
            status = 'partiellement complet';
        }

        return {
            subjectName: subjectInfo.subject,
            teacherName,
            status,
        };
    }).sort((a, b) => a.subjectName.localeCompare(b.subjectName));
  }, [filters.classe, classes, students, mockSubjectCoefficients, grades, selectedTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">État de Saisie des Notes</h1>
          <p className="mt-1 text-gray-600">Vérifiez l'état d'avancement de la saisie des notes pour chaque matière d'une classe.</p>
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {terms.map(term => (
              <button
                key={term}
                onClick={() => setSelectedTerm(term)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  selectedTerm === term
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <select value={filters.niveau} onChange={(e) => handleFilterChange('niveau', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Sélectionnez un Niveau</option>
                {uniqueNiveaux.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
            <select value={filters.specialite} onChange={(e) => handleFilterChange('specialite', e.target.value)} disabled={!filters.niveau} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                <option value="">Sélectionnez une Spécialité</option>
                {availableSpecialites.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
            <select value={filters.classe} onChange={(e) => handleFilterChange('classe', e.target.value)} disabled={!filters.niveau || !filters.specialite} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                <option value="">Sélectionnez une Classe</option>
                {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={resetFilters} className="flex items-center justify-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                <ResetIcon className="mr-2 h-4 w-4"/>
                Réinitialiser
            </button>
        </div>
      </div>

      {filters.classe ? (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto animate-fade-in">
            <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                    <tr>
                        <th className="py-3 px-4 font-semibold">Matière</th>
                        <th className="py-3 px-4 font-semibold">Enseignant</th>
                        <th className="py-3 px-4 font-semibold text-center">Statut de Saisie</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {statusData.map(item => (
                        <tr key={item.subjectName} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{item.subjectName}</td>
                            <td className="py-3 px-4">{item.teacherName}</td>
                            <td className="py-3 px-4 text-center">{getStatusBadge(item.status)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 mt-6">
            <p className="font-semibold">Veuillez sélectionner une classe pour afficher l'état de saisie des notes.</p>
        </div>
      )}

    </div>
  );
};

export default EtatSaisiePage;