import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { DayWorkingHours, Classe, Student, Teacher, Payment, StudentGrades, SubjectCoefficient, AttendanceData, DisciplineIncident, ConseilDisciplineMembers, DisciplineCouncilMeeting } from '../../types';
import { InfoIcon } from '../icons/InfoIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CameraIcon } from '../icons/CameraIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { LibraryIcon } from '../icons/LibraryIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { specializationsByLevel } from '../scholarship/programData';
import { Modal } from '../common/Modal';
import { ArrowDownTrayIcon } from '../icons/ArrowDownTrayIcon';
import { ArrowUpTrayIcon } from '../icons/ArrowUpTrayIcon';
import { toast } from 'react-hot-toast';
import { ScaleIcon } from '../icons/ScaleIcon';
import { mockConseilDisciplineMembers } from '../timetable/mockData';
import { BuildingOfficeIcon } from '../icons/BuildingOfficeIcon';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';

interface EtablissementPageProps {
  schoolName: string;
  setSchoolName: (name: string) => void;
  directorName: string;
  setDirectorName: (name: string) => void;
  schoolLogoUrl: string | null;
  setSchoolLogoUrl: (url: string | null) => void;
  schoolYear: string;
  setSchoolYear: (year: string) => void;
  workingHours: DayWorkingHours[];
  setWorkingHours: (hours: DayWorkingHours[]) => void;
  optionalSubjects: string[];
  setOptionalSubjects: (subjects: string[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  halls: string[];
  setHalls: (halls: string[]) => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  grades: StudentGrades[];
  setGrades: React.Dispatch<React.SetStateAction<StudentGrades[]>>;
  attendanceData: AttendanceData;
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceData>>;
  subjectCoefficients: SubjectCoefficient[];
  setSubjectCoefficients: React.Dispatch<React.SetStateAction<SubjectCoefficient[]>>;
  disciplineIncidents: DisciplineIncident[];
  setDisciplineIncidents: React.Dispatch<React.SetStateAction<DisciplineIncident[]>>;
  conseilDisciplineMembers: ConseilDisciplineMembers;
  setConseilDisciplineMembers: React.Dispatch<React.SetStateAction<ConseilDisciplineMembers>>;
  disciplineCouncilMeetings: DisciplineCouncilMeeting[];
  setDisciplineCouncilMeetings: React.Dispatch<React.SetStateAction<DisciplineCouncilMeeting[]>>;
}

const niveauOptions = ['1 annee', '2 annee', '3 annee', '4 annee'];

const getSpecialiteAbbr = (specialite: string): string => {
  const abbreviations: { [key: string]: string } = {
    'Tronc commun': 'AS',
    'Tronc Commun': 'AS',
    'Sport': 'SPORT',
    'Sciences': 'SC',
    'Économie et Services': 'ECO-SERV',
    'Economie et Gestion': 'ECO-GES',
    'Lettres': 'LETT',
    'Sciences Expérimentales': 'SC.EXP',
    'Mathématiques': 'MATH',
    'Techniques': 'TECH',
    'Sciences Techniques': 'TECH',
    'Technologie': 'TECH',
    'Sciences Informatiques': 'INFO',
    'Sciences de l\'Informatique': 'INFO',
    'Technologie de l\'Informatique': 'INFO-TECH'
  };
  return abbreviations[specialite] || specialite.substring(0, 4).toUpperCase();
};


const EtablissementPage: React.FC<EtablissementPageProps> = (props) => {
    const {
      schoolName, setSchoolName, directorName, setDirectorName, schoolLogoUrl, setSchoolLogoUrl,
      schoolYear, setSchoolYear, workingHours, setWorkingHours, optionalSubjects, setOptionalSubjects, classes, setClasses,
      halls, setHalls, students, setStudents, teachers, setTeachers, payments, setPayments,
      grades, setGrades, attendanceData, setAttendanceData, subjectCoefficients, setSubjectCoefficients,
      disciplineIncidents, setDisciplineIncidents, conseilDisciplineMembers, setConseilDisciplineMembers,
      disciplineCouncilMeetings, setDisciplineCouncilMeetings
    } = props;

    const [newHall, setNewHall] = useState('');
    const [logoPreview, setLogoPreview] = useState<string | null>(schoolLogoUrl);
    const [newClassNiveau, setNewClassNiveau] = useState('');
    const [newClassSpecialite, setNewClassSpecialite] = useState('');
    const [newOptionalSubject, setNewOptionalSubject] = useState('');
    const [classToDelete, setClassToDelete] = useState<Classe | null>(null);
    const [dataToImport, setDataToImport] = useState<any | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

    useEffect(() => {
        setNewClassSpecialite('');
    }, [newClassNiveau]);
    
    useEffect(() => {
        setLogoPreview(schoolLogoUrl);
    }, [schoolLogoUrl]);

    const availableSpecialitesForClassCreation = useMemo(() => {
        return specializationsByLevel[newClassNiveau] || [];
    }, [newClassNiveau]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
                setSchoolLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWorkingHoursChange = (dayIndex: number, field: keyof DayWorkingHours, value: string | boolean) => {
        const updatedHours = workingHours.map(d => 
            d.dayIndex === dayIndex ? { ...d, [field]: value } : d
        );
        setWorkingHours(updatedHours);
    };

    const handleAddHall = () => {
        if (newHall && !halls.includes(newHall)) {
            setHalls([...halls, newHall].sort((a,b) => a.localeCompare(b, undefined, { numeric: true })));
            setNewHall('');
        }
    };
    
    const handleDeleteHall = (hallToDelete: string) => {
        setHalls(halls.filter(h => h !== hallToDelete));
    };

    const handleAddClass = () => {
        if (!newClassNiveau || !newClassSpecialite) {
            toast.error("Veuillez sélectionner un niveau et une spécialité.");
            return;
        }

        const existingClasses = classes.filter(c => c.niveau === newClassNiveau && c.specialite === newClassSpecialite);
        const nextNumber = existingClasses.length + 1;
        
        const niveauPrefix = newClassNiveau.split(' ')[0];
        const specialiteAbbr = getSpecialiteAbbr(newClassSpecialite);

        const newClasse: Classe = {
            id: `c${Date.now()}`,
            niveau: newClassNiveau,
            specialite: newClassSpecialite,
            number: nextNumber,
            name: `${niveauPrefix} ${specialiteAbbr} ${nextNumber}`,
        };

        setClasses([...classes, newClasse]);
        toast.success(`Classe ${newClasse.name} ajoutée.`);
    };
    
    const handleDeleteClass = () => {
        if(classToDelete) {
            setClasses(classes.filter(c => c.id !== classToDelete.id));
            toast.success(`Classe ${classToDelete.name} supprimée.`);
            setClassToDelete(null);
        }
    };
    
    const handleAddOptionalSubject = () => {
        if (newOptionalSubject && !optionalSubjects.includes(newOptionalSubject)) {
            setOptionalSubjects([...optionalSubjects, newOptionalSubject].sort());
            setNewOptionalSubject('');
        }
    };

    const handleDeleteOptionalSubject = (subjectToDelete: string) => {
        setOptionalSubjects(optionalSubjects.filter(s => s !== subjectToDelete));
    };
    
    // --- CONSEIL DE DISCIPLINE ---
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const availableTeachersForCouncil = useMemo(() => {
        return teachers.filter(t => !conseilDisciplineMembers.enseignantsElus.includes(t.id));
    }, [teachers, conseilDisciplineMembers.enseignantsElus]);

    const handleAddElectedTeacher = () => {
        if (selectedTeacherId && conseilDisciplineMembers.enseignantsElus.length < 5) {
            setConseilDisciplineMembers(prev => ({
                ...prev,
                enseignantsElus: [...prev.enseignantsElus, selectedTeacherId]
            }));
            setSelectedTeacherId('');
            setIsTeacherModalOpen(false);
        } else if (conseilDisciplineMembers.enseignantsElus.length >= 5) {
            toast.error("Vous ne pouvez pas ajouter plus de 5 enseignants élus.");
        }
    };

    const handleRemoveElectedTeacher = (teacherId: string) => {
        setConseilDisciplineMembers(prev => ({
            ...prev,
            enseignantsElus: prev.enseignantsElus.filter(id => id !== teacherId)
        }));
    };
    
    const getTeacherNameById = (id: string) => {
        const teacher = teachers.find(t => t.id === id);
        return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Inconnu';
    };


    // --- DATA PERSISTENCE ---
    const handleExport = () => {
        const allData = {
            schoolName, directorName, schoolLogoUrl, schoolYear, workingHours, optionalSubjects,
            classes, halls, students, teachers, payments, grades, attendanceData,
            subjectCoefficients, disciplineIncidents, conseilDisciplineMembers,
            disciplineCouncilMeetings
        };
        const dataStr = JSON.stringify(allData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `school_data_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Données exportées avec succès !");
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target?.result as string);
                    setDataToImport(importedData); // Open confirmation modal
                } catch (error) {
                    toast.error("Erreur lors de la lecture du fichier. Assurez-vous que c'est un fichier JSON valide.");
                    console.error("Import error:", error);
                }
            };
            reader.readAsText(file);
        }
    };
    
    const confirmImport = () => {
        if (dataToImport) {
            setSchoolName(dataToImport.schoolName || schoolName);
            setDirectorName(dataToImport.directorName || directorName);
            setSchoolLogoUrl(dataToImport.schoolLogoUrl || schoolLogoUrl);
            setSchoolYear(dataToImport.schoolYear || schoolYear);
            setWorkingHours(dataToImport.workingHours || workingHours);
            setOptionalSubjects(dataToImport.optionalSubjects || optionalSubjects);
            setClasses(dataToImport.classes || classes);
            setHalls(dataToImport.halls || halls);
            setStudents(dataToImport.students || students);
            setTeachers(dataToImport.teachers || teachers);
            setPayments(dataToImport.payments || payments);
            setGrades(dataToImport.grades || grades);
            setAttendanceData(dataToImport.attendanceData || attendanceData);
            setSubjectCoefficients(dataToImport.subjectCoefficients || subjectCoefficients);
            setDisciplineIncidents(dataToImport.disciplineIncidents || disciplineIncidents);
            setConseilDisciplineMembers(dataToImport.conseilDisciplineMembers || mockConseilDisciplineMembers);
            setDisciplineCouncilMeetings(dataToImport.disciplineCouncilMeetings || []);

            toast.success("Données importées avec succès ! L'application va se recharger.");
            setDataToImport(null);
            
            setTimeout(() => window.location.reload(), 1500);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Paramètres de l'Établissement</h1>

            <div className="bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-white bg-gray-700 p-3 rounded-t-lg flex items-center">
                    <ArrowDownTrayIcon className="h-5 w-5 mr-3" />
                    Gestion des Données
                </h2>
                <div className="border border-t-0 border-gray-300 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <button onClick={handleExport} className="flex-1 flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            <ArrowDownTrayIcon className="mr-2 h-5 w-5"/> Exporter les Données
                        </button>
                        <button onClick={handleImportClick} className="flex-1 flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                            <ArrowUpTrayIcon className="mr-2 h-5 w-5"/> Importer les Données
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-white bg-blue-600 p-3 rounded-t-lg flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-3" />
                    Informations Générales
                </h2>
                <div className="border border-t-0 border-blue-300 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
                            <input type="text" id="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="directorName" className="block text-sm font-medium text-gray-700">Nom du Directeur</label>
                            <input type="text" id="directorName" value={directorName} onChange={(e) => setDirectorName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                         <div>
                            <label htmlFor="schoolYear" className="block text-sm font-medium text-gray-700 flex items-center">
                                <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400"/>
                                Année Scolaire
                            </label>
                            <input type="text" id="schoolYear" value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} placeholder="ex: 2025-2026" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="schoolLogo" className="block text-sm font-medium text-gray-700">Logo de l'établissement</label>
                        <div className="mt-1 flex items-center space-x-6">
                            <span className="inline-block h-20 w-20 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center border">
                                {logoPreview ? <img src={logoPreview} alt="Aperçu du logo" className="h-full w-full object-contain" /> : <CameraIcon className="h-10 w-10 text-gray-400"/> }
                            </span>
                            <input type="file" id="schoolLogo" onChange={handleLogoChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-white bg-green-600 p-3 rounded-t-lg flex items-center">
                    <ClockIcon className="h-5 w-5 mr-3" />
                    Horaires de Travail
                </h2>
                <div className="border border-t-0 border-green-300 p-6 space-y-4">
                    {workingHours.map(d => (
                        <div key={d.dayIndex} className="flex flex-col md:flex-row gap-x-6 gap-y-3 items-start p-4 rounded-lg bg-white border border-gray-200">
                            {/* Day Label and Checkbox */}
                            <div className="w-full md:w-48 flex-shrink-0 flex items-center pt-2">
                                <input type="checkbox" id={`workday-${d.dayIndex}`} checked={d.isWorkingDay} onChange={(e) => handleWorkingHoursChange(d.dayIndex, 'isWorkingDay', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3" />
                                <label htmlFor={`workday-${d.dayIndex}`} className="font-semibold text-gray-700">{d.day}</label>
                            </div>

                            {/* Time Inputs Container */}
                            <div className={`flex-grow w-full flex flex-col md:flex-row items-start gap-x-6 gap-y-4 ${!d.isWorkingDay ? 'opacity-50' : ''}`}>
                                {/* Morning Block */}
                                <div className="flex-1 space-y-1">
                                    <span className="text-sm font-medium text-gray-700">Matin</span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500">Début</label>
                                            <input type="time" value={d.morningStart} onChange={(e) => handleWorkingHoursChange(d.dayIndex, 'morningStart', e.target.value)} disabled={!d.isWorkingDay} className="w-full text-sm p-1 border border-gray-200 rounded-md" />
                                        </div>
                                        <span className="pt-5 text-gray-400">-</span>
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500">Fin</label>
                                            <input type="time" value={d.morningEnd} onChange={(e) => handleWorkingHoursChange(d.dayIndex, 'morningEnd', e.target.value)} disabled={!d.isWorkingDay} className="w-full text-sm p-1 border border-gray-200 rounded-md" />
                                        </div>
                                    </div>
                                </div>

                                {/* Afternoon Block */}
                                <div className="flex-1 space-y-1">
                                    <span className="text-sm font-medium text-gray-700">Après-midi</span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500">Début</label>
                                            <input type="time" value={d.afternoonStart} onChange={(e) => handleWorkingHoursChange(d.dayIndex, 'afternoonStart', e.target.value)} disabled={!d.isWorkingDay} className="w-full text-sm p-1 border border-gray-200 rounded-md" />
                                        </div>
                                        <span className="pt-5 text-gray-400">-</span>
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500">Fin</label>
                                            <input type="time" value={d.afternoonEnd} onChange={(e) => handleWorkingHoursChange(d.dayIndex, 'afternoonEnd', e.target.value)} disabled={!d.isWorkingDay} className="w-full text-sm p-1 border border-gray-200 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md">
                 <h2 className="text-lg font-semibold text-white bg-purple-600 p-3 rounded-t-lg flex items-center">
                    <LibraryIcon className="h-5 w-5 mr-3" />
                    Structure Académique
                </h2>
                <div className="border border-t-0 border-purple-300 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-800">Gestion des Classes</h3>
                            <div className="p-4 bg-white rounded-lg border space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <select value={newClassNiveau} onChange={(e) => setNewClassNiveau(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="">Sélectionnez Niveau</option>
                                        {niveauOptions.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <select value={newClassSpecialite} onChange={(e) => setNewClassSpecialite(e.target.value)} disabled={!newClassNiveau} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                                        <option value="">Sélectionnez Spécialité</option>
                                        {availableSpecialitesForClassCreation.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <button onClick={handleAddClass} className="w-full flex items-center justify-center bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                                    <PlusIcon /> <span className="ml-2">Ajouter Classe</span>
                                </button>
                            </div>
                            <div className="mt-3 max-h-60 overflow-y-auto pr-2 space-y-2">
                                {classes.map(c => (
                                    <div key={c.id} className="flex justify-between items-center bg-white p-2 border rounded-md">
                                        <span>{c.name} <span className="text-xs text-gray-500">({c.niveau} - {c.specialite})</span></span>
                                        <button onClick={() => setClassToDelete(c)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md"><TrashIcon className="h-4 w-4"/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-800">Gestion des Salles</h3>
                            <div className="p-4 bg-white rounded-lg border space-y-3">
                                <div className="flex gap-3">
                                    <input type="text" value={newHall} onChange={(e) => setNewHall(e.target.value)} placeholder="Nom de la salle" className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                                    <button onClick={handleAddHall} className="flex-shrink-0 flex items-center justify-center bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                                        <PlusIcon /> <span className="ml-2">Ajouter</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 max-h-60 overflow-y-auto pr-2 space-y-2">
                                {halls.map(h => (
                                    <div key={h} className="flex justify-between items-center bg-white p-2 border rounded-md">
                                        <span>{h}</span>
                                        <button onClick={() => handleDeleteHall(h)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md"><TrashIcon className="h-4 w-4"/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-800 flex items-center"><AcademicCapIcon className="mr-2 h-5 w-5" />Matières Optionnelles</h3>
                            <div className="p-4 bg-white rounded-lg border space-y-3">
                                <div className="flex gap-3">
                                    <input type="text" value={newOptionalSubject} onChange={(e) => setNewOptionalSubject(e.target.value)} placeholder="Nom de la matière" className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                                    <button onClick={handleAddOptionalSubject} className="flex-shrink-0 flex items-center justify-center bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600">
                                        <PlusIcon /> <span className="ml-2">Ajouter</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 max-h-60 overflow-y-auto pr-2 space-y-2">
                                {optionalSubjects.map(s => (
                                    <div key={s} className="flex justify-between items-center bg-white p-2 border rounded-md">
                                        <span>{s}</span>
                                        <button onClick={() => handleDeleteOptionalSubject(s)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md"><TrashIcon className="h-4 w-4"/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md">
                 <h2 className="text-lg font-semibold text-white bg-red-600 p-3 rounded-t-lg flex items-center">
                    <ScaleIcon className="h-5 w-5 mr-3" />
                    Conseil de Discipline
                </h2>
                <div className="border border-t-0 border-red-300 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Membres Permanents</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-500">Président</label>
                                    <input type="text" value={directorName} disabled className="w-full text-sm p-2 border border-gray-200 rounded-md bg-gray-100" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">Censeur / Surveillant Général (الناظر)</label>
                                    <input type="text" value={conseilDisciplineMembers.censeur} onChange={e => setConseilDisciplineMembers(prev => ({...prev, censeur: e.target.value}))} className="w-full text-sm p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">Conseiller Principal (Externat)</label>
                                    <input type="text" value={conseilDisciplineMembers.conseillerPrincipal} onChange={e => setConseilDisciplineMembers(prev => ({...prev, conseillerPrincipal: e.target.value}))} className="w-full text-sm p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">Conseiller (Internat)</label>
                                    <input type="text" value={conseilDisciplineMembers.conseillerInternat} onChange={e => setConseilDisciplineMembers(prev => ({...prev, conseillerInternat: e.target.value}))} className="w-full text-sm p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Enseignants Élus (5 membres)</h3>
                                <div className="space-y-2">
                                    {conseilDisciplineMembers.enseignantsElus.map(teacherId => (
                                        <div key={teacherId} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                            <span>{getTeacherNameById(teacherId)}</span>
                                            <button onClick={() => handleRemoveElectedTeacher(teacherId)} className="p-1.5 text-red-500 hover:bg-red-200 rounded-md" title={`Retirer ${getTeacherNameById(teacherId)}`}><TrashIcon className="h-4 w-4"/></button>
                                        </div>
                                    ))}
                                    {conseilDisciplineMembers.enseignantsElus.length < 5 && (
                                        <button onClick={() => setIsTeacherModalOpen(true)} className="w-full flex items-center justify-center bg-blue-100 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-200">
                                            <PlusIcon /> <span className="ml-2">Ajouter un enseignant</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Représentant des Parents</h3>
                                <div>
                                    <label className="block text-xs text-gray-500">Nom du représentant</label>
                                    <input type="text" value={conseilDisciplineMembers.representantParents} onChange={e => setConseilDisciplineMembers(prev => ({...prev, representantParents: e.target.value}))} className="w-full text-sm p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Modals */}
             <Modal isOpen={isTeacherModalOpen} onClose={() => setIsTeacherModalOpen(false)} title="Ajouter un enseignant élu" size="lg">
                <div className="p-4 space-y-4">
                    <p>Sélectionnez un enseignant à ajouter au conseil.</p>
                    <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Sélectionnez un enseignant</option>
                        {availableTeachersForCouncil.map(t => (
                            <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                        ))}
                    </select>
                     <div className="flex justify-end space-x-3 pt-4">
                        <button onClick={() => setIsTeacherModalOpen(false)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Annuler</button>
                        <button onClick={handleAddElectedTeacher} disabled={!selectedTeacherId} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400">Ajouter</button>
                    </div>
                </div>
             </Modal>

            {classToDelete && (
                <Modal isOpen={!!classToDelete} onClose={() => setClassToDelete(null)} title="Confirmation de Suppression" size="lg">
                    <p>Êtes-vous sûr de vouloir supprimer la classe <strong>{classToDelete.name}</strong> ? Cette action est irréversible.</p>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setClassToDelete(null)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Annuler</button>
                        <button onClick={handleDeleteClass} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">Supprimer</button>
                    </div>
                </Modal>
            )}
            
            {dataToImport && (
                 <Modal isOpen={!!dataToImport} onClose={() => setDataToImport(null)} title="Confirmation d'Importation" size="xl">
                    <div className="p-4">
                        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-r-md">
                            <p className="font-semibold flex items-center"><InfoIcon className="h-5 w-5 mr-2" />Attention</p>
                            <p className="text-sm mt-1">L'importation de ces données écrasera toutes les données existantes dans l'application. Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?</p>
                        </div>
                         <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            <button onClick={() => setDataToImport(null)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Annuler</button>
                            <button onClick={confirmImport} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Confirmer et Importer</button>
                        </div>
                    </div>
                 </Modal>
            )}

        </div>
    );
};

export default EtablissementPage;