import React, { useState, useMemo, useRef } from 'react';
import type { Classe, Student, AttendanceData, SharedFilterState, AttendanceStatus } from '../../types';
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
type ChartIncidentType = 'absences' | 'tardies' | 'exclusions' | 'total';

type IncidentDetail = {
  date: string;
  time: string;
  subject: string;
  teacher: string;
};


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

const abbreviateSubject = (subject: string): string => {
  const abbreviations: { [key: string]: string } = {
    'Arabe': 'Arabe', 'Français': 'Franç', 'Anglais': 'Angl', 'Histoire': 'Hist', 'Géographie': 'Géo',
    'Pensée Islamique': 'P. Isl', 'Education Civile': 'Ed. Civ', 'Mathématiques': 'Maths', 'Physique': 'Phy',
    'Sciences de la Vie et de la Terre': 'SVT', 'Technologie': 'Tech', 'Informatique': 'Info', 'Sport': 'Sport',
    'Arts': 'Arts', 'Projet': 'Projet', 'Philosophie': 'Philo', 'Economie': 'Eco', 'Gestion': 'Gest',
    'Algorithmique & Programmation': 'Algo/Prog', 'Systèmes & Réseaux': 'Sys/Rés', 'Bases de données': 'BDD',
    'Génie Électrique': 'G. Elec', 'Génie Mécanique': 'G. Mec', 'Tech-Inf-comm (TIC)': 'TIC',
    'Sciences Biologiques': 'Bio',
  };
  return abbreviations[subject] || subject;
};

// Color generation logic, mirrors what's in mockData.ts
const subjectColorsForChart = [
  'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-lime-400', 
  'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-sky-400',
  'bg-blue-400', 'bg-indigo-400', 'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 
  'bg-pink-400', 'bg-rose-400'
];
let colorIndex = 0;
const subjectColorMap: { [key: string]: string } = {};
const getSubjectColorForChart = (subject: string): string => {
    if (!subjectColorMap[subject]) {
        subjectColorMap[subject] = subjectColorsForChart[colorIndex % subjectColorsForChart.length];
        colorIndex++;
    }
    return subjectColorMap[subject];
};

// --- UI COMPONENTS ---
interface BarChartProps {
  data: { name: string; value: number; color: string; fullName: string; teachers: string[] }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value), 0);
  if (maxValue === 0) {
    return (
      <div className="flex items-center justify-center h-72 text-gray-500">
        Aucune donnée d'incident pour cette sélection.
      </div>
    );
  }

  const numTicks = 5;
  let tickIncrement = Math.ceil(maxValue / numTicks);
  const pow10 = Math.pow(10, Math.floor(Math.log10(tickIncrement)));
  const rel = tickIncrement / pow10;
  if (rel > 5) tickIncrement = 10 * pow10;
  else if (rel > 2) tickIncrement = 5 * pow10;
  else if (rel > 1) tickIncrement = 2 * pow10;
  else tickIncrement = 1 * pow10;
  
  const yAxisMax = tickIncrement * numTicks;
  const yAxisLabels = Array.from({ length: numTicks + 1 }, (_, i) => i * tickIncrement);

  return (
    <div className="w-full h-72 flex p-4">
      {/* Y-Axis Labels */}
      <div className="flex flex-col justify-between text-right text-xs text-gray-500 pr-2 pb-6">
        {yAxisLabels.slice().reverse().map(label => <div key={label}>{label}</div>)}
      </div>

      <div className="flex-1 flex flex-col">
        {/* Main chart content with bars and grid lines */}
        <div className="flex-1 relative border-l border-gray-300">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {yAxisLabels.map((_, index) => (
              <div key={index} className={`w-full border-t ${index === yAxisLabels.length - 1 ? 'border-transparent' : 'border-dashed border-gray-200'}`}></div>
            ))}
          </div>
          {/* Bars */}
          <div className="absolute inset-0 flex items-end space-x-4 px-2">
            {data.map(item => (
              <div
                key={item.fullName}
                className="flex-1 flex flex-col items-center justify-end h-full relative z-10"
                title={`${item.fullName}\nEnseignant(s): ${item.teachers.join(', ')}`}
              >
                <div className="text-sm font-semibold text-gray-700">{item.value}</div>
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${item.color}`}
                  style={{ height: `${(item.value / yAxisMax) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        {/* X-Axis line */}
        <div className="border-t border-gray-300"></div>
        {/* X-Axis Labels */}
        <div className="flex items-start space-x-4 px-2 h-6 pt-1">
          {data.map(item => (
            <div key={item.fullName} className="flex-1 text-center text-xs text-gray-500 truncate" title={item.fullName}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

interface ExpandedStudentDetailsProps {
  student: Student;
  startDate: Date;
  endDate: Date;
  attendanceData: AttendanceData;
}

const ExpandedStudentDetails: React.FC<ExpandedStudentDetailsProps> = ({ student, startDate, endDate, attendanceData }) => {
    const [chartType, setChartType] = useState<ChartIncidentType>('total');
  
    const studentChartData = useMemo(() => {
      if (!student.id || !startDate || !endDate || !student.classe) return [];
  
      const incidentsBySubject: { [subject: string]: { absences: number, tardies: number, exclusions: number, teachers: Set<string> } } = {};
  
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = formatDate(d);
          const dayIndex = d.getDay() === 0 ? 7 : d.getDay();
          const studentAttendanceForDay = attendanceData[dateStr]?.[student.classe]?.[student.id];
  
          if (studentAttendanceForDay) {
              for (const timeLabel in studentAttendanceForDay) {
                  const status = studentAttendanceForDay[timeLabel];
                  if (status) {
                      const [startHour] = timeLabel.split('-').map(Number);
                      const subjectEvent = mockEvents.find(event =>
                          event.day === dayIndex &&
                          event.className.startsWith(student.classe!) &&
                          Math.floor(timeToMinutes(event.startTime) / 60) <= startHour &&
                          Math.ceil(timeToMinutes(event.endTime) / 60) > startHour
                      );
                      if (subjectEvent) {
                          const subject = subjectEvent.subject;
                          if (!incidentsBySubject[subject]) {
                              incidentsBySubject[subject] = { absences: 0, tardies: 0, exclusions: 0, teachers: new Set() };
                          }
                          incidentsBySubject[subject].teachers.add(subjectEvent.teacher);
                          if (status === 'A') incidentsBySubject[subject].absences++;
                          if (status === 'R') incidentsBySubject[subject].tardies++;
                          if (status === 'EX') incidentsBySubject[subject].exclusions++;
                      }
                  }
              }
          }
      }
  
      return Object.entries(incidentsBySubject).map(([subject, counts]) => {
          let value = 0;
          switch (chartType) {
              case 'absences': value = counts.absences; break;
              case 'tardies': value = counts.tardies; break;
              case 'exclusions': value = counts.exclusions; break;
              case 'total': value = counts.absences + counts.tardies + counts.exclusions; break;
          }
          return { 
            name: abbreviateSubject(subject), 
            value,
            color: getSubjectColorForChart(subject),
            fullName: subject,
            teachers: Array.from(counts.teachers),
          };
      }).filter(item => item.value > 0).sort((a,b) => b.value - a.value);
  
    }, [student, startDate, endDate, attendanceData, chartType]);
  
    return (
      <div className="bg-gray-50 p-4 border-t-2 border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Analyse des incidents par matière pour {student.firstName} {student.lastName}</h3>
        <div className="flex items-center justify-center space-x-1 mb-4 p-1 bg-gray-100 rounded-lg max-w-sm mx-auto">
            <button onClick={() => setChartType('total')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartType === 'total' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}>Total</button>
            <button onClick={() => setChartType('absences')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartType === 'absences' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:bg-gray-200'}`}>Absences</button>
            <button onClick={() => setChartType('tardies')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartType === 'tardies' ? 'bg-white shadow text-yellow-600' : 'text-gray-500 hover:bg-gray-200'}`}>Retards</button>
            <button onClick={() => setChartType('exclusions')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartType === 'exclusions' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:bg-gray-200'}`}>Exclusions</button>
        </div>
        <BarChart data={studentChartData} />
      </div>
    );
};


// --- MAIN COMPONENT ---
const AttendanceAnalyticsPage: React.FC<AttendanceAnalyticsPageProps> = ({ classes, students, attendanceData, filters, onFilterChange, onResetFilters }) => {
  const [period, setPeriod] = useState<PeriodType>('week');
  const [customStartDate, setCustomStartDate] = useState(formatDate(new Date()));
  const [customEndDate, setCustomEndDate] = useState(formatDate(new Date()));
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date, end: Date } | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartIncidentType>('total');
  const [popover, setPopover] = useState<{
    content: IncidentDetail[];
    type: AttendanceStatus;
    position: { top: number; left: number };
  } | null>(null);
  const popoverTimeoutRef = useRef<number | null>(null);

  const getIncidentsForStudent = (studentId: string, type: AttendanceStatus): IncidentDetail[] => {
    if (!dateRange || !filters.classe) return [];
    const incidents: IncidentDetail[] = [];
    
    for (let d = new Date(dateRange.start); d <= dateRange.end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const dayIndex = d.getDay() === 0 ? 7 : d.getDay();
        const studentAttendanceForDay = attendanceData[dateStr]?.[filters.classe]?.[studentId];

        if (studentAttendanceForDay) {
            for (const timeLabel in studentAttendanceForDay) {
                if (studentAttendanceForDay[timeLabel] === type) {
                    const [startHour] = timeLabel.split('-').map(Number);
                    const event = mockEvents.find(e =>
                        e.day === dayIndex &&
                        e.className.startsWith(filters.classe!) &&
                        Math.floor(timeToMinutes(e.startTime) / 60) <= startHour &&
                        Math.ceil(timeToMinutes(e.endTime) / 60) > startHour
                    );
                    if (event) {
                        incidents.push({
                            date: d.toLocaleDateString('fr-FR'),
                            time: timeLabel,
                            subject: event.subject,
                            teacher: event.teacher,
                        });
                    }
                }
            }
        }
    }
    return incidents.sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());
  };

  const handleShowPopover = (e: React.MouseEvent, studentId: string, type: AttendanceStatus, count: number) => {
    if (popoverTimeoutRef.current) clearTimeout(popoverTimeoutRef.current);
    if (count === 0) return;

    const incidents = getIncidentsForStudent(studentId, type);
    if (incidents.length === 0) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const popoverWidth = 320; // max-w-sm
    let left = rect.left + window.scrollX;
    if (left + popoverWidth > window.innerWidth) {
        left = rect.right + window.scrollX - popoverWidth;
    }
    
    setPopover({
        content: incidents,
        type: type,
        position: { top: rect.bottom + window.scrollY + 5, left: left },
    });
  };

  const handleHidePopover = () => {
      popoverTimeoutRef.current = window.setTimeout(() => {
          setPopover(null);
      }, 300);
  };

  const handlePopoverAreaEnter = () => {
      if (popoverTimeoutRef.current) clearTimeout(popoverTimeoutRef.current);
  };


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
    setDateRange({ start, end });

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

  const chartData = useMemo(() => {
    if (!reportData || !dateRange || !filters.classe) return [];

    const incidentsBySubject: { [subject: string]: { absences: number, tardies: number, exclusions: number, teachers: Set<string> } } = {};

    for (let d = new Date(dateRange.start); d <= dateRange.end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const dayIndex = d.getDay() === 0 ? 7 : d.getDay();
        const classAttendanceForDay = attendanceData[dateStr]?.[filters.classe];

        if (classAttendanceForDay) {
            for (const studentId in classAttendanceForDay) {
                const studentAttendance = classAttendanceForDay[studentId];
                for (const timeLabel in studentAttendance) {
                    const status = studentAttendance[timeLabel];
                    if (status) {
                        const [startHour] = timeLabel.split('-').map(Number);
                        const subjectEvent = mockEvents.find(event =>
                            event.day === dayIndex &&
                            event.className.startsWith(filters.classe!) &&
                            Math.floor(timeToMinutes(event.startTime) / 60) <= startHour &&
                            Math.ceil(timeToMinutes(event.endTime) / 60) > startHour
                        );
                        if (subjectEvent) {
                            const subject = subjectEvent.subject;
                            if (!incidentsBySubject[subject]) {
                                incidentsBySubject[subject] = { absences: 0, tardies: 0, exclusions: 0, teachers: new Set() };
                            }
                            incidentsBySubject[subject].teachers.add(subjectEvent.teacher);
                            if (status === 'A') incidentsBySubject[subject].absences++;
                            if (status === 'R') incidentsBySubject[subject].tardies++;
                            if (status === 'EX') incidentsBySubject[subject].exclusions++;
                        }
                    }
                }
            }
        }
    }

    return Object.entries(incidentsBySubject).map(([subject, counts]) => {
        let value = 0;
        switch (chartType) {
            case 'absences': value = counts.absences; break;
            case 'tardies': value = counts.tardies; break;
            case 'exclusions': value = counts.exclusions; break;
            case 'total': value = counts.absences + counts.tardies + counts.exclusions; break;
        }
        return { 
          name: abbreviateSubject(subject), 
          value,
          color: getSubjectColorForChart(subject),
          fullName: subject,
          teachers: Array.from(counts.teachers),
        };
    }).filter(item => item.value > 0).sort((a,b) => b.value - a.value);

  }, [reportData, dateRange, filters.classe, attendanceData, chartType]);
  

  const handleReset = () => {
    onResetFilters();
    setPeriod('week');
    setReportData(null);
    setDateRange(null);
  }

  return (
    <>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-lg bg-violet-50 border border-violet-200">
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
                  <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">du</span>
                      <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                  </div>
                  <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">à</span>
                      <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                  </div>
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Analyse des Incidents par Matière</h3>
              <div className="flex items-center justify-center space-x-1 mb-4 p-1 bg-gray-100 rounded-lg">
                <button onClick={() => setChartType('total')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartType === 'total' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}>Total</button>
                <button onClick={() => setChartType('absences')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartType === 'absences' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:bg-gray-200'}`}>Absences</button>
                <button onClick={() => setChartType('tardies')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartType === 'tardies' ? 'bg-white shadow text-yellow-600' : 'text-gray-500 hover:bg-gray-200'}`}>Retards</button>
                <button onClick={() => setChartType('exclusions')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${chartType === 'exclusions' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:bg-gray-200'}`}>Exclusions</button>
              </div>
              <BarChart data={chartData} />
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
                      <th className="py-3 px-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {reportData.studentStats.map(({ student, absences, tardies, exclusions }) => (
                       <React.Fragment key={student.id}>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2 px-4">
                            <div className="flex items-center">
                              <img src={student.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                              <span>{`${student.firstName} ${student.lastName}`}</span>
                            </div>
                          </td>
                          <td
                            className="py-2 px-4 text-center font-bold text-red-600 cursor-pointer"
                            onMouseEnter={(e) => handleShowPopover(e, student.id, 'A', absences)}
                            onMouseLeave={handleHidePopover}
                          >
                            {absences}
                          </td>
                          <td
                            className="py-2 px-4 text-center font-bold text-yellow-600 cursor-pointer"
                            onMouseEnter={(e) => handleShowPopover(e, student.id, 'R', tardies)}
                            onMouseLeave={handleHidePopover}
                          >
                              {tardies}
                          </td>
                          <td
                            className="py-2 px-4 text-center font-bold text-purple-600 cursor-pointer"
                            onMouseEnter={(e) => handleShowPopover(e, student.id, 'EX', exclusions)}
                            onMouseLeave={handleHidePopover}
                          >
                              {exclusions}
                          </td>
                          <td className="py-2 px-4 text-center">
                            <button
                                onClick={() => setExpandedStudentId(prevId => prevId === student.id ? null : student.id)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
                            >
                                {expandedStudentId === student.id ? 'Voir moins' : 'Voir plus'}
                            </button>
                          </td>
                        </tr>
                        {expandedStudentId === student.id && dateRange && (
                            <tr className="bg-gray-100">
                                <td colSpan={5}>
                                    <ExpandedStudentDetails
                                        student={student}
                                        startDate={dateRange.start}
                                        endDate={dateRange.end}
                                        attendanceData={attendanceData}
                                    />
                                </td>
                            </tr>
                        )}
                      </React.Fragment>
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
      {popover && (
        <div
          style={{ top: `${popover.position.top}px`, left: `${popover.position.left}px`, minWidth: '320px' }}
          className="absolute z-50 bg-white rounded-lg shadow-xl border p-3 max-w-sm w-full animate-fade-in text-sm"
          onMouseEnter={handlePopoverAreaEnter}
          onMouseLeave={handleHidePopover}
        >
          <h4 className="font-bold mb-2 border-b pb-1 text-gray-800">
              {popover.type === 'A' && 'Détail des Absences'}
              {popover.type === 'R' && 'Détail des Retards'}
              {popover.type === 'EX' && 'Détail des Exclusions'}
          </h4>
          <div className="max-h-60 overflow-y-auto">
              {popover.content.length > 0 ? (
                  <ul className="space-y-2">
                      {popover.content.map((incident, index) => (
                          <li key={index} className="p-2 bg-gray-50 rounded-md border border-gray-200">
                              <div className="font-semibold text-gray-900">{incident.date} <span className="font-normal text-gray-500">@ {incident.time}</span></div>
                              <div className="text-gray-600">Matière: {incident.subject}</div>
                              <div className="text-gray-600">Enseignant: {incident.teacher}</div>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-gray-500 text-center py-4">Aucun incident à afficher.</p>
              )}
          </div>
        </div>
      )}
    </>
  );
};
export default AttendanceAnalyticsPage;
