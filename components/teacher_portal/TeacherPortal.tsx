import React, { useState } from 'react';
import type { Teacher, Student, Classe, StudentGrades, AttendanceData, TeacherDocument, DayWorkingHours } from '../../types';
import { TeacherSidebar } from './TeacherSidebar';
import { SidebarItem } from '../SidebarItem';
import { DashboardIcon } from '../icons/DashboardIcon';
import { DocumentChartBarIcon } from '../icons/DocumentChartBarIcon';
import { ClipboardUserIcon } from '../icons/ClipboardUserIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import TeacherDashboardPage from './TeacherDashboardPage';
import TeacherGradeEntryPage from './TeacherGradeEntryPage';
import TeacherRegisterPage from './TeacherRegisterPage';
import TeacherDocumentsPage from './TeacherDocumentsPage';
import { NotFoundPage } from '../common/NotFoundPage';

interface TeacherPortalProps {
  teacher: Teacher;
  onLogout: () => void;
  students: Student[];
  classes: Classe[];
  grades: StudentGrades[];
  setGrades: React.Dispatch<React.SetStateAction<StudentGrades[]>>;
  attendanceData: AttendanceData;
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceData>>;
  documents: TeacherDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<TeacherDocument[]>>;
  workingHours: DayWorkingHours[];
}

const TeacherPortal: React.FC<TeacherPortalProps> = (props) => {
  const { teacher, onLogout } = props;

  const path = window.location.pathname;
  const initialActive = 'teacher.' + (path.split('/')[2] || 'dashboard');
  const [activeItem, setActiveItem] = useState(initialActive);
  
  const handleNavClick = (name: string) => {
    setActiveItem(name);
    const newPath = '/teacher/' + name.split('.')[1];
    window.history.pushState({}, '', newPath);
  }

  const navItems = [
    { name: 'teacher.dashboard', text: 'sidebar.dashboard', icon: <DashboardIcon /> },
    { name: 'teacher.gradeEntry', text: 'sidebar.gradeEntry', icon: <DocumentChartBarIcon /> },
    { name: 'teacher.register', text: 'sidebar.registers', icon: <ClipboardUserIcon className="h-6 w-6"/> },
    { name: 'teacher.documents', text: 'sidebar.documents', icon: <BookOpenIcon /> },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case 'teacher.dashboard':
        return <TeacherDashboardPage teacher={teacher} />;
      case 'teacher.gradeEntry':
        return <TeacherGradeEntryPage teacher={teacher} students={props.students} classes={props.classes} grades={props.grades} setGrades={props.setGrades} />;
      case 'teacher.register':
        return <TeacherRegisterPage teacher={teacher} students={props.students} classes={props.classes} workingHours={props.workingHours} attendanceData={props.attendanceData} setAttendanceData={props.setAttendanceData} />;
      case 'teacher.documents':
        return <TeacherDocumentsPage teacher={teacher} documents={props.documents} setDocuments={props.setDocuments} classes={props.classes} />;
      default:
        return <NotFoundPage onNavigateHome={() => handleNavClick('teacher.dashboard')} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <TeacherSidebar teacher={teacher} onLogout={onLogout}>
        {navItems.map((item) => (
          <SidebarItem
            key={item.name}
            icon={item.icon}
            text={item.text} 
            active={activeItem.replace('teacher.', 'sidebar.')}
            onClick={() => handleNavClick(item.name)}
          />
        ))}
      </TeacherSidebar>
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default TeacherPortal;