import React, { useState, useMemo } from 'react';
import type { Classe, Student, AttendanceData, SharedFilterState } from '../../types';
import { ResetIcon } from '../icons/ResetIcon';
import { UserMinusIcon } from '../icons/UserMinusIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { ChartPieIcon } from '../icons/ChartPieIcon';
import { mockEvents } from '../timetable/mockData';

// --- TYPE DEFINITIONS ---
interface AttendanceAnalyticsPageProps {
  classes: Classe[];
  students: Student[];
  attendanceData: AttendanceData;
  filters: SharedFilterState;
  onFilterChange: (filterName: keyof SharedFilterState, value: string) => void;
  onResetFilters: () => void;
}

interface ReportData {
  summary: {
    totalAbsences: number;
    totalTardies: number;
    totalExclusions: number;
    presenceRate: number;
  };
  studentStats: {
    student: Student;
    absences: number;
    tardies: number;
    exclusions: number;
  }[];
}

type PeriodType = 'day' | 'week' | 'month' | 'term' | 'year' | 'custom';

// --- HELPER FUNCTIONS ---
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getDatesForPeriod = (period: PeriodType, customStart?: string, customEnd?: string): { start: Date, end: Date } => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const firstDayOfWeek = start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1);
      start.setDate(firstDayOfWeek);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'term': // Trimestre 1: Sep 15 - Dec 20
      start.setMonth(8, 15);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 20);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(8, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(start.getFullYear() + 1);
      end.setMonth(7, 31);
      end.setHours(23, 59, 59, 999);
      break;
    case 'custom':
      return {
        start: customStart ? new Date(customStart) : new Date(),
        end: customEnd ? new Date(customEnd) : new Date(),
      };
  }
  return { start, end };
};

// --- UI COMPONENTS ---
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const AttendanceAnalyticsPage: React.FC<AttendanceAnalyticsPageProps> = ({ classes, students, attendanceData, filters, onFilterChange, onResetFilters }) => {
  const [period, setPeriod] = useState<PeriodType>('week');
  const [customStartDate, setCustomStartDate] = useState(formatDate(new Date()));
  const [customEndDate, setCustomEndDate] = useState(formatDate(new Date()));
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const uniqueNiveaux = useMemo(() => [...new Set(classes.map(c => c.niveau))].sort(), [classes]);
  const availableSpecialites = useMemo(() => {
    if (!filters.niveau) return [];
    return [...new Set(classes.filter(c => c.niveau === filters.niveau).map(c => c.specialite))].sort();
  }, [filters.niveau, classes]);
  const availableClasses = useMemo(() => {
    if (!filters.niveau || !filters.specialite) return [];
    return classes.filter(c => c.niveau === filters.niveau && c.specialite === filters.specialite).map(c => c.name).sort();
  }, [filters.niveau, filters.specialite, classes]);
  
  const handleGenerateReport = () => {
    if (!filters.classe) {
      alert("Veuillez sélectionner une classe.");
      return;
    }
    const { start, end } = getDatesForPeriod(period, customStartDate, customEndDate);
    const studentsInClass = students.filter(s => s.classe === filters.classe);
    
    let totalAbsences = 0;
    let totalTardies = 0;
    let totalExclusions = 0;
    let totalPossibleSlots = 0;
    
    const studentStats: ReportData['studentStats'] = studentsInClass.map(student => ({
      student, absences: 0, tardies: 0, exclusions: 0,
    }));
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const dayIndex = d.getDay() === 0 ? 7 : d.getDay();
        const classAttendanceForDay = attendanceData[dateStr]?.[filters.classe];

        const slotsForDay = new Set(mockEvents
            .filter(e => e.className.startsWith(filters.classe) && e.day === dayIndex)
            .map(e => {
                const startHour = Math.floor(timeToMinutes(e.startTime) / 60);
                const endHour = Math.ceil(timeToMinutes(e.endTime) / 60);
                const slots: string[] = [];
                for (let h = startHour; h < endHour; h++) {
                    slots.push(`${String(h).padStart(2, '0')}-${String(h + 1).padStart(2, '0')}`);
                }
                return slots;
            }).flat()
        );
        totalPossibleSlots += slotsForDay.size * studentsInClass.length;

        if (classAttendanceForDay) {
            studentStats.forEach(stat => {
                const studentAttendance = classAttendanceForDay[stat.student.id];
                if (studentAttendance) {
                    Object.values(studentAttendance).forEach(status => {
                        if (status === 'A') { stat.absences++; totalAbsences++; }
                        if (status === 'R') { stat.tardies++; totalTardies++; }
                        if (status === 'EX') { stat.exclusions++; totalExclusions++; }
                    });
                }
            });
        }
    }
    
    const presenceRate = totalPossibleSlots > 0 ? ((totalPossibleSlots - totalAbsences) / totalPossibleSlots) * 100 : 100;

    setReportData({
      summary: { totalAbsences, totalTardies, totalExclusions, presenceRate },
      studentStats: studentStats.sort((a,b) => b.absences - a.absences || b.tardies - a.tardies),
    });
  };

  const handleReset = () => {
    onResetFilters();
    setPeriod('week');
    setReportData(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Suivi des Présences</h1>
        <p className="mt-1 text-gray-600">Analysez les statistiques d'absence et de retard par période.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Filtres du Rapport</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select value={filters.niveau} onChange={(e) => onFilterChange('niveau', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Sélectionnez un Niveau</option>
                {uniqueNiveaux.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
            <select value={filters.specialite} onChange={(e) => onFilterChange('specialite', e.target.value)} disabled={!filters.niveau} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                <option value="">Sélectionnez une Spécialité</option>
                {availableSpecialites.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
            <select value={filters.classe} onChange={(e) => onFilterChange('classe', e.target.value)} disabled={!filters.niveau || !filters.specialite} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                <option value="">Sélectionnez une Classe</option>
                {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <select value={period} onChange={(e) => setPeriod(e.target.value as PeriodType)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="day">Par jour</option>
                <option value="week">Par semaine</option>
                <option value="month">Par mois</option>
                <option value="term">Par trimestre</option>
                <option value="year">Annuelle</option>
                <option value="custom">Période personnalisée</option>
            </select>
             {period === 'custom' && (
                <>
                <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </>
             )}
        </div>
        <div className="flex justify-end space-x-3 pt-4">
             <button onClick={handleReset} className="flex items-center bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"> <ResetIcon className="mr-2 h-4 w-4" /> Réinitialiser </button>
             <button onClick={handleGenerateReport} className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"> Générer le Rapport </button>
        </div>
      </div>

      {reportData ? (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<UserMinusIcon className="text-red-500"/>} title="Total Absences" value={reportData.summary.totalAbsences.toString()} color="border-red-500" />
            <StatCard icon={<ClockIcon className="text-yellow-500"/>} title="Total Retards" value={reportData.summary.totalTardies.toString()} color="border-yellow-500" />
            <StatCard icon={<ExclamationTriangleIcon className="text-purple-500"/>} title="Total Exclusions" value={reportData.summary.totalExclusions.toString()} color="border-purple-500" />
            <StatCard icon={<ChartPieIcon className="text-green-500"/>} title="Taux de Présence" value={`${reportData.summary.presenceRate.toFixed(1)}%`} color="border-green-500" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Détails par Étudiant</h3>
            <div className="overflow-x-auto max-h-[60vh]">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm sticky top-0">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Étudiant</th>
                    <th className="py-3 px-4 font-semibold text-center">Absences (A)</th>
                    <th className="py-3 px-4 font-semibold text-center">Retards (R)</th>
                    <th className="py-3 px-4 font-semibold text-center">Exclusions (EX)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {reportData.studentStats.map(({ student, absences, tardies, exclusions }) => (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <div className="flex items-center">
                          <img src={student.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                          <span>{`${student.firstName} ${student.lastName}`}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-center font-bold text-red-600">{absences}</td>
                      <td className="py-2 px-4 text-center font-bold text-yellow-600">{tardies}</td>
                      <td className="py-2 px-4 text-center font-bold text-purple-600">{exclusions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 mt-6">
            <p className="font-semibold">Veuillez sélectionner les filtres et générer un rapport pour afficher les statistiques.</p>
        </div>
      )}
    </div>
  );
};
export default AttendanceAnalyticsPage;
