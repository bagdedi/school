import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Student, DisciplineIncident, IncidentType, DisciplineCouncilMeeting } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import { PlusIcon } from '../icons/PlusIcon';
import { InfoIcon } from '../icons/InfoIcon';
import { toast } from 'react-hot-toast';

interface DisciplineManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  incidents: DisciplineIncident[];
  setIncidents: React.Dispatch<React.SetStateAction<DisciplineIncident[]>>;
  setCouncilMeetings: React.Dispatch<React.SetStateAction<DisciplineCouncilMeeting[]>>;
}

const incidentTypes: IncidentType[] = ['Avertissement', 'Blâme', 'Retenue', 'Exclusion Temporaire', 'Conseil de Discipline', 'Exclusion Définitive'];

export const DisciplineManagementModal: React.FC<DisciplineManagementModalProps> = ({ isOpen, onClose, student, incidents, setIncidents, setCouncilMeetings }) => {
    const { t } = useTranslation();
    const [reason, setReason] = useState('');
    const [type, setType] = useState<IncidentType | ''>('');
    const [reporter, setReporter] = useState('');
    const [duration, setDuration] = useState('');

    const studentIncidents = incidents.filter(inc => inc.studentId === student.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const warningCount = studentIncidents.filter(inc => inc.type === 'Avertissement').length;
    const suspensionCount = studentIncidents.filter(inc => inc.type === 'Exclusion Temporaire').length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!type || !reason || !reporter) {
            toast.error("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        const newIncidents: DisciplineIncident[] = [];
        const incidentId = `D${Date.now()}`;
        
        const newIncident: DisciplineIncident = {
            id: incidentId,
            studentId: student.id,
            date: new Date().toISOString().split('T')[0],
            type,
            reason,
            reporter,
            details: (type === 'Exclusion Temporaire' || type === 'Retenue') && duration ? { duration: Number(duration) } : undefined,
        };
        newIncidents.push(newIncident);
        toast.success("Incident enregistré avec succès.");

        // Automatic suspension logic
        if (type === 'Avertissement') {
            const newWarningCount = warningCount + 1;
            let suspensionDuration: number | null = null;
            if (newWarningCount === 3) {
                suspensionDuration = 1;
            } else if (newWarningCount === 5) {
                suspensionDuration = 3;
            }

            if (suspensionDuration) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const suspensionDate = tomorrow.toISOString().split('T')[0];

                const suspensionIncident: DisciplineIncident = {
                    id: `D${Date.now() + 1}`,
                    studentId: student.id,
                    date: suspensionDate,
                    type: 'Exclusion Temporaire',
                    reason: t('disciplinePage.automaticSuspensionReason', { count: newWarningCount }),
                    reporter: t('disciplinePage.system'),
                    details: { duration: suspensionDuration }
                };
                newIncidents.push(suspensionIncident);
                toast(t('disciplinePage.suspensionCreatedToast', { duration: suspensionDuration }));
            }
        }
        
        setIncidents(prev => [...prev, ...newIncidents]);
        
        // If it's a council referral, create a scheduled meeting
        if (type === 'Conseil de Discipline') {
            const newMeeting: DisciplineCouncilMeeting = {
                id: `M${Date.now()}`,
                studentId: student.id,
                referralIncidentId: incidentId,
                meetingDate: new Date().toISOString().split('T')[0], // Default to today, can be changed later
                status: 'Scheduled',
            };
            setCouncilMeetings(prev => [...prev, newMeeting]);
            toast.success("L'étudiant a été déféré au conseil de discipline.");
        }

        // Reset form
        setType('');
        setReason('');
        setReporter('');
        setDuration('');
    };
    
    const getTypeStyles = (type: IncidentType) => {
        switch (type) {
            case 'Avertissement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Blâme': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Exclusion Temporaire':
            case 'Exclusion Définitive':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Conseil de Discipline': return 'bg-black text-white';
            case 'Retenue': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('disciplinePage.modalTitle')} ${student.firstName} ${student.lastName}`} size="4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
                {/* Incident History */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('disciplinePage.incidentHistory')}</h3>
                    {warningCount >= 2 && warningCount < 5 && (
                        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-r-md">
                            <p className="font-semibold flex items-center"><InfoIcon className="h-5 w-5 mr-2" /> {t('studentsPage.deleteWarningTitle')}</p>
                            <p className="text-sm mt-1">{t('disciplinePage.ruleWarning3', { count: warningCount })}</p>
                        </div>
                    )}
                     {warningCount >= 5 && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-r-md">
                            <p className="font-semibold flex items-center"><InfoIcon className="h-5 w-5 mr-2" /> {t('studentsPage.deleteWarningTitle')}</p>
                            <p className="text-sm mt-1">{t('disciplinePage.ruleWarning5', { count: warningCount })}</p>
                        </div>
                    )}

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {studentIncidents.length > 0 ? studentIncidents.map(inc => (
                            <div key={inc.id} className="p-3 border rounded-lg bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getTypeStyles(inc.type)}`}>{inc.type}</span>
                                        <p className="text-sm text-gray-600 mt-1">{inc.reason}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 text-right flex-shrink-0 ml-4">
                                        {inc.date}<br/>
                                        <span className="italic">par {inc.reporter}</span>
                                    </p>
                                </div>
                                {inc.details?.duration && (
                                    <p className="text-xs text-indigo-700 mt-1 font-semibold">Durée: {inc.details.duration} {inc.type === 'Exclusion Temporaire' ? 'jours' : 'heures'}</p>
                                )}
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-6">{t('disciplinePage.noIncidents')}</p>
                        )}
                    </div>
                </div>

                {/* Add New Incident Form */}
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('disciplinePage.addNewIncident')}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">{t('disciplinePage.incidentType')}</label>
                            <select id="type" value={type} onChange={e => setType(e.target.value as IncidentType | '')} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">{t('disciplinePage.selectType')}</option>
                                {incidentTypes.map(it => <option key={it} value={it}>{it}</option>)}
                            </select>
                        </div>
                        {(type === 'Exclusion Temporaire' || type === 'Retenue') && (
                            <div className="animate-fade-in">
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">{t('disciplinePage.durationDays')}</label>
                                <input type="number" id="duration" value={duration} onChange={e => setDuration(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">{t('disciplinePage.reason')}</label>
                            <textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('disciplinePage.reasonPlaceholder')}></textarea>
                        </div>
                        <div>
                            <label htmlFor="reporter" className="block text-sm font-medium text-gray-700">{t('disciplinePage.reporter')}</label>
                            <input type="text" id="reporter" value={reporter} onChange={e => setReporter(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('disciplinePage.reporterPlaceholder')} />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                                <PlusIcon />
                                <span className="ml-2">{t('disciplinePage.addIncident')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};