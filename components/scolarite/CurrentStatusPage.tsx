import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Classe, DayWorkingHours, TimetableEvent, Teacher } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import { mockEvents } from '../timetable/mockData';
import { ClockIcon } from '../icons/ClockIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { UserIcon } from '../icons/UserIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { BuildingLibraryIcon } from '../icons/BuildingLibraryIcon';
import { CoffeeIcon } from '../icons/CoffeeIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { ArrowPathIcon } from '../icons/ArrowPathIcon';

// --- HELPER FUNCTIONS ---

const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTimeStr = (minutes: number): string => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};


const getLevelColor = (niveau: string): string => {
  if (niveau.startsWith('1 annee')) return 'bg-blue-100 text-blue-800 border border-blue-200';
  if (niveau.startsWith('2 annee')) return 'bg-green-100 text-green-800 border border-green-200';
  if (niveau.startsWith('3 annee')) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
  if (niveau.startsWith('4 annee')) return 'bg-purple-100 text-purple-800 border border-purple-200';
  return 'bg-gray-100 text-gray-800 border border-gray-200';
};

const subjectColors = [
  'bg-red-100 text-red-800', 'bg-orange-100 text-orange-800', 'bg-amber-100 text-amber-800',
  'bg-yellow-100 text-yellow-800', 'bg-lime-100 text-lime-800', 'bg-green-100 text-green-800',
  'bg-emerald-100 text-emerald-800', 'bg-teal-100 text-teal-800', 'bg-cyan-100 text-cyan-800',
  'bg-sky-100 text-sky-800', 'bg-blue-100 text-blue-800', 'bg-indigo-100 text-indigo-800',
  'bg-violet-100 text-violet-800', 'bg-purple-100 text-purple-800', 'bg-fuchsia-100 text-fuchsia-800',
  'bg-pink-100 text-pink-800', 'bg-rose-100 text-rose-800'
];

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % subjectColors.length);
  return subjectColors[index];
};

interface MultiEventCellProps {
  events: TimetableEvent[];
  field: 'subject' | 'teacher' | 'hall' | 'className';
  classes: Classe[];
}

const MultiEventCell: React.FC<MultiEventCellProps> = ({ events, field, classes }) => {
    const sortedEvents = [...events].sort((a,b) => a.className.localeCompare(b.className));
    
    if (sortedEvents.length === 1) {
        const event = sortedEvents[0];
        if (field === 'subject') {
            return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stringToColor(event.subject)}`}>{event.subject}</span>;
        }
        if (field === 'className') {
             const classe = classes.find(c => c.name === event.className.split(' GR')[0]);
             return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(classe?.niveau || '')}`}>{event.className}</span>
        }
        return <>{event[field]}</>;
    }

    return (
        <div className="divide-y divide-gray-200 -my-1.5">
            {sortedEvents.map((event, index) => (
                <div key={event.id} className="py-1.5">
                    {
                        field === 'className' ? <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(classes.find(c=>c.name === event.className.split(' GR')[0])?.niveau || '')}`}>{event.className}</span> :
                        field === 'subject' ? <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stringToColor(event.subject)}`}>{event.subject}</span> :
                        event[field]
                    }
                </div>
            ))}
        </div>
    );
};


// --- MAIN COMPONENT ---

interface CurrentStatusPageProps {
  classes: Classe[];
  workingHours: DayWorkingHours[];
  teachers: Teacher[];
  halls: string[];
}

type ViewMode = 'class' | 'teacher' | 'hall';

const CurrentStatusPage: React.FC<CurrentStatusPageProps> = ({ classes, workingHours, teachers, halls }) => {
  const { t } = useTranslation();
  const [realTime, setRealTime] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(realTime);
  const [viewMode, setViewMode] = useState<ViewMode>('class');

  useEffect(() => {
    const timer = setInterval(() => setRealTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getKeyTimesForDay = useCallback((date: Date): number[] => {
    const dayIndex = date.getDay() === 0 ? 7 : date.getDay();
    const daySchedule = workingHours.find(d => d.dayIndex === dayIndex);

    if (!daySchedule || !daySchedule.isWorkingDay) {
      return [];
    }

    const times = new Set<number>();
    const eventsForDay = mockEvents.filter(e => e.day === dayIndex);
    eventsForDay.forEach(e => {
      times.add(timeToMinutes(e.startTime));
      times.add(timeToMinutes(e.endTime));
    });
    
    if (daySchedule.morningStart) times.add(timeToMinutes(daySchedule.morningStart));
    if (daySchedule.morningEnd) times.add(timeToMinutes(daySchedule.morningEnd));
    if (daySchedule.afternoonStart) times.add(timeToMinutes(daySchedule.afternoonStart));
    if (daySchedule.afternoonEnd) times.add(timeToMinutes(daySchedule.afternoonEnd));

    const morningStartMin = daySchedule.morningStart ? timeToMinutes(daySchedule.morningStart) : -1;
    const morningEndMin = daySchedule.morningEnd ? timeToMinutes(daySchedule.morningEnd) : -1;
    const afternoonStartMin = daySchedule.afternoonStart ? timeToMinutes(daySchedule.afternoonStart) : -1;
    const afternoonEndMin = daySchedule.afternoonEnd ? timeToMinutes(daySchedule.afternoonEnd) : -1;

    return Array.from(times).filter(t =>
        (morningStartMin !== -1 && t >= morningStartMin && t <= morningEndMin) ||
        (afternoonStartMin !== -1 && t >= afternoonStartMin && t <= afternoonEndMin)
    ).sort((a, b) => a - b);
  }, [workingHours]);


  const handleTimeNavigation = (direction: 'prev' | 'next' | 'now' | 'sync') => {
    if (direction === 'now') {
      setSelectedTime(new Date());
      return;
    }
    if (direction === 'sync') {
        setSelectedTime(realTime);
        return;
    }

    const selectedMinutes = selectedTime.getHours() * 60 + selectedTime.getMinutes();
    const keyTimes = getKeyTimesForDay(selectedTime);

    if (direction === 'next') {
      const nextTimeInMinutes = keyTimes.find(t => t > selectedMinutes);
      if (nextTimeInMinutes !== undefined) {
        const newTime = new Date(selectedTime);
        newTime.setHours(Math.floor(nextTimeInMinutes / 60), nextTimeInMinutes % 60, 0, 0);
        setSelectedTime(newTime);
      } else {
        // Go to the start of the next working day
        let nextDay = new Date(selectedTime);
        for (let i = 0; i < 7; i++) {
          nextDay.setDate(nextDay.getDate() + 1);
          const nextDayKeyTimes = getKeyTimesForDay(nextDay);
          if (nextDayKeyTimes.length > 0) {
            const firstTime = nextDayKeyTimes[0];
            nextDay.setHours(Math.floor(firstTime / 60), firstTime % 60, 0, 0);
            setSelectedTime(nextDay);
            break;
          }
        }
      }
    } else { // direction === 'prev'
      const prevTimeInMinutes = keyTimes.slice().reverse().find(t => t < selectedMinutes);
      if (prevTimeInMinutes !== undefined) {
        const newTime = new Date(selectedTime);
        newTime.setHours(Math.floor(prevTimeInMinutes / 60), prevTimeInMinutes % 60, 0, 0);
        setSelectedTime(newTime);
      } else {
        // Go to the end of the previous working day
        let prevDay = new Date(selectedTime);
        for (let i = 0; i < 7; i++) {
          prevDay.setDate(prevDay.getDate() - 1);
          const prevDayKeyTimes = getKeyTimesForDay(prevDay);
          if (prevDayKeyTimes.length > 0) {
            const lastTime = prevDayKeyTimes[prevDayKeyTimes.length - 1];
            prevDay.setHours(Math.floor(lastTime / 60), lastTime % 60, 0, 0);
            setSelectedTime(prevDay);
            break;
          }
        }
      }
    }
  };
  
  const { canGoNext, canGoPrev } = useMemo(() => {
    const selectedMinutes = selectedTime.getHours() * 60 + selectedTime.getMinutes();
    const currentKeyTimes = getKeyTimesForDay(selectedTime);

    // Check for next
    let hasNext = currentKeyTimes.some(t => t > selectedMinutes);
    if (!hasNext) {
        let nextDay = new Date(selectedTime);
        // We only need to check the next 7 days to see if there is any working day left
        for (let i = 0; i < 7; i++) {
            nextDay.setDate(nextDay.getDate() + 1);
            if (getKeyTimesForDay(nextDay).length > 0) {
                hasNext = true;
                break;
            }
        }
    }

    // Check for previous
    let hasPrev = currentKeyTimes.some(t => t < selectedMinutes);
    if (!hasPrev) {
        let prevDay = new Date(selectedTime);
        for (let i = 0; i < 7; i++) {
            prevDay.setDate(prevDay.getDate() - 1);
            if (getKeyTimesForDay(prevDay).length > 0) {
                hasPrev = true;
                break;
            }
        }
    }
    
    return { canGoNext: hasNext, canGoPrev: hasPrev };
  }, [selectedTime, getKeyTimesForDay]);

  const currentTimeSlotString = useMemo(() => {
    const dayIndex = selectedTime.getDay() === 0 ? 7 : selectedTime.getDay();
    const daySchedule = workingHours.find(d => d.dayIndex === dayIndex);

    if (!daySchedule || !daySchedule.isWorkingDay) {
        return t('currentStatusPage.notAWorkingDay');
    }
    
    const selectedMinutes = selectedTime.getHours() * 60 + selectedTime.getMinutes();
    const keyTimes = getKeyTimesForDay(selectedTime);

    if (keyTimes.length === 0) {
        return "Journée terminée";
    }

    const startTime = keyTimes.slice().reverse().find(t => t <= selectedMinutes);
    if (startTime === undefined) {
        return `Avant ${minutesToTimeStr(keyTimes[0])}`;
    }
    
    const endTime = keyTimes.find(t => t > startTime);
    if (endTime === undefined) {
        return `Après ${minutesToTimeStr(startTime)}`;
    }

    return `${minutesToTimeStr(startTime)} -- ${minutesToTimeStr(endTime)}`;

  }, [selectedTime, workingHours, getKeyTimesForDay, t]);


  const currentDaySchedule = useMemo(() => {
    const dayIndex = selectedTime.getDay();
    const appDayIndex = dayIndex === 0 ? 7 : dayIndex;
    return workingHours.find(d => d.dayIndex === appDayIndex);
  }, [selectedTime, workingHours]);
  
  const activeEvents = useMemo(() => {
    if (!currentDaySchedule || !currentDaySchedule.isWorkingDay) {
        return [];
    }
    const dayIndex = currentDaySchedule.dayIndex;
    const selectedMinutes = selectedTime.getHours() * 60 + selectedTime.getMinutes();
    return mockEvents.filter(event => 
      event.day === dayIndex &&
      timeToMinutes(event.startTime) <= selectedMinutes &&
      timeToMinutes(event.endTime) > selectedMinutes
    );
  }, [selectedTime, currentDaySchedule]);

  const statusByClass = useMemo(() => {
    const statusMap = new Map<string, TimetableEvent[]>();
    for (const event of activeEvents) {
      const baseClassName = event.className.split(' GR')[0];
      if (!statusMap.has(baseClassName)) statusMap.set(baseClassName, []);
      statusMap.get(baseClassName)!.push(event);
    }
    return statusMap;
  }, [activeEvents]);

  const statusByTeacher = useMemo(() => {
    const statusMap = new Map<string, TimetableEvent[]>();
    for (const event of activeEvents) {
      if (!statusMap.has(event.teacher)) statusMap.set(event.teacher, []);
      statusMap.get(event.teacher)!.push(event);
    }
    return statusMap;
  }, [activeEvents]);

  const statusByHall = useMemo(() => {
    const statusMap = new Map<string, TimetableEvent[]>();
    for (const event of activeEvents) {
      if (!statusMap.has(event.hall)) statusMap.set(event.hall, []);
      statusMap.get(event.hall)!.push(event);
    }
    return statusMap;
  }, [activeEvents]);


  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })), [classes]);
  const sortedTeachers = useMemo(() => [...teachers].sort((a,b) => a.lastName.localeCompare(b.lastName)), [teachers]);
  const sortedHalls = useMemo(() => [...halls].sort((a,b) => a.localeCompare(b, undefined, { numeric: true })), [halls]);

  const tableHeaders: Record<ViewMode, { label: string, icon: React.ReactNode }[]> = {
    class: [
      { label: t('currentStatusPage.class'), icon: <UserGroupIcon className="h-4 w-4" /> },
      { label: t('currentStatusPage.subject'), icon: <BookOpenIcon className="h-4 w-4" /> },
      { label: t('currentStatusPage.teacher'), icon: <UserIcon className="h-4 w-4" /> },
      { label: t('currentStatusPage.hall'), icon: <BuildingLibraryIcon className="h-4 w-4" /> },
    ],
    teacher: [
      { label: t('currentStatusPage.teacher'), icon: <UserIcon className="h-4 w-4" /> },
      { label: t('currentStatusPage.class'), icon: <UserGroupIcon className="h-4 w-4" /> },
      { label: t('currentStatusPage.subject'), icon: <BookOpenIcon className="h-4 w-4" /> },
      { label: t('currentStatusPage.hall'), icon: <BuildingLibraryIcon className="h-4 w-4" /> },
    ],
    hall: [
      { label: t('currentStatusPage.hall'), icon: <BuildingLibraryIcon className="h-4 w-4" /> },
      { label: t('currentStatusPage.class'), icon: <UserGroupIcon className="h-4 w-4" /> },
      { label: t('currentStatusPage.subject'), icon: <BookOpenIcon className="h-4 w-4" /> },
      { label: t('currentStatusPage.teacher'), icon: <UserIcon className="h-4 w-4" /> },
    ],
  };
  
  const renderTableBody = () => {
    if (!currentDaySchedule || !currentDaySchedule.isWorkingDay) {
        return (
            <tbody>
                <tr><td colSpan={4} className="text-center py-10 text-gray-500 font-semibold">{t('currentStatusPage.notAWorkingDay')}</td></tr>
            </tbody>
        );
    }

    switch(viewMode) {
        case 'teacher':
            const activeTeachers = sortedTeachers.filter(teacher => {
                const teacherName = `${teacher.firstName} ${teacher.lastName}`;
                return statusByTeacher.has(teacherName);
            });

            if (activeTeachers.length === 0) {
                return <tbody><tr><td colSpan={4} className="text-center py-10 text-gray-500">{t('currentStatusPage.noTeachersBusy')}</td></tr></tbody>;
            }

            return (
                <tbody className="text-gray-700">
                    {activeTeachers.map((teacher, index) => {
                        const teacherName = `${teacher.firstName} ${teacher.lastName}`;
                        const currentEvents = statusByTeacher.get(teacherName)!;
                        return (
                            <tr key={teacher.id} className={`border-b border-gray-200 ${(index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')} hover:bg-gray-100`}>
                                <td className="py-3 px-4 font-medium align-middle">{teacherName}</td>
                                <td className="py-3 px-4 align-middle"><MultiEventCell events={currentEvents} field="className" classes={classes} /></td>
                                <td className="py-3 px-4 align-middle"><MultiEventCell events={currentEvents} field="subject" classes={classes} /></td>
                                <td className="py-3 px-4 align-middle"><MultiEventCell events={currentEvents} field="hall" classes={classes} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            );
        case 'hall':
             const occupiedHalls = sortedHalls.filter(hall => statusByHall.has(hall));

            if (occupiedHalls.length === 0) {
                return <tbody><tr><td colSpan={4} className="text-center py-10 text-gray-500">{t('currentStatusPage.noHallsOccupied')}</td></tr></tbody>;
            }

            return (
                <tbody className="text-gray-700">
                    {occupiedHalls.map((hall, index) => {
                        const currentEvents = statusByHall.get(hall)!;
                        return (
                            <tr key={hall} className={`border-b border-gray-200 ${(index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')} hover:bg-gray-100`}>
                                <td className="py-3 px-4 font-medium align-middle">{hall}</td>
                                <td className="py-3 px-4 align-middle"><MultiEventCell events={currentEvents} field="className" classes={classes} /></td>
                                <td className="py-3 px-4 align-middle"><MultiEventCell events={currentEvents} field="subject" classes={classes} /></td>
                                <td className="py-3 px-4 align-middle"><MultiEventCell events={currentEvents} field="teacher" classes={classes} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            );
        case 'class':
        default:
             return (
                <tbody className="text-gray-700">
                    {sortedClasses.map((classe, index) => {
                      const currentEvents = statusByClass.get(classe.name);
                      const isBreak = !currentEvents || currentEvents.length === 0;
                      return (
                        <tr key={classe.id} className={`border-b border-gray-200 transition-colors ${isBreak ? 'bg-green-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')} hover:bg-gray-100`}>
                          <td className="py-3 px-4 font-medium align-middle">
                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(classe.niveau)}`}>
                                {classe.name}
                            </span>
                          </td>
                          {currentEvents && currentEvents.length > 0 ? (
                            <>
                              <td className="py-3 px-4 align-middle"><MultiEventCell events={currentEvents} field="subject" classes={classes} /></td>
                              <td className="py-3 px-4 align-middle"><MultiEventCell events={currentEvents} field="teacher" classes={classes} /></td>
                              <td className="py-3 px-4 align-middle"><MultiEventCell events={currentEvents} field="hall" classes={classes} /></td>
                            </>
                          ) : (
                            <td colSpan={3} className="py-3 px-4 text-center text-green-800 italic align-middle">
                                <div className="flex items-center justify-center"><CoffeeIcon className="h-5 w-5 mr-2"/><span>{t('currentStatusPage.noClass')}</span></div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
            );
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('currentStatusPage.title')}</h1>
          <p className="mt-1 text-gray-600">{t('currentStatusPage.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <span className="text-sm font-semibold text-gray-600 ml-2">{t('currentStatusPage.groupBy')}:</span>
            {(['class', 'teacher', 'hall'] as ViewMode[]).map(mode => (
                 <button key={mode} onClick={() => setViewMode(mode)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                        viewMode === mode ? 'bg-white text-indigo-700 shadow' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                 >{t(`currentStatusPage.${mode}`)}</button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Navigation Temporelle</h2>
            <p className="text-center text-gray-600 mb-2">Affichage de l'état pour : <span className="font-bold text-indigo-700">{currentTimeSlotString}</span></p>
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                <button onClick={() => handleTimeNavigation('prev')} disabled={!canGoPrev} className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label={t('currentStatusPage.previousHour')}><ChevronLeftIcon /></button>
                <button onClick={() => handleTimeNavigation('now')} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">{t('currentStatusPage.now')}</button>
                <button 
                    onClick={() => handleTimeNavigation('sync')} 
                    className="p-3 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition-colors"
                    aria-label="Synchroniser avec l'heure actuelle"
                    title="Synchroniser"
                >
                    <ArrowPathIcon className="h-6 w-6" />
                </button>
                <button onClick={() => handleTimeNavigation('next')} disabled={!canGoNext} className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label={t('currentStatusPage.nextHour')}><ChevronRightIcon /></button>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center flex flex-col justify-center">
            <p className="text-gray-500 text-sm font-medium">{t('currentStatusPage.date')}</p>
            <p className="text-lg font-semibold text-gray-800">{realTime.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-gray-500 text-sm font-medium mt-2">{t('currentStatusPage.time')}</p>
            <div className="text-5xl font-bold text-violet-600 flex items-center justify-center tracking-wider">
                <ClockIcon className="mr-3 h-10 w-10 text-violet-500" />
                {realTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              {tableHeaders[viewMode].map(header => (
                <th key={header.label} className="py-3 px-4 font-semibold text-left">
                  <div className="flex items-center gap-2">
                    {header.icon}
                    <span>{header.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {renderTableBody()}
        </table>
      </div>
    </div>
  );
};

export default CurrentStatusPage;