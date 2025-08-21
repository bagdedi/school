import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SidebarItem } from './components/SidebarItem';
import { DashboardIcon } from './components/icons/DashboardIcon';
import { StudentsIcon } from './components/icons/StudentsIcon';
import { TeachersIcon } from './components/icons/TeachersIcon';
import { ScholarshipIcon } from './components/icons/ScholarshipIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { LogoIcon } from './components/icons/LogoIcon';
import type { NavItem, DayWorkingHours, Classe, Student, SharedFilterState, Payment, StudentGrades, SubjectCoefficient, Teacher, AttendanceData } from './types';
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
import { initialClasses, mockStudents, initialWorkingHours, initialHalls, mockTeachers } from './components/timetable/mockData';
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
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const [schoolName, setSchoolName] = usePersistentState('schoolName', 'Northwood High');
  const [directorName, setDirectorName] = usePersistentState('directorName', 'Dr. Helmi Ahmed EL KAMEL');
  const [schoolLogoUrl, setSchoolLogoUrl] = usePersistentState<string | null>('schoolLogoUrl', null);
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


  const schoolLogo = schoolLogoUrl ? <img src={schoolLogoUrl} alt="School Logo" className="h-8 w-8 object-contain" /> : <LogoIcon />;

  const [sharedFilters, setSharedFilters] = useState<SharedFilterState>({
    niveau: '',
    specialite: '',
    option: '',
    classe: '',
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
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { 
      name: 'Scolarité', 
      icon: <StudentsIcon />,
      subItems: [
        { name: 'Management', icon: <UserGroupIcon className="h-5 w-5" /> },
        { name: 'Registres', icon: <ClipboardDocumentCheckIcon className="h-5 w-5" /> },
        { name: 'Suivi présence', icon: <ChartBarIcon className="h-5 w-5" /> },
      ],
    },
    { name: 'Teachers', icon: <TeachersIcon />, alert: true },
    {
      name: 'Emplois de temps',
      icon: <CalendarIcon />,
      subItems: [
        { name: 'Teachers' },
        { name: 'Students' },
        { name: 'Halls' },
      ]
    },
    { 
      name: 'Scholarship', 
      icon: <ScholarshipIcon />,
      subItems: [
        { name: 'Management' },
        { name: 'Etat Pédagogique' },
        { name: 'Paiements', icon: <CurrencyDollarIcon /> },
      ]
    },
    { 
      name: 'Résultat', 
      icon: <DocumentChartBarIcon />,
      subItems: [
        { name: 'Saisie des notes' },
        { name: 'Bulletins' },
      ]
    },
    { 
      name: 'Settings', 
      icon: <SettingsIcon />,
      subItems: [
        { name: 'Etablissement', icon: <BuildingOfficeIcon /> },
        { name: 'General', icon: <SettingsIcon /> },
      ]
    },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardPage
          students={students}
          teachers={teachers}
          classes={classes}
          payments={payments}
        />;
      case 'Scolarité > Management':
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
      case 'Scolarité > Registres':
        return <PresencePunishmentPage 
          classes={classes} 
          students={students} 
          workingHours={workingHours}
          attendanceData={attendanceData}
          setAttendanceData={setAttendanceData}
        />;
       case 'Scolarité > Suivi présence':
        return <AttendanceAnalyticsPage
          classes={classes}
          students={students}
          attendanceData={attendanceData}
          filters={sharedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetSharedFilters}
        />;
      case 'Teachers':
        return <TeachersPage teachers={teachers} setTeachers={setTeachers} />;
      case 'Emplois de temps > Teachers':
        return <TimetableTeachersPage workingHours={workingHours} schoolName={schoolName} directorName={directorName} teachers={teachers} />;
      case 'Emplois de temps > Students':
        return <TimetableStudentsPage workingHours={workingHours} schoolName={schoolName} />;
      case 'Emplois de temps > Halls':
        return <TimetableHallsPage workingHours={workingHours} schoolName={schoolName} />;
      case 'Scholarship':
      case 'Scholarship > Management':
        return <ScholarshipPage 
          subjectCoefficients={subjectCoefficients}
          setSubjectCoefficients={setSubjectCoefficients}
        />;
      case 'Scholarship > Etat Pédagogique':
        return <EtatPedagogiquePage 
          optionalSubjects={optionalSubjects} 
          students={students}
          classes={classes}
          filters={sharedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetSharedFilters}
        />;
       case 'Scholarship > Paiements':
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
      case 'Résultat':
      case 'Résultat > Saisie des notes':
        return <ResultatPage 
            teachers={teachers} 
            classes={classes}
            students={students}
            grades={grades}
            setGrades={setGrades}
        />;
      case 'Résultat > Bulletins':
        return <BulletinsPage
          students={students}
          classes={classes}
          grades={grades}
          schoolName={schoolName}
          directorName={directorName}
          subjectCoefficients={subjectCoefficients}
        />;
      case 'Settings': // Default to the first settings page
      case 'Settings > Etablissement':
        return <EtablissementPage
          schoolName={schoolName}
          setSchoolName={setSchoolName}
          schoolLogo={schoolLogo}
          setSchoolLogoUrl={setSchoolLogoUrl}
          workingHours={workingHours}
          setWorkingHours={setWorkingHours}
          optionalSubjects={optionalSubjects}
          setOptionalSubjects={setOptionalSubjects}
          classes={classes}
          setClasses={setClasses}
          halls={halls}
          setHalls={setHalls}
          directorName={directorName}
          setDirectorName={setDirectorName}
        />;
      case 'Settings > General':
        return <SettingsPage />;
      default:
        // Default to the first page of a section if the parent is somehow selected
        if (activeItem === 'Scolarité') return <StudentsPage optionalSubjects={optionalSubjects} classes={classes} students={students} setStudents={setStudents} filters={sharedFilters} onFilterChange={handleFilterChange} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onResetFilters={resetSharedFilters} />;
        if (activeItem === 'Emplois de temps') return <TimetableTeachersPage workingHours={workingHours} schoolName={schoolName} directorName={directorName} teachers={teachers} />;
        if (activeItem === 'Scholarship') return <ScholarshipPage subjectCoefficients={subjectCoefficients} setSubjectCoefficients={setSubjectCoefficients} />;
        if (activeItem === 'Résultat') return <ResultatPage teachers={teachers} classes={classes} students={students} grades={grades} setGrades={setGrades} />;
        return <NotFoundPage onNavigateHome={() => setActiveItem('Dashboard')} />;
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