import React, { useState, useMemo } from 'react';
import type { Student, DisciplineIncident, DisciplineCouncilMeeting, ConseilDisciplineMembers, CouncilMeetingStatus, Teacher } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import { GavelIcon } from '../icons/GavelIcon';
import { ConseilDisciplineModal } from './ConseilDisciplineModal';

interface ConseilDisciplinePageProps {
  students: Student[];
  teachers: Teacher[];
  disciplineIncidents: DisciplineIncident[];
  setDisciplineIncidents: React.Dispatch<React.SetStateAction<DisciplineIncident[]>>;
  councilMeetings: DisciplineCouncilMeeting[];
  setCouncilMeetings: React.Dispatch<React.SetStateAction<DisciplineCouncilMeeting[]>>;
  conseilDisciplineMembers: ConseilDisciplineMembers;
}

const ConseilDisciplinePage: React.FC<ConseilDisciplinePageProps> = (props) => {
    const { t } = useTranslation();
    const [statusFilter, setStatusFilter] = useState<CouncilMeetingStatus | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const meetingsWithDetails = useMemo(() => {
        return props.councilMeetings.map(meeting => {
            const student = props.students.find(s => s.id === meeting.studentId);
            const referralIncident = props.disciplineIncidents.find(i => i.id === meeting.referralIncidentId);
            return {
                ...meeting,
                student,
                referralIncident
            };
        }).sort((a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime());
    }, [props.councilMeetings, props.students, props.disciplineIncidents]);

    type MeetingWithDetails = typeof meetingsWithDetails[0];

    const [selectedMeeting, setSelectedMeeting] = useState<MeetingWithDetails | null>(null);

    const filteredMeetings = useMemo(() => {
        if (statusFilter === 'all') return meetingsWithDetails;
        return meetingsWithDetails.filter(m => m.status === statusFilter);
    }, [statusFilter, meetingsWithDetails]);

    const handleManageClick = (meeting: MeetingWithDetails) => {
        setSelectedMeeting(meeting);
        setIsModalOpen(true);
    };
    
    const getStatusStyles = (status: CouncilMeetingStatus) => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-gray-100 text-gray-800';
        }
    };
    
    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('councilMeetingsPage.title')}</h1>
                    <p className="mt-1 text-gray-600">{t('councilMeetingsPage.subtitle')}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="flex space-x-2">
                        {(['all', 'Scheduled', 'Completed', 'Cancelled'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    statusFilter === status
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {t(`councilMeetingsPage.${status.toLowerCase()}`) || 'All'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4 font-semibold">{t('councilMeetingsPage.student')}</th>
                                <th className="py-3 px-4 font-semibold">{t('councilMeetingsPage.referralReason')}</th>
                                <th className="py-3 px-4 font-semibold text-center">{t('councilMeetingsPage.meetingDate')}</th>
                                <th className="py-3 px-4 font-semibold text-center">{t('councilMeetingsPage.status')}</th>
                                <th className="py-3 px-4 font-semibold text-center">{t('councilMeetingsPage.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {filteredMeetings.map(meeting => (
                                <tr key={meeting.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        {meeting.student ? (
                                             <div className="flex items-center">
                                                <img src={meeting.student.avatar} alt="" className="w-9 h-9 rounded-full mr-3" />
                                                <span>{`${meeting.student.firstName} ${meeting.student.lastName}`}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 italic">Student not found</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-sm max-w-xs truncate" title={meeting.referralIncident?.reason}>{meeting.referralIncident?.reason || 'N/A'}</td>
                                    <td className="py-3 px-4 text-center">{meeting.meetingDate}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(meeting.status)}`}>
                                            {t(`councilMeetingsPage.${meeting.status.toLowerCase()}`)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button onClick={() => handleManageClick(meeting)} className="bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                                            {t('councilMeetingsPage.manage')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredMeetings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        <GavelIcon className="h-12 w-12 mx-auto text-gray-300 mb-2"/>
                                        {t('councilMeetingsPage.noMeetings')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedMeeting && selectedMeeting.student && (
                <ConseilDisciplineModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    meeting={selectedMeeting}
                    student={selectedMeeting.student}
                    teachers={props.teachers}
                    incidents={props.disciplineIncidents}
                    setIncidents={props.setDisciplineIncidents}
                    setCouncilMeetings={props.setCouncilMeetings}
                    conseilDisciplineMembers={props.conseilDisciplineMembers}
                />
            )}
        </>
    );
};

export default ConseilDisciplinePage;