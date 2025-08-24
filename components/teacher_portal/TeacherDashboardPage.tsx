import React, { useMemo } from 'react';
import type { Teacher } from '../../types';
import { mockEvents } from '../timetable/mockData';
import { ClockIcon } from '../icons/ClockIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { useTranslation } from '../../contexts/LanguageContext';

interface TeacherDashboardPageProps {
  teacher: Teacher;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({ teacher }) => {
    const { t } = useTranslation();
    const teacherName = `${teacher.firstName} ${teacher.lastName}`;

    const todaySchedule = useMemo(() => {
        const today = new Date();
        const dayIndex = today.getDay() === 0 ? 7 : today.getDay(); // Sunday is 0 -> 7
        return mockEvents
            .filter(event => event.teacher === teacherName && event.day === dayIndex)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [teacherName]);

    const teacherStats = useMemo(() => {
        const classes = new Set<string>();
        mockEvents.forEach(event => {
            if (event.teacher === teacherName) {
                classes.add(event.className.split(' GR')[0]);
            }
        });
        return {
            classCount: classes.size,
        };
    }, [teacherName]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Bienvenue, {teacher.firstName} !</h1>
        <p className="mt-1 text-gray-600">Voici un aperçu de votre journée et de vos activités.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard icon={<AcademicCapIcon />} title="Matière Principale" value={teacher.specialty} color="border-indigo-500" />
        <StatCard icon={<UserGroupIcon />} title="Classes Enseignées" value={teacherStats.classCount.toString()} color="border-green-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <ClockIcon className="mr-3 h-6 w-6 text-gray-500" />
            Emploi du temps d'aujourd'hui
        </h2>
        {todaySchedule.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="p-3">Heure</th>
                            <th className="p-3">Classe</th>
                            <th className="p-3">Matière</th>
                            <th className="p-3">Salle</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {todaySchedule.map(event => (
                            <tr key={event.id} className="border-b border-gray-200">
                                <td className="p-3 font-mono">{`${event.startTime} - ${event.endTime}`}</td>
                                <td className="p-3 font-semibold">{event.className}</td>
                                <td className="p-3">{event.subject}</td>
                                <td className="p-3">{event.hall}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center py-10 text-gray-500">
                <p>Aucun cours programmé pour aujourd'hui.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardPage;