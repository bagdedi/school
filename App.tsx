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

// --- Data Generation Helpers ---
const studentFirstNamesMale = ['Karim', 'Ali', 'Mohamed', 'Ahmed', 'Youssef', 'Omar', 'Sami', 'Walid', 'Khaled', 'Anis', 'Hedi', 'Nizar', 'Fares', 'Rami', 'Zied'];
const studentFirstNamesFemale = ['Amira', 'Fatma', 'Salma', 'Mariem', 'Nour', 'Yasmine', 'Ines', 'Sarah', 'Leila', 'Rim', 'Hedia', 'Sonia', 'Faten', 'Amel', 'Cyrine'];
const studentLastNames = ['Ben Ali', 'Mansouri', 'Zouari', 'Trabelsi', 'Guesmi', 'Jlassi', 'Dridi', 'Amri', 'Chebbi', 'Saidi', 'Khemiri', 'Mejri', 'Hamdi', 'Toumi', 'Abbasi'];
const places = ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Nabeul', 'Monastir', 'Ariana', 'Ben Arous', 'Manouba'];
const optionalSubjectsList = ['Musique', 'espagnole', 'allemand', 'Dessin'];

const getSpecialiteAbbr = (specialite: string): string => {
  const abbreviations: { [key: string]: string } = {
    'Tronc commun': 'AS', 'Tronc Commun': 'AS', 'Sport': 'SPORT', 'Sciences': 'SC', 'Économie et Services': 'ECO-SERV',
    'Economie et Gestion': 'ECO-GES', 'Lettres': 'LETT', 'Sciences Expérimentales': 'SC.EXP', 'Mathématiques': 'MATH',
    'Techniques': 'TECH', 'Technologie': 'TECH', 'Sciences Informatiques': 'INFO', "Sciences de l'Informatique": 'INFO',
    "Technologie de l'Informatique": 'INFO-TECH'
  };
  return abbreviations[specialite] || specialite.substring(0, 4).toUpperCase();
};

const specializationsByLevel: { [key: string]: string[] } = {
  '1 annee': ['Tronc Commun'],
  '2 annee': ['Lettres', 'Économie et Services', 'Technologie de l\'Informatique', 'Sciences'],
  '3 annee': ['Lettres', 'Économie et Gestion', 'Sciences de l\'Informatique', 'Sciences Techniques', 'Sciences Expérimentales', 'Mathématiques', 'Sport'],
  '4 annee': ['Lettres', 'Économie et Gestion', 'Sciences de l\'Informatique', 'Sciences Techniques', 'Sciences Expérimentales', 'Mathématiques', 'Sport'],
};
const levels = ['1 annee', '2 annee', '3 annee', '4 annee'];

const generateClasses = (): Classe[] => {
    const classes: Classe[] = [];
    let classIdCounter = 1;
    levels.forEach(niveau => {
        const specialites = specializationsByLevel[niveau];
        specialites.forEach(specialite => {
            for (let i = 1; i <= 3; i++) {
                const niveauPrefix = niveau.split(' ')[0];
                const specialiteAbbr = getSpecialiteAbbr(specialite);
                const className = `${niveauPrefix} ${specialiteAbbr} ${i}`;
                classes.push({
                    id: `c${classIdCounter++}`,
                    niveau: niveau,
                    specialite: specialite,
                    number: i,
                    name: className,
                });
            }
        });
    });
    return classes.sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
};

const initialClasses: Classe[] = generateClasses();

const getBirthYearForLevel = (level: string): number => {
    const currentYear = new Date().getFullYear();
    switch (level) {
        case '1 annee': return currentYear - 15;
        case '2 annee': return currentYear - 16;
        case '3 annee': return currentYear - 17;
        case '4 annee': return currentYear - 18;
        default: return currentYear - 16;
    }
};

const generateStudents = (classes: Classe[]): Student[] => {
    const students: Student[] = [];
    let studentIdCounter = 1;

    classes.forEach(c => {
        for (let i = 0; i < 20; i++) {
            const gender = Math.random() > 0.5 ? 'Male' : 'Female';
            const firstName = gender === 'Male'
                ? studentFirstNamesMale[Math.floor(Math.random() * studentFirstNamesMale.length)]
                : studentFirstNamesFemale[Math.floor(Math.random() * studentFirstNamesFemale.length)];
            const lastName = studentLastNames[Math.floor(Math.random() * studentLastNames.length)];
            const id = `S${String(studentIdCounter).padStart(4, '0')}`;
            const birthYear = getBirthYearForLevel(c.niveau) + (Math.random() > 0.5 ? 0 : -1);
            
            students.push({
                id: id,
                matricule: `S2024${String(studentIdCounter).padStart(4, '0')}`,
                avatar: `https://i.pravatar.cc/150?u=${id}`,
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                dateOfBirth: `${birthYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                placeOfBirth: places[Math.floor(Math.random() * places.length)],
                address: `${Math.floor(Math.random() * 100) + 1} Avenue Habib Bourguiba, ${places[Math.floor(Math.random() * places.length)]}`,
                academicLevel: c.niveau,
                academicSpecialty: c.specialite,
                option: (c.niveau === '3 annee' || c.niveau === '4 annee') && Math.random() > 0.6 
                    ? optionalSubjectsList[Math.floor(Math.random() * optionalSubjectsList.length)]
                    : '',
                parentPhone: `216-${String(Math.floor(Math.random() * 80) + 20)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100).slice(0,3)}`,
                parentEmail: `${lastName.toLowerCase().replace(' ','')}.${firstName.charAt(0).toLowerCase()}.parent@email.com`,
                classe: c.name,
                schoolYear: '2025/2026',
                idNumber: `1${Array(7).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`,
                academicDiploma: c.niveau === '4 annee' ? 'Baccalauréat' : 'N/A',
            });
            studentIdCounter++;
        }
    });
    return students;
};

const mockStudents: Student[] = generateStudents(initialClasses);

const initialWorkingHours: DayWorkingHours[] = [
    { day: 'Lundi', dayIndex: 1, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
    { day: 'Mardi', dayIndex: 2, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
    { day: 'Mercredi', dayIndex: 3, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
    { day: 'Jeudi', dayIndex: 4, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
    { day: 'Vendredi', dayIndex: 5, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '', afternoonEnd: '' },
    { day: 'Samedi', dayIndex: 6, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '', afternoonEnd: '' },
];

const generateHalls = (): string[] => {
    const halls: string[] = [];
    for (let i = 1; i <= 28; i++) halls.push(`Salle ${i}`);
    for (let i = 1; i <= 4; i++) halls.push(`Labo PH ${i}`);
    for (let i = 1; i <= 4; i++) halls.push(`Labo SVT ${i}`);
    for (let i = 1; i <= 4; i++) halls.push(`Salle Informatique ${i}`);
    for (let i = 1; i <= 4; i++) halls.push(`Salle Technologie ${i}`);
    for (let i = 1; i <= 4; i++) halls.push(`Terrain du Sport ${i}`);
    return halls.sort((a,b) => a.localeCompare(b, undefined, { numeric: true }));
};
const initialHalls = generateHalls();


const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const [schoolName, setSchoolName] = useState('Northwood High');
  const [schoolLogo, setSchoolLogo] = useState<React.ReactNode>(<LogoIcon />);
  const [workingHours, setWorkingHours] = useState<DayWorkingHours[]>(initialWorkingHours);
  const [optionalSubjects, setOptionalSubjects] = useState<string[]>(['Musique', 'espagnole', 'allemand', 'Dessin']);
  const [classes, setClasses] = useState<Classe[]>(initialClasses);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [halls, setHalls] = useState<string[]>(initialHalls);

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
          halls={halls}
          setHalls={setHalls}
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