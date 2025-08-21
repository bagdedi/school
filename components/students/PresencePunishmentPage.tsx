import React, { useState, useMemo } from 'react';
import type { Classe, Student, TimetableEvent, DayWorkingHours, AttendanceStatus, DailyClassAttendance, AttendanceData } from '../../types';
import { mockEvents } from '../timetable/mockData';
import { Toaster, toast } from 'react-hot-toast';

// --- HELPER FUNCTIONS & CONSTANTS ---
const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const statusCycle: (AttendanceStatus | null)[] = [null, 'A', 'R', 'EX'];

const getStatusStyles = (status: AttendanceStatus | null): string => {
    switch (status) {
        case 'A': return 'bg-red-100 text-red-800 font-bold ring-1 ring-red-200';
        case 'R': return 'bg-yellow-100 text-yellow-800 font-bold ring-1 ring-yellow-200';
        case 'EX': return 'bg-purple-100 text-purple-800 font-bold ring-1 ring-purple-200';
        default: return 'hover:bg-gray-100 focus:bg-indigo-100';
    }
};

// --- COMPONENTS ---

interface AttendanceRegisterProps {
  classe: Classe;
  students: Student[];
  events: TimetableEvent[];
  workingHours: DayWorkingHours[];
  attendanceForClassToday: DailyClassAttendance;
  onAttendanceChange: (studentId: string, timeLabel: string, status: AttendanceStatus | null) => void;
}

const AttendanceRegister: React.FC<AttendanceRegisterProps> = ({ classe, students, events, workingHours, attendanceForClassToday, onAttendanceChange }) => {
  const today = useMemo(() => new Date(), []);
  const dayIndex = today.getDay() === 0 ? 7 : today.getDay(); // Sunday: 0 -> 7, Monday: 1, etc.
  
  const classStudents = useMemo(() => 
    students
      .filter(s => s.classe === classe.name)
      .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)),
    [students, classe]
  );
  
  const daySchedule = useMemo(() => workingHours.find(wh => wh.dayIndex === dayIndex), [workingHours, dayIndex]);
  
  const morningEndHour = useMemo(() => {
    if (!daySchedule || !daySchedule.isWorkingDay || !daySchedule.morningEnd) return null;
    return Math.ceil(timeToMinutes(daySchedule.morningEnd) / 60);
  }, [daySchedule]);

  const timeSlots = useMemo(() => {
    const todaysEvents = events
      .filter(e => e.className.startsWith(classe.name) && e.day === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (!daySchedule || !daySchedule.isWorkingDay) {
        return [];
    }

    const slots = new Map<string, string>();

    const addSlots = (start: string, end: string) => {
        if (!start || !end) return;
        const startHour = timeToMinutes(start) / 60;
        const endHour = timeToMinutes(end) / 60;

        for (let hour = Math.floor(startHour); hour < Math.ceil(endHour); hour++) {
            const timeLabel = `${String(hour).padStart(2, '0')}-${String(hour + 1).padStart(2, '0')}`;
            if (!slots.has(timeLabel)) {
                slots.set(timeLabel, ''); // Initialize with empty subject
            }
        }
    };
    
    addSlots(daySchedule.morningStart, daySchedule.morningEnd);
    addSlots(daySchedule.afternoonStart, daySchedule.afternoonEnd);
    
    todaysEvents.forEach(event => {
        const startHour = Math.floor(timeToMinutes(event.startTime) / 60);
        const endHour = Math.ceil(timeToMinutes(event.endTime) / 60);
        for(let hour = startHour; hour < endHour; hour++) {
            const timeLabel = `${String(hour).padStart(2, '0')}-${String(hour + 1).padStart(2, '0')}`;
            if(slots.has(timeLabel)){
                slots.set(timeLabel, event.subject);
            }
        }
    });

    const sortedSlots = new Map([...slots.entries()].sort());

    if (sortedSlots.size === 0) return [];

    return Array.from(sortedSlots.entries()).map(([timeLabel, subject]) => ({ timeLabel, subject }));
  }, [events, classe, dayIndex, workingHours, daySchedule]);

  const formattedDate = today.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const handleCellClick = (studentId: string, timeLabel: string) => {
    const slot = timeSlots.find(s => s.timeLabel === timeLabel);
    if (slot && !slot.subject) {
        toast.error("Impossible de marquer une présence pour une heure creuse.", { duration: 2000 });
        return;
    }
    const currentStatus = attendanceForClassToday[studentId]?.[timeLabel] || null;
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    onAttendanceChange(studentId, timeLabel, nextStatus);
  };

  if (classStudents.length === 0) {
    return (
      <div className="mt-8 pt-6 border-t animate-fade-in text-center text-gray-500">
        <p>Aucun étudiant trouvé pour la classe {classe.name}.</p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
       <div className="mt-8 pt-6 border-t animate-fade-in text-center text-gray-500">
        <p>Aucun cours programmé pour la classe {classe.name} aujourd'hui ({formattedDate}).</p>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t animate-fade-in space-y-4">
      <h3 className="text-xl font-bold text-center text-gray-800">{formattedDate}</h3>
      <div className="overflow-x-auto border-2 border-black rounded-lg">
        <table className="min-w-full border-collapse table-fixed">
           <colgroup>
            <col style={{ width: '56px' }} />
            <col style={{ width: '256px' }} />
            {timeSlots.map(({ timeLabel }) => (
              <col key={timeLabel} style={{ width: '60px' }} />
            ))}
          </colgroup>
          <thead className="text-sm font-bold bg-gray-50 text-center">
            <tr>
              <th style={{ width: '56px' }} className="sticky top-0 left-0 bg-gray-50 z-30 p-2 border-b-2 border-r-2 border-black">N°</th>
              <th style={{ width: '256px', left: '56px' }} className="sticky top-0 bg-gray-50 z-30 p-2 border-b-2 border-r-4 border-black">Nom et Prénom</th>
              {timeSlots.map(({ timeLabel }) => {
                const slotEndHour = parseInt(timeLabel.split('-')[1], 10);
                const isLastMorningSlot = morningEndHour !== null && slotEndHour === morningEndHour;
                return (
                    <th key={timeLabel} className={`sticky top-0 p-2 border-b-2 bg-gray-50 z-20 ${isLastMorningSlot ? 'border-r-4 border-black' : 'border-r border-black'}`}>
                    {timeLabel}
                    </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {classStudents.map((student, index) => (
              <tr key={student.id} className="text-sm even:bg-white odd:bg-gray-50/70">
                <td style={{ width: '56px' }} className="sticky left-0 z-10 p-2 border-b border-r-2 border-black text-center even:bg-white odd:bg-gray-50/70">{index + 1}</td>
                <td style={{ width: '256px', left: '56px' }} className="sticky z-10 p-2 border-b border-r-4 border-black truncate capitalize even:bg-white odd:bg-gray-50/70">{`${student.lastName} ${student.firstName}`}</td>
                {timeSlots.map(({ timeLabel, subject }) => {
                  const status = attendanceForClassToday[student.id]?.[timeLabel] || null;
                  const hasCourse = !!subject;
                  const slotEndHour = parseInt(timeLabel.split('-')[1], 10);
                  const isLastMorningSlot = morningEndHour !== null && slotEndHour === morningEndHour;
                  return (
                    <td key={`${student.id}-${timeLabel}`} className={`p-0 border-b ${isLastMorningSlot ? 'border-r-4 border-gray-400' : 'border-r border-gray-300'}`}>
                      <button 
                        onClick={() => handleCellClick(student.id, timeLabel)}
                        className={`w-full h-10 transition-colors text-base ${getStatusStyles(status)} ${!hasCourse && !status ? 'bg-slate-100 cursor-help' : ''}`}
                        aria-label={`Statut pour ${student.lastName} à ${timeLabel}`}
                      >
                        {status}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
           <tfoot className="text-xs font-semibold bg-gray-50 text-center">
             <tr>
                <td className="sticky left-0 bg-gray-50 z-20 p-1 border-t-2 border-r-2 border-black h-28"></td>
                <td className="sticky bg-gray-50 z-20 p-1 border-t-2 border-r-4 border-black" style={{ left: '56px' }}></td>
                {timeSlots.map(({ timeLabel, subject }) => {
                  const slotEndHour = parseInt(timeLabel.split('-')[1], 10);
                  const isLastMorningSlot = morningEndHour !== null && slotEndHour === morningEndHour;
                  return (
                    <td key={timeLabel} className={`p-1 border-t-2 align-middle ${isLastMorningSlot ? 'border-r-4 border-black' : 'border-r border-black'}`}>
                        <div className="flex items-center justify-center h-full">
                            <span className="transform -rotate-90 whitespace-nowrap">{subject}</span>
                        </div>
                    </td>
                  );
                })}
             </tr>
           </tfoot>
        </table>
      </div>
    </div>
  );
};


interface PresencePunishmentPageProps {
  classes: Classe[];
  students: Student[];
  workingHours: DayWorkingHours[];
  attendanceData: AttendanceData;
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceData>>;
}

const PresencePunishmentPage: React.FC<PresencePunishmentPageProps> = ({ classes, students, workingHours, attendanceData, setAttendanceData }) => {
  const levels = useMemo(() => {
    const uniqueLevels = [...new Set(classes.map(c => c.niveau))];
    return uniqueLevels.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [classes]);

  const [activeLevel, setActiveLevel] = useState<string | null>(levels.length > 0 ? levels[0] : null);
  const [selectedClass, setSelectedClass] = useState<Classe | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const classesForActiveLevel = useMemo(() => {
    if (!activeLevel) return [];
    return classes
      .filter(c => c.niveau === activeLevel)
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }, [activeLevel, classes]);

  React.useEffect(() => {
    setSelectedClass(null);
  }, [activeLevel]);

  const attendanceForClassToday = useMemo(() => {
    if (!selectedClass) return {};
    return attendanceData[todayStr]?.[selectedClass.name] || {};
  }, [attendanceData, todayStr, selectedClass]);
  
  const handleAttendanceChange = (studentId: string, timeLabel: string, status: AttendanceStatus | null) => {
      if (!selectedClass) return;
      const className = selectedClass.name;
      
      setAttendanceData(prev => {
          const prevDateData = prev[todayStr] || {};
          const prevClassData = prevDateData[className] || {};
          const prevStudentData = prevClassData[studentId] || {};

          return {
              ...prev,
              [todayStr]: {
                  ...prevDateData,
                  [className]: {
                      ...prevClassData,
                      [studentId]: {
                          ...prevStudentData,
                          [timeLabel]: status
                      }
                  }
              }
          };
      });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md space-y-8">
      <Toaster position="top-center" />
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Suivi Présences et Punitions</h1>
        <p className="mt-1 text-gray-600">Sélectionnez un niveau, puis une classe pour afficher le registre d'appel.</p>
      </div>

      {levels.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Niveaux</h2>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-t-sm
                    ${
                      activeLevel === level
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                  aria-current={activeLevel === level ? 'page' : undefined}
                >
                  {level}
                </button>
              ))}
            </nav>
          </div>
        </div>
      ) : (
         <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border">
          <p>Aucune classe n'est configurée dans les paramètres de l'établissement.</p>
          <p className="text-sm mt-1">Veuillez ajouter des classes dans 'Settings &gt; Etablissement' pour utiliser cette fonctionnalité.</p>
        </div>
      )}

      {activeLevel && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Classes du niveau: {activeLevel}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {classesForActiveLevel.map(classe => (
              <button
                key={classe.id}
                onClick={() => setSelectedClass(classe)}
                className={`
                  p-4 rounded-lg text-center font-semibold transition-all duration-200 ease-in-out
                  border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  ${
                    selectedClass?.id === classe.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md'
                  }
                `}
              >
                {classe.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {selectedClass ? (
        <AttendanceRegister 
            key={selectedClass.id}
            classe={selectedClass}
            students={students}
            events={mockEvents}
            workingHours={workingHours}
            attendanceForClassToday={attendanceForClassToday}
            onAttendanceChange={handleAttendanceChange}
        />
      ) : (
         <div className="mt-8 pt-6 border-t animate-fade-in text-center text-gray-500">
            <p className="font-semibold text-lg">Veuillez sélectionner une classe</p>
            <p>Le registre des présences pour la classe sélectionnée s'affichera ici.</p>
        </div>
      )}
    </div>
  );
};

export default PresencePunishmentPage;