import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { SidebarItem } from './components/SidebarItem';
import { DashboardIcon } from './components/icons/DashboardIcon';
import { StudentsIcon } from './components/icons/StudentsIcon';
import { TeachersIcon } from './components/icons/TeachersIcon';
import { ScholarshipIcon } from './components/icons/ScholarshipIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { LogoIcon } from './components/icons/LogoIcon';
import type { NavItem, DayWorkingHours, Classe, Student, SharedFilterState } from './types';
import DashboardPage from './components/dashboard/DashboardPage';
import StudentsPage from './components/students/StudentsPage';
import TeachersPage from './components/teachers/TeachersPage';
import ScholarshipPage from './components/scholarship/ScholarshipPage';
import SettingsPage from './components/settings/SettingsPage';
import AttestationPage from './components/students/AttestationPage';
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

const mockStudents: Student[] = [
  { 
    id: 'S001', 
    matricule: 'S2024001',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    firstName: 'Amira', 
    lastName: 'Ben Ali', 
    gender: 'Female',
    dateOfBirth: '2005-08-12',
    placeOfBirth: 'Tunis',
    address: '15 Rue de la Liberté, Tunis',
    academicLevel: '3 annee',
    academicSpecialty: 'Sciences Expérimentales',
    option: 'Musique',
    parentPhone: '216-22-333-444',
    parentEmail: 'ben.ali.parent@email.com',
    classe: '3 SC.EXP. 1',
    schoolYear: '2025/2026',
    idNumber: '12345678',
    academicDiploma: 'Baccalauréat',
  },
  { 
    id: 'S002', 
    matricule: 'S2024002',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    firstName: 'Karim', 
    lastName: 'Mansouri', 
    gender: 'Male',
    dateOfBirth: '2007-02-25',
    placeOfBirth: 'Sfax',
    address: '8 Avenue Hedi Chaker, Sfax',
    academicLevel: '1 annee',
    academicSpecialty: 'Tronc commun',
    option: '',
    parentPhone: '216-98-765-432',
    parentEmail: 'k.mansouri.parent@email.com',
    classe: '1 AS 2',
    schoolYear: '2025/2026',
    idNumber: '87654321',
    academicDiploma: 'N/A',
  },
  { 
    id: 'S003', 
    matricule: 'S2024003',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    firstName: 'Fatma', 
    lastName: 'Zouari', 
    gender: 'Female',
    dateOfBirth: '2006-11-03',
    placeOfBirth: 'Sousse',
    address: '123 Boulevard de l\'Environnement, Sousse',
    academicLevel: '2 annee',
    academicSpecialty: 'Economie et Gestion',
    option: '',
    parentPhone: '216-55-111-222',
    parentEmail: '',
    classe: '2 ECO-GES. 1',
    schoolYear: '2025/2026',
    idNumber: '11223344',
    academicDiploma: 'N/A',
  },
];

const initialWorkingHours: DayWorkingHours[] = [
    { day: 'Lundi', dayIndex: 1, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '17:00' },
    { day: 'Mardi', dayIndex: 2, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '17:00' },
    { day: 'Mercredi', dayIndex: 3, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '17:00' },
    { day: 'Jeudi', dayIndex: 4, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '17:00' },
    { day: 'Vendredi', dayIndex: 5, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '17:00' },
    { day: 'Samedi', dayIndex: 6, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '', afternoonEnd: '' },
];

const initialClasses: Classe[] = [
    { id: 'c1', niveau: '1 annee', specialite: 'Tronc commun', number: 1, name: '1 AS 1' },
    { id: 'c2', niveau: '1 annee', specialite: 'Tronc commun', number: 2, name: '1 AS 2' },
    { id: 'c3', niveau: '2 annee', specialite: 'Sciences', number: 1, name: '2 SC. 1' },
    { id: 'c4', niveau: '2 annee', specialite: 'Economie et Gestion', number: 1, name: '2 ECO-GES. 1' },
    { id: 'c5', niveau: '3 annee', specialite: 'Sciences Expérimentales', number: 1, name: '3 SC.EXP. 1' },
];


const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const [schoolName, setSchoolName] = useState('Northwood High');
  const [schoolLogo, setSchoolLogo] = useState<React.ReactNode>(<LogoIcon />);
  const [workingHours, setWorkingHours] = useState<DayWorkingHours[]>(initialWorkingHours);
  const [optionalSubjects, setOptionalSubjects] = useState<string[]>(['Musique', 'espagnole', 'allemand', 'Dessin']);
  const [classes, setClasses] = useState<Classe[]>(initialClasses);
  const [students, setStudents] = useState<Student[]>(mockStudents);

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
      name: 'Students', 
      icon: <StudentsIcon />,
      subItems: [
        { name: 'Management' },
        { name: 'Attestation' },
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
        return <DashboardPage />;
      case 'Students > Management':
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
      case 'Students > Attestation':
        return <AttestationPage 
          students={students}
          classes={classes}
          filters={sharedFilters}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onResetFilters={resetSharedFilters}
        />;
      case 'Teachers':
        return <TeachersPage />;
      case 'Emplois de temps > Teachers':
        return <TimetableTeachersPage workingHours={workingHours} schoolName={schoolName} />;
      case 'Emplois de temps > Students':
        return <TimetableStudentsPage workingHours={workingHours} schoolName={schoolName} />;
      case 'Emplois de temps > Halls':
        return <TimetableHallsPage workingHours={workingHours} schoolName={schoolName} />;
      case 'Scholarship':
      case 'Scholarship > Management':
        return <ScholarshipPage />;
      case 'Scholarship > Etat Pédagogique':
        return <EtatPedagogiquePage 
          optionalSubjects={optionalSubjects} 
          students={students}
          filters={sharedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetSharedFilters}
        />;
      case 'Settings': // Default to the first settings page
      case 'Settings > Etablissement':
        return <EtablissementPage
          schoolName={schoolName}
          setSchoolName={setSchoolName}
          schoolLogo={schoolLogo}
          setSchoolLogo={setSchoolLogo}
          workingHours={workingHours}
          setWorkingHours={setWorkingHours}
          optionalSubjects={optionalSubjects}
          setOptionalSubjects={setOptionalSubjects}
          classes={classes}
          setClasses={setClasses}
        />;
      case 'Settings > General':
        return <SettingsPage />;
      default:
        // Default to the first page of a section if the parent is somehow selected
        if (activeItem === 'Students') return <StudentsPage optionalSubjects={optionalSubjects} classes={classes} students={students} setStudents={setStudents} filters={sharedFilters} onFilterChange={handleFilterChange} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onResetFilters={resetSharedFilters} />;
        if (activeItem === 'Emplois de temps') return <TimetableTeachersPage workingHours={workingHours} schoolName={schoolName} />;
        if (activeItem === 'Scholarship') return <ScholarshipPage />;
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