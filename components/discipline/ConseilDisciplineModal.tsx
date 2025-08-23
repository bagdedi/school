import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import type { Student, DisciplineIncident, IncidentType, DisciplineCouncilMeeting, ConseilDisciplineMembers, Teacher } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import { toast } from 'react-hot-toast';
import { SaveIcon } from '../icons/SaveIcon';

interface ConseilDisciplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: DisciplineCouncilMeeting;
  student: Student;
  teachers: Teacher[];
  incidents: DisciplineIncident[];
  setIncidents: React.Dispatch<React.SetStateAction<DisciplineIncident[]>>;
  setCouncilMeetings: React.Dispatch<React.SetStateAction<DisciplineCouncilMeeting[]>>;
  conseilDisciplineMembers: ConseilDisciplineMembers;
}

const decisionOptions: (IncidentType | 'Aucune sanction')[] = ['Aucune sanction', 'Blâme', 'Exclusion Temporaire', 'Exclusion Définitive'];

export const ConseilDisciplineModal: React.FC<ConseilDisciplineModalProps> = (props) => {
    const { t } = useTranslation();
    const { isOpen, onClose, meeting, student, teachers, incidents, setIncidents, setCouncilMeetings, conseilDisciplineMembers } = props;

    const [meetingDate, setMeetingDate] = useState(meeting.meetingDate);
    const [discussionSummary, setDiscussionSummary] = useState(meeting.discussionSummary || '');
    const [decision, setDecision] = useState<IncidentType | 'Aucune sanction' | ''>(meeting.decision || '');
    const [exclusionDuration, setExclusionDuration] = useState('');

    const allCouncilMembers = useMemo(() => {
        const members: string[] = [
            `Dr. Helmi Ahmed EL KAMEL (Président)`,
            `${conseilDisciplineMembers.censeur} (Censeur)`,
            `${conseilDisciplineMembers.conseillerPrincipal} (Conseiller Principal)`,
            `${conseilDisciplineMembers.conseillerInternat} (Conseiller Internat)`,
            ...conseilDisciplineMembers.enseignantsElus.map(id => {
                const teacher = teachers.find(t => t.id === id);
                return teacher ? `${teacher.firstName} ${teacher.lastName} (Enseignant Élu)` : `Enseignant Inconnu (ID: ${id})`;
            }),
            `${conseilDisciplineMembers.representantParents} (Représentant des Parents)`,
        ];
        return members;
    }, [conseilDisciplineMembers, teachers]);
    
    const [membersPresent, setMembersPresent] = useState<string[]>(meeting.membersPresent || allCouncilMembers);

    const handleMemberToggle = (memberName: string) => {
        setMembersPresent(prev => 
            prev.includes(memberName) ? prev.filter(m => m !== memberName) : [...prev, memberName]
        );
    };

    const studentIncidents = incidents.filter(inc => inc.studentId === student.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleSave = () => {
        if (!decision) {
            toast.error("Veuillez sélectionner une décision finale.");
            return;
        }

        const updatedMeeting: DisciplineCouncilMeeting = {
            ...meeting,
            meetingDate,
            discussionSummary,
            decision,
            membersPresent,
            status: 'Completed',
        };
        
        // Create a new incident if a sanction was decided
        if (decision !== 'Aucune sanction') {
            const newIncident: DisciplineIncident = {
                id: `D${Date.now()}`,
                studentId: student.id,
                date: meetingDate,
                type: decision,
                reason: `Décision du conseil de discipline du ${meetingDate}.`,
                reporter: 'Conseil de Discipline',
                details: decision === 'Exclusion Temporaire' ? { duration: Number(exclusionDuration) } : undefined
            };
            setIncidents(prev => [...prev, newIncident]);
            updatedMeeting.decisionIncidentId = newIncident.id;
            toast.success(t('councilMeetingsPage.decisionRecorded'));
        }

        setCouncilMeetings(prev => prev.map(m => m.id === meeting.id ? updatedMeeting : m));
        toast.success(t('councilMeetingsPage.meetingSaved'));
        onClose();
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('councilMeetingsPage.modalTitle')} size="4xl">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Student Info & History */}
                <div className="md:col-span-1 space-y-4">
                     <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('councilMeetingsPage.studentInfo')}</h3>
                        <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border">
                            <img src={student.avatar} alt="" className="w-16 h-16 rounded-full" />
                            <div>
                                <p className="font-bold text-gray-900">{student.firstName} {student.lastName}</p>
                                <p className="text-sm text-gray-600">{student.classe}</p>
                            </div>
                        </div>
                     </div>
                     <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('councilMeetingsPage.incidentHistory')}</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2 border p-2 rounded-lg bg-gray-50">
                            {studentIncidents.map(inc => (
                                <div key={inc.id} className="p-2 border rounded-md bg-white text-xs">
                                    <p className="font-semibold">{inc.type} <span className="font-normal text-gray-500">- {inc.date}</span></p>
                                    <p className="text-gray-700">{inc.reason}</p>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

                {/* Right Column: Meeting Details */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">{t('councilMeetingsPage.meetingDetails')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">{t('councilMeetingsPage.meetingDate')}</label>
                            <input type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700">{t('councilMeetingsPage.status')}</label>
                             <input type="text" value={t(`councilMeetingsPage.${meeting.status.toLowerCase()}`)} disabled className="mt-1 w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
                         </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('councilMeetingsPage.membersPresent')}</label>
                        <div className="mt-1 grid grid-cols-2 gap-2 border p-3 rounded-md max-h-48 overflow-y-auto bg-white">
                            {allCouncilMembers.map(member => (
                                <label key={member} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={membersPresent.includes(member)} onChange={() => handleMemberToggle(member)} className="h-4 w-4 rounded border-gray-300 text-indigo-600"/>
                                    <span className="text-sm text-gray-800">{member}</span>
                                </label>
                            ))}
                        </div>
                     </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('councilMeetingsPage.discussionSummary')}</label>
                        <textarea value={discussionSummary} onChange={e => setDiscussionSummary(e.target.value)} rows={5} className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" placeholder={t('councilMeetingsPage.summaryPlaceholder')}></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 font-bold">{t('councilMeetingsPage.finalDecision')}</label>
                        <div className="flex items-center gap-4 mt-1">
                            <select value={decision} onChange={e => setDecision(e.target.value as any)} required className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                                <option value="">{t('councilMeetingsPage.selectDecision')}</option>
                                {decisionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            {decision === 'Exclusion Temporaire' && (
                                <input type="number" value={exclusionDuration} onChange={e => setExclusionDuration(e.target.value)} placeholder="Durée (jours)" className="w-36 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                    {t('common.cancel')}
                </button>
                <button type="button" onClick={handleSave} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                    <SaveIcon className="mr-2 h-4 w-4" />
                    {t('councilMeetingsPage.saveMeeting')}
                </button>
            </div>
        </Modal>
    );
};