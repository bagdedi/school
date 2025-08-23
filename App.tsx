import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SidebarItem } from './components/SidebarItem';
import { DashboardIcon } from './components/icons/DashboardIcon';
import { StudentsIcon } from './components/icons/StudentsIcon';
import { TeachersIcon } from './components/icons/TeachersIcon';
import { ScholarshipIcon } from './components/icons/ScholarshipIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { LogoIcon } from './components/icons/LogoIcon';
import type { NavItem, DayWorkingHours, Classe, Student, SharedFilterState, Payment, StudentGrades, SubjectCoefficient, Teacher, AttendanceData, DisciplineIncident, ConseilDisciplineMembers, DisciplineCouncilMeeting } from './types';
import DashboardPage from './components/dashboard/DashboardPage';
import StudentsPage from './components/students/StudentsPage';
import TeachersPage from './components/teachers/TeachersPage';
import ScholarshipPage from './components/scholarship/ScholarshipPage';
import SettingsPage from './components/settings/SettingsPage';
import AttestationInscriptionPage from './components/students/AttestationInscriptionPage';
import AttestationPresencePage from './components/students/AttestationPresencePage';
import { NotFoundPage } from './components/common/NotFoundPage';
import { CalendarIcon } from './components/icons/CalendarIcon';
import TimetableTeachersPage from './components/timetable/TimetableTeachersPage';
import TimetableStudentsPage from './components/timetable/TimetableStudentsPage';
import TimetableHallsPage from './components/timetable/TimetableHallsPage';
import EtablissementPage from './components/settings/EtablissementPage';
import { BuildingOfficeIcon } from './components/icons/BuildingOfficeIcon';
import EtatPedagogiquePage from './components/scholarship/EtatPedagogiquePage';
import { initialClasses, mockStudents, initialWorkingHours, initialHalls, mockTeachers, mockConseilDisciplineMembers } from './components/timetable/mockData';
import { DocumentChartBarIcon } from './components/icons/DocumentChartBarIcon';
import ResultatPage from './components/results/ResultatPage';
import { CurrencyDollarIcon } from './components/icons/CurrencyDollarIcon';
import PaiementsPage from './components/scholarship/PaiementsPage';
import { mockPayments } from './components/scholarship/mockPaymentData';
import BulletinsPage from './components/results/BulletinsPage';
import { mockGradeData } from './components/results/mockGradeData';
import { mockSubjectCoefficients } from './components/scholarship/mockSubjectData';
import PresencePunishmentPage from './components/students/PresencePunishmentPage';
import { UserGroupIcon } from './components/icons/UserGroupIcon';
import { ClipboardDocumentCheckIcon } from './components/icons/ClipboardDocumentCheckIcon';
import { ChartBarIcon } from './components/icons/ChartBarIcon';
import AttendanceAnalyticsPage from './components/students/AttendanceAnalyticsPage';
import EtatSaisiePage from './components/results/EtatSaisiePage';
import { ScaleIcon } from './components/icons/ScaleIcon';
import DisciplinePage from './components/students/DisciplinePage';
import { mockDisciplineIncidents } from './components/students/mockDisciplineData';
import ConseilDisciplinePage from './components/discipline/ConseilDisciplinePage';
import { GavelIcon } from './components/icons/GavelIcon';
import { mockCouncilMeetings } from './components/discipline/mockCouncilData';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';
import { ClockIcon } from './components/icons/ClockIcon';
import CurrentStatusPage from './components/scolarite/CurrentStatusPage';


// Custom hook for persisting state to localStorage
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
}


const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('sidebar.dashboard');
  const [schoolName, setSchoolName] = usePersistentState('schoolName', 'Northwood High');
  const [directorName, setDirectorName] = usePersistentState('directorName', 'Dr. Helmi Ahmed EL KAMEL');
  const [schoolLogoUrl, setSchoolLogoUrl] = usePersistentState<string | null>('schoolLogoUrl', null);
  const [schoolYear, setSchoolYear] = usePersistentState('schoolYear', '2025-2026');
  const [workingHours, setWorkingHours] = usePersistentState<DayWorkingHours[]>('workingHours', initialWorkingHours);
  const [optionalSubjects, setOptionalSubjects] = usePersistentState<string[]>('optionalSubjects', ['Musique', 'espagnole', 'allemand', 'Dessin']);
  const [classes, setClasses] = usePersistentState<Classe[]>('classes', initialClasses);
  const [students, setStudents] = usePersistentState<Student[]>('students', mockStudents);
  const [halls, setHalls] = usePersistentState<string[]>('halls', initialHalls);
  const [teachers, setTeachers] = usePersistentState<Teacher[]>('teachers', mockTeachers);
  const [payments, setPayments] = usePersistentState<Payment[]>('payments', mockPayments);
  const [grades, setGrades] = usePersistentState<StudentGrades[]>('grades', mockGradeData);
  const [subjectCoefficients, setSubjectCoefficients] = usePersistentState<SubjectCoefficient[]>('subjectCoefficients', mockSubjectCoefficients);
  const [attendanceData, setAttendanceData] = usePersistentState<AttendanceData>('attendanceData', {});
  const [disciplineIncidents, setDisciplineIncidents] = usePersistentState<DisciplineIncident[]>('disciplineIncidents', mockDisciplineIncidents);
  const [conseilDisciplineMembers, setConseilDisciplineMembers] = usePersistentState<ConseilDisciplineMembers>('conseilDisciplineMembers', mockConseilDisciplineMembers);
  const [disciplineCouncilMeetings, setDisciplineCouncilMeetings] = usePersistentState<DisciplineCouncilMeeting[]>('disciplineCouncilMeetings', mockCouncilMeetings);


  const schoolLogo = schoolLogoUrl ? <img src={schoolLogoUrl} alt="School Logo" className="h-8 w-8 object-contain" /> : <LogoIcon />;

  const [sharedFilters, setSharedFilters] = useState<SharedFilterState>({
    niveau: '1 annee',
    specialite: 'Tronc Commun',
    option: '',
    classe: '1 AS 1',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (filterName: keyof SharedFilterState, value: string) => {
    setSharedFilters(prev => {
        const newFilters = { ...prev, [filterName]: value };
        if (filterName === 'niveau') {
            newFilters.specialite = '';
            newFilters.classe = '';
            newFilters.option = '';
        } else if (filterName === 'specialite') {
            newFilters.classe = '';
        }
        return newFilters;
    });
  };

  const resetSharedFilters = () => {
      setSharedFilters({ niveau: '', specialite: '', option: '', classe: '' });
      setSearchQuery('');
  };


  // Simple routing based on path
  const path = window.location.pathname;
  if (path.startsWith('/attestation/inscription')) {
    return <AttestationInscriptionPage />;
  }
  if (path.startsWith('/attestation/presence')) {
    return <AttestationPresencePage />;
  }


  const navItems: NavItem[] = [
    { name: 'sidebar.dashboard', icon: <DashboardIcon /> },
    { 
      name: 'sidebar.scolarite', 
      icon: <StudentsIcon />,
      subItems: [
        { name: 'sidebar.management', icon: <UserGroupIcon className="h-5 w-5" /> },
        { name: 'sidebar.currentStatus', icon: <ClockIcon className="h-5 w-5" /> },
        { name: 'sidebar.registers', icon: <ClipboardDocumentCheckIcon className="h-5 w-5" /> },
        { name: 'sidebar.attendanceTracking', icon: <ChartBarIcon className="h-5 w-5" /> },
        { name: 'sidebar.incidentTracking', icon: <DocumentTextIcon className="h-5 w-5" /> },
        { name: 'sidebar.councilMeetings', icon: <GavelIcon className="h-5 w-5" /> },
      ],
    },
    { name: 'sidebar.teachers', icon: <TeachersIcon />, alert: true },
    {
      name: 'sidebar.timetables',
      icon: <CalendarIcon />,
      subItems: [
        { name: 'sidebar.teachers' },
        { name: 'sidebar.students' },
        { name: 'sidebar.halls' },
      ]
    },
    { 
      name: 'sidebar.scholarship', 
      icon: <ScholarshipIcon />,
      subItems: [
        { name: 'sidebar.management' },
        { name: 'sidebar.pedagogicalStatus' },
        { name: 'sidebar.payments', icon: <CurrencyDollarIcon /> },
      ]
    },
    { 
      name: 'sidebar.results', 
      icon: <DocumentChartBarIcon />,
      subItems: [
        { name: 'sidebar.gradeEntry' },
        { name: 'sidebar.entryStatus' },
        { name: 'sidebar.reportCards' },
      ]
    },
    { 
      name: 'sidebar.settings', 
      icon: <SettingsIcon />,
      subItems: [
        { name: 'sidebar.establishment', icon: <BuildingOfficeIcon /> },
        { name: 'sidebar.general', icon: <SettingsIcon /> },
      ]
    },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case 'sidebar.dashboard':
        return <DashboardPage
          students={students}
          teachers={teachers}
          classes={classes}
          payments={payments}
        />;
      case 'sidebar.scolarite > sidebar.management':
        return <StudentsPage 
          optionalSubjects={optionalSubjects} 
          classes={classes} 
          students={students} 
          setStudents={setStudents}
          filters={sharedFilters}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onResetFilters={resetSharedFilters}
        />;
      case 'sidebar.scolarite > sidebar.currentStatus':
        return <CurrentStatusPage
          classes={classes}
          workingHours={workingHours}
          teachers={teachers}
          halls={halls}
        />;
      case 'sidebar.scolarite > sidebar.registers':
        return <PresencePunishmentPage 
          classes={classes} 
          students={students} 
          workingHours={workingHours}
          attendanceData={attendanceData}
          setAttendanceData={setAttendanceData}
          disciplineIncidents={disciplineIncidents}
          setDisciplineIncidents={setDisciplineIncidents}
        />;
       case 'sidebar.scolarite > sidebar.attendanceTracking':
        return <AttendanceAnalyticsPage
          classes={classes}
          students={students}
          attendanceData={attendanceData}
          filters={sharedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetSharedFilters}
        />;
      case 'sidebar.scolarite > sidebar.incidentTracking':
        return <DisciplinePage
          classes={classes}
          students={students}
          disciplineIncidents={disciplineIncidents}
          setDisciplineIncidents={setDisciplineIncidents}
          setDisciplineCouncilMeetings={setDisciplineCouncilMeetings}
        />;
      case 'sidebar.scolarite > sidebar.councilMeetings':
        return <ConseilDisciplinePage
          students={students}
          teachers={teachers}
          disciplineIncidents={disciplineIncidents}
          setDisciplineIncidents={setDisciplineIncidents}
          councilMeetings={disciplineCouncilMeetings}
          setCouncilMeetings={setDisciplineCouncilMeetings}
          conseilDisciplineMembers={conseilDisciplineMembers}
        />;
      case 'sidebar.teachers':
        return <TeachersPage teachers={teachers} setTeachers={setTeachers} />;
      case 'sidebar.timetables > sidebar.teachers':
        return <TimetableTeachersPage workingHours={workingHours} schoolName={schoolName} directorName={directorName} teachers={teachers} />;
      case 'sidebar.timetables > sidebar.students':
        return <TimetableStudentsPage workingHours={workingHours} schoolName={schoolName} />;
      case 'sidebar.timetables > sidebar.halls':
        return <TimetableHallsPage workingHours={workingHours} schoolName={schoolName} />;
      case 'sidebar.scholarship':
      case 'sidebar.scholarship > sidebar.management':
        return <ScholarshipPage 
          subjectCoefficients={subjectCoefficients}
          setSubjectCoefficients={setSubjectCoefficients}
        />;
      case 'sidebar.scholarship > sidebar.pedagogicalStatus':
        return <EtatPedagogiquePage 
          optionalSubjects={optionalSubjects} 
          students={students}
          classes={classes}
          filters={sharedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetSharedFilters}
        />;
       case 'sidebar.scholarship > sidebar.payments':
        return <PaiementsPage
            students={students}
            classes={classes}
            payments={payments}
            setPayments={setPayments}
            filters={sharedFilters}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onResetFilters={resetSharedFilters}
        />;
      case 'sidebar.results':
      case 'sidebar.results > sidebar.gradeEntry':
        return <ResultatPage 
            teachers={teachers} 
            classes={classes}
            students={students}
            grades={grades}
            setGrades={setGrades}
        />;
      case 'sidebar.results > sidebar.entryStatus':
        return <EtatSaisiePage
          classes={classes}
          students={students}
          grades={grades}
        />;
      case 'sidebar.results > sidebar.reportCards':
        return <BulletinsPage
          students={students}
          classes={classes}
          grades={grades}
          schoolName={schoolName}
          directorName={directorName}
          subjectCoefficients={subjectCoefficients}
        />;
      case 'sidebar.settings': // Default to the first settings page
      case 'sidebar.settings > sidebar.establishment':
        return <EtablissementPage
          schoolName={schoolName}
          setSchoolName={setSchoolName}
          directorName={directorName}
          setDirectorName={setDirectorName}
          schoolLogoUrl={schoolLogoUrl}
          setSchoolLogoUrl={setSchoolLogoUrl}
          schoolYear={schoolYear}
          setSchoolYear={setSchoolYear}
          workingHours={workingHours}
          setWorkingHours={setWorkingHours}
          optionalSubjects={optionalSubjects}
          setOptionalSubjects={setOptionalSubjects}
          classes={classes}
          setClasses={setClasses}
          halls={halls}
          setHalls={setHalls}
          students={students}
          setStudents={setStudents}
          teachers={teachers}
          setTeachers={setTeachers}
          payments={payments}
          setPayments={setPayments}
          grades={grades}
          setGrades={setGrades}
          attendanceData={attendanceData}
          setAttendanceData={setAttendanceData}
          subjectCoefficients={subjectCoefficients}
          setSubjectCoefficients={setSubjectCoefficients}
          disciplineIncidents={disciplineIncidents}
          setDisciplineIncidents={setDisciplineIncidents}
          conseilDisciplineMembers={conseilDisciplineMembers}
          setConseilDisciplineMembers={setConseilDisciplineMembers}
          disciplineCouncilMeetings={disciplineCouncilMeetings}
          setDisciplineCouncilMeetings={setDisciplineCouncilMeetings}
        />;
      case 'sidebar.settings > sidebar.general':
        return <SettingsPage />;
      default:
        // Default to the first page of a section if the parent is somehow selected
        if (activeItem === 'sidebar.scolarite') return <StudentsPage optionalSubjects={optionalSubjects} classes={classes} students={students} setStudents={setStudents} filters={sharedFilters} onFilterChange={handleFilterChange} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onResetFilters={resetSharedFilters} />;
        if (activeItem === 'sidebar.timetables') return <TimetableTeachersPage workingHours={workingHours} schoolName={schoolName} directorName={directorName} teachers={teachers} />;
        if (activeItem === 'sidebar.scholarship') return <ScholarshipPage subjectCoefficients={subjectCoefficients} setSubjectCoefficients={setSubjectCoefficients} />;
        if (activeItem === 'sidebar.results') return <ResultatPage teachers={teachers} classes={classes} students={students} grades={grades} setGrades={setGrades} />;
        return <NotFoundPage onNavigateHome={() => setActiveItem('sidebar.dashboard')} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        logo={schoolLogo}
        schoolName={schoolName}
        className="no-print"
      >
        {navItems.map((item) => (
          <SidebarItem
            key={item.name}
            icon={item.icon}
            text={item.name}
            active={activeItem}
            alert={item.alert}
            onClick={(name) => setActiveItem(name)}
            subItems={item.subItems}
          />
        ))}
      </Sidebar>
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;