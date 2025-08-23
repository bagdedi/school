import React, { useState, useMemo } from 'react';
import type { Classe, Student, DisciplineIncident, DisciplineCouncilMeeting } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import { ResetIcon } from '../icons/ResetIcon';
import { DisciplineManagementModal } from './DisciplineManagementModal';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';

interface DisciplinePageProps {
  classes: Classe[];
  students: Student[];
  disciplineIncidents: DisciplineIncident[];
  setDisciplineIncidents: React.Dispatch<React.SetStateAction<DisciplineIncident[]>>;
  setDisciplineCouncilMeetings: React.Dispatch<React.SetStateAction<DisciplineCouncilMeeting[]>>;
}

const DisciplinePage: React.FC<DisciplinePageProps> = ({ classes, students, disciplineIncidents, setDisciplineIncidents, setDisciplineCouncilMeetings }) => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({ niveau: '', specialite: '', classe: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [viewMode, setViewMode] = useState<'suspended' | 'class'>('suspended');

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

    const studentStats = useMemo(() => {
        if (!filters.classe) return [];
        
        const studentsInClass = students.filter(s => s.classe === filters.classe);
        
        return studentsInClass.map(student => {
            const incidents = disciplineIncidents.filter(inc => inc.studentId === student.id);
            return {
                student,
                warnings: incidents.filter(inc => inc.type === 'Avertissement').length,
                suspensions: incidents.filter(inc => inc.type === 'Exclusion Temporaire').length,
                totalIncidents: incidents.length,
            };
        }).sort((a,b) => a.student.lastName.localeCompare(b.student.lastName));
    }, [filters.classe, students, disciplineIncidents]);

    const suspendedStudentsList = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const suspended = students.map(student => {
            const suspensionIncidents = disciplineIncidents.filter(
                inc => inc.studentId === student.id && inc.type === 'Exclusion Temporaire'
            );
            
            const activeSuspension = suspensionIncidents.find(inc => {
                const startDate = new Date(inc.date);
                const duration = inc.details?.duration || 0;
                if (duration === 0) return false;
                
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + duration);
                
                return today >= startDate && today < endDate;
            });

            return activeSuspension ? { student, activeSuspension } : null;
        }).filter(Boolean);

        return suspended as { student: Student, activeSuspension: DisciplineIncident }[];

    }, [students, disciplineIncidents]);


    const handleManageClick = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fr-CA');

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('disciplinePage.title')}</h1>
                    <p className="mt-1 text-gray-600">{t('disciplinePage.subtitle')}</p>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setViewMode('suspended')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${viewMode === 'suspended' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {t('disciplinePage.suspendedViewTitle')}
                        </button>
                        <button onClick={() => setViewMode('class')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${viewMode === 'class' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {t('disciplinePage.classViewTitle')}
                        </button>
                    </nav>
                </div>
                
                {viewMode === 'suspended' ? (
                     <div className="bg-white rounded-xl shadow-md overflow-x-auto animate-fade-in">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                                <tr>
                                    <th className="py-3 px-4 font-semibold">{t('disciplinePage.student')}</th>
                                    <th className="py-3 px-4 font-semibold">{t('disciplinePage.class')}</th>
                                    <th className="py-3 px-4 font-semibold">{t('disciplinePage.reason')}</th>
                                    <th className="py-3 px-4 font-semibold text-center">{t('disciplinePage.duration')}</th>
                                    <th className="py-3 px-4 font-semibold text-center">{t('disciplinePage.suspensionEndDate')}</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {suspendedStudentsList.map(({ student, activeSuspension }) => {
                                    const startDate = new Date(activeSuspension.date);
                                    const duration = activeSuspension.details?.duration || 0;
                                    const endDate = new Date(startDate);
                                    endDate.setDate(startDate.getDate() + duration);
                                    return (
                                        <tr key={student.id} className="border-b border-gray-200 bg-red-50 hover:bg-red-100">
                                            <td className="py-2 px-4">
                                                <div className="flex items-center">
                                                    <img src={student.avatar} alt="" className="w-9 h-9 rounded-full mr-3" />
                                                    <span>{`${student.firstName} ${student.lastName}`}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">{student.classe}</td>
                                            <td className="py-2 px-4 text-sm">{activeSuspension.reason}</td>
                                            <td className="py-2 px-4 text-center font-semibold">{duration} jour(s)</td>
                                            <td className="py-2 px-4 text-center font-semibold">{formatDate(endDate.toISOString())}</td>
                                        </tr>
                                    );
                                })}
                                {suspendedStudentsList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-gray-500">
                                            <UserGroupIcon className="h-12 w-12 mx-auto text-gray-300 mb-2"/>
                                            {t('disciplinePage.noSuspendedStudents')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <select value={filters.niveau} onChange={(e) => handleFilterChange('niveau', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="">{t('common.allLevels')}</option>
                                    {uniqueNiveaux.map(level => <option key={level} value={level}>{level}</option>)}
                                </select>
                                <select value={filters.specialite} onChange={(e) => handleFilterChange('specialite', e.target.value)} disabled={!filters.niveau} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                                    <option value="">{t('common.allSpecialties')}</option>
                                    {availableSpecialites.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                                </select>
                                <select value={filters.classe} onChange={(e) => handleFilterChange('classe', e.target.value)} disabled={!filters.niveau || !filters.specialite} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                                    <option value="">{t('common.allClasses')}</option>
                                    {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <button onClick={resetFilters} className="flex items-center justify-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                                    <ResetIcon className="mr-2 h-4 w-4"/>
                                    {t('common.reset')}
                                </button>
                            </div>
                        </div>

                        {filters.classe ? (
                            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                                        <tr>
                                            <th className="py-3 px-4 font-semibold">{t('disciplinePage.student')}</th>
                                            <th className="py-3 px-4 font-semibold text-center">{t('disciplinePage.warnings')}</th>
                                            <th className="py-3 px-4 font-semibold text-center">{t('disciplinePage.suspensions')}</th>
                                            <th className="py-3 px-4 font-semibold text-center">Total {t('disciplinePage.incidents')}</th>
                                            <th className="py-3 px-4 font-semibold text-center">{t('disciplinePage.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        {studentStats.map(({ student, warnings, suspensions, totalIncidents }) => (
                                            <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="py-2 px-4">
                                                    <div className="flex items-center">
                                                        <img src={student.avatar} alt="" className="w-9 h-9 rounded-full mr-3" />
                                                        <span>{`${student.firstName} ${student.lastName}`}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-4 text-center">
                                                    <span className={`px-2.5 py-1 text-sm font-bold rounded-full ${warnings > 0 ? 'bg-yellow-100 text-yellow-800' : 'text-gray-500'}`}>{warnings}</span>
                                                </td>
                                                <td className="py-2 px-4 text-center">
                                                    <span className={`px-2.5 py-1 text-sm font-bold rounded-full ${suspensions > 0 ? 'bg-red-100 text-red-800' : 'text-gray-500'}`}>{suspensions}</span>
                                                </td>
                                                <td className="py-2 px-4 text-center">
                                                    <span className={`px-2.5 py-1 text-sm font-bold rounded-full ${totalIncidents > 0 ? 'bg-gray-200 text-gray-800' : 'text-gray-500'}`}>{totalIncidents}</span>
                                                </td>
                                                <td className="py-2 px-4 text-center">
                                                    <button onClick={() => handleManageClick(student)} className="bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                                                        {t('disciplinePage.manage')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 mt-6">
                                <p className="font-semibold">{t('disciplinePage.noStudentSelected')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && selectedStudent && (
                <DisciplineManagementModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    student={selectedStudent}
                    incidents={disciplineIncidents}
                    setIncidents={setDisciplineIncidents}
                    setCouncilMeetings={setDisciplineCouncilMeetings}
                />
            )}
        </>
    );
};

export default DisciplinePage;