import React, { useState, useMemo, useEffect } from 'react';
import type { Classe, Student, Teacher, DayWorkingHours, AttendanceStatus, DailyClassAttendance, AttendanceData, TimetableEvent } from '../../types';
import { mockEvents } from '../timetable/mockData';
import { Toaster, toast } from 'react-hot-toast';

// Re-using helper from PresencePunishmentPage
const statusCycle: (AttendanceStatus | null)[] = [null, 'A', 'R', 'EX'];

const getStatusStyles = (status: AttendanceStatus | null): string => {
    switch (status) {
        case 'A': return 'bg-red-100 text-red-800 font-bold ring-1 ring-red-200';
        case 'R': return 'bg-yellow-100 text-yellow-800 font-bold ring-1 ring-yellow-200';
        case 'EX': return 'bg-purple-100 text-purple-800 font-bold ring-1 ring-purple-200';
        default: return 'hover:bg-gray-100 focus:bg-indigo-100';
    }
};

interface TeacherRegisterPageProps {
  teacher: Teacher;
  classes: Classe[];
  students: Student[];
  workingHours: DayWorkingHours[];
  attendanceData: AttendanceData;
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceData>>;
}

const TeacherRegisterPage: React.FC<TeacherRegisterPageProps> = ({ teacher, classes, students, workingHours, attendanceData, setAttendanceData }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const { currentEvent, nextEvent } = useMemo(() => {
    const now = currentTime;
    const dayIndex = now.getDay() === 0 ? 7 : now.getDay();
    const nowInMinutes = now.getHours() * 60 + now.getMinutes();
    
    const teacherName = `${teacher.firstName} ${teacher.lastName}`;
    
    const teachersEventsToday = mockEvents
      .filter(e => e.teacher === teacherName && e.day === dayIndex)
      .sort((a,b) => a.startTime.localeCompare(b.startTime));
      
    const timeToMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    }

    const current = teachersEventsToday.find(e => {
        const start = timeToMinutes(e.startTime);
        const end = timeToMinutes(e.endTime);
        return nowInMinutes >= start && nowInMinutes < end;
    });

    const next = teachersEventsToday.find(e => timeToMinutes(e.startTime) > nowInMinutes);

    return { currentEvent: current, nextEvent: next };
  }, [currentTime, teacher]);

  const selectedClass = useMemo(() => {
    if (!currentEvent) return null;
    return classes.find(c => currentEvent.className.startsWith(c.name)) || null;
  }, [currentEvent, classes]);
  
  const selectedDateStr = useMemo(() => currentTime.toISOString().split('T')[0], [currentTime]);
  
  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students
      .filter(s => s.classe === selectedClass.name)
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [students, selectedClass]);
  
  const attendanceForClassToday = useMemo(() => {
    if (!selectedClass) return {};
    return attendanceData[selectedDateStr]?.[selectedClass.name] || {};
  }, [attendanceData, selectedDateStr, selectedClass]);
  
  const handleAttendanceChange = (studentId: string, status: AttendanceStatus | null) => {
    if (!selectedClass || !currentEvent) return;
    const className = selectedClass.name;

    const [startHour] = currentEvent.startTime.split(':').map(Number);
    const [endHour] = currentEvent.endTime.split(':').map(Number);

    let timeLabelsToUpdate: string[] = [];
    for(let h = startHour; h < endHour; h++) {
        timeLabelsToUpdate.push(`${String(h).padStart(2, '0')}-${String(h + 1).padStart(2, '0')}`);
    }
    
    setAttendanceData(prev => {
        const updatedStudentData = { ...(prev[selectedDateStr]?.[className]?.[studentId] || {}) };
        timeLabelsToUpdate.forEach(label => {
            updatedStudentData[label] = status;
        });

        return {
            ...prev,
            [selectedDateStr]: {
                ...(prev[selectedDateStr] || {}),
                [className]: {
                    ...(prev[selectedDateStr]?.[className] || {}),
                    [studentId]: updatedStudentData
                }
            }
        };
    });
    toast.success("Statut enregistré.", { duration: 1500 });
  };
  
  const handleCellClick = (studentId: string) => {
    if (!selectedClass) return;
    const className = selectedClass.name;
    const [startHour] = currentEvent.startTime.split(':').map(Number);
    const timeLabel = `${String(startHour).padStart(2, '0')}-${String(startHour + 1).padStart(2, '0')}`;
    
    const currentStatus = attendanceData[selectedDateStr]?.[className]?.[studentId]?.[timeLabel] || null;
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    handleAttendanceChange(studentId, nextStatus);
  };


  return (
    <div className="space-y-6">
      <Toaster position="top-center"/>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Registre d'Appel</h1>
        <p className="mt-1 text-gray-600">
            {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {' - '}
            {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        {currentEvent && selectedClass ? (
          <div className="animate-fade-in">
             <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-6">
                <h2 className="text-xl font-bold text-indigo-800">Séance en cours</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-indigo-700">
                    <p><strong>Heure:</strong> {currentEvent.startTime} - {currentEvent.endTime}</p>
                    <p><strong>Classe:</strong> {currentEvent.className}</p>
                    <p><strong>Matière:</strong> {currentEvent.subject}</p>
                    <p><strong>Salle:</strong> {currentEvent.hall}</p>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="py-3 px-4 font-semibold w-16">N°</th>
                            <th className="py-3 px-4 font-semibold">Étudiant</th>
                            <th className="py-3 px-4 font-semibold text-center w-48">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {classStudents.map((student, index) => {
                            const [startHour] = currentEvent.startTime.split(':').map(Number);
                            const timeLabel = `${String(startHour).padStart(2, '0')}-${String(startHour + 1).padStart(2, '0')}`;
                            const status = attendanceData[selectedDateStr]?.[selectedClass.name]?.[student.id]?.[timeLabel] || null;

                            return (
                                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-2 px-4 text-center">{index + 1}</td>
                                    <td className="py-2 px-4 capitalize">{`${student.lastName} ${student.firstName}`}</td>
                                    <td className="py-2 px-4 text-center">
                                        <button 
                                            onClick={() => handleCellClick(student.id)}
                                            className={`w-28 text-sm font-semibold py-1.5 px-3 rounded-full transition-colors ${getStatusStyles(status)}`}
                                        >
                                            {status === 'A' ? 'Absent(e)' : status === 'R' ? 'En Retard' : status === 'EX' ? 'Exclu(e)' : 'Présent(e)'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
             </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucune séance en cours</h2>
            {nextEvent ? (
              <p>Prochaine séance : <span className="font-bold text-gray-600">{nextEvent.subject}</span> à <span className="font-bold text-gray-600">{nextEvent.startTime}</span> avec la classe <span className="font-bold text-gray-600">{nextEvent.className}</span>.</p>
            ) : (
              <p>Pas d'autres séances prévues aujourd'hui.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherRegisterPage;