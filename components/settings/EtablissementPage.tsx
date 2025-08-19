import React, { useState, useMemo, useEffect } from 'react';
import type { DayWorkingHours, Classe } from '../../types';
import { InfoIcon } from '../icons/InfoIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CameraIcon } from '../icons/CameraIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { LibraryIcon } from '../icons/LibraryIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';

interface EtablissementPageProps {
  schoolName: string;
  setSchoolName: (name: string) => void;
  schoolLogo: React.ReactNode;
  setSchoolLogo: (logo: React.ReactNode) => void;
  workingHours: DayWorkingHours[];
  setWorkingHours: (hours: DayWorkingHours[]) => void;
  optionalSubjects: string[];
  setOptionalSubjects: (subjects: string[]) => void;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

const niveauOptions = ['1 annee', '2 annee', '3 annee', '4 annee'];

const getSpecialiteAbbr = (specialite: string): string => {
  const abbreviations: { [key: string]: string } = {
    'Tronc commun': 'AS',
    'Sport': 'SPORT',
    'Sciences': 'SC.',
    'Economie et Gestion': 'ECO-GES.',
    'Lettres': 'LETT.',
    'Sciences Expérimentales': 'SC.EXP.',
    'Mathématiques': 'MATH',
    'Techniques': 'TECH.',
    'Technologie': 'TECH.',
    'Sciences Informatiques': 'INFO.',
  };
  return abbreviations[specialite] || specialite.substring(0, 4).toUpperCase();
};


const EtablissementPage: React.FC<EtablissementPageProps> = ({
    schoolName, setSchoolName, schoolLogo, setSchoolLogo, workingHours, setWorkingHours, optionalSubjects, setOptionalSubjects, classes, setClasses
}) => {
    const [directorName, setDirectorName] = useState('Dr. Helmi Ahmed EL KAMEL');
    const [hallTypes, setHallTypes] = useState(['Salle', 'Labo', 'Mixte']);
    const [newHallType, setNewHallType] = useState('');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [newClassNiveau, setNewClassNiveau] = useState('');
    const [newClassSpecialite, setNewClassSpecialite] = useState('');
    const [newOptionalSubject, setNewOptionalSubject] = useState('');
    
    useEffect(() => {
        setNewClassSpecialite('');
    }, [newClassNiveau]);

    const availableSpecialitesForClassCreation = useMemo(() => {
        switch (newClassNiveau) {
          case '1 annee':
            return ['Tronc commun', 'Sport'];
          case '2 annee':
            return ['Sciences', 'Technologie', 'Lettres', 'Sport', 'Economie et Gestion'];
          case '3 annee':
          case '4 annee':
            return [
              'Mathématiques',
              'Sciences Expérimentales',
              'Techniques',
              'Sport',
              'Lettres',
              'Economie et Gestion',
              'Sciences Informatiques'
            ];
          default:
            return [];
        }
    }, [newClassNiveau]);

    const handleCreateClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClassNiveau || !newClassSpecialite) return;

        const existingClasses = classes.filter(c => c.niveau === newClassNiveau && c.specialite === newClassSpecialite);
        const newNumber = existingClasses.length > 0 ? Math.max(...existingClasses.map(c => c.number)) + 1 : 1;

        const niveauPrefix = newClassNiveau.split(' ')[0];
        const specialiteAbbr = getSpecialiteAbbr(newClassSpecialite);

        const newClassName = `${niveauPrefix} ${specialiteAbbr} ${newNumber}`;

        const newClass: Classe = {
            id: Date.now().toString(),
            niveau: newClassNiveau,
            specialite: newClassSpecialite,
            number: newNumber,
            name: newClassName,
        };

        setClasses([...classes, newClass].sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true })));
        
        setNewClassNiveau('');
        setNewClassSpecialite('');
    };

    const handleDeleteClass = (classId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.')) {
            setClasses(classes.filter(c => c.id !== classId));
        }
    };
    
    const groupedClasses = useMemo(() => {
      return classes.reduce((acc, currentClass) => {
          const { niveau, specialite } = currentClass;
          if (!acc[niveau]) {
              acc[niveau] = {};
          }
          if (!acc[niveau][specialite]) {
              acc[niveau][specialite] = [];
          }
          acc[niveau][specialite].push(currentClass);
          return acc;
      }, {} as Record<string, Record<string, Classe[]>>);
    }, [classes]);


    const handleAddHall = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHallType && !hallTypes.includes(newHallType.trim())) {
            setHallTypes([...hallTypes, newHallType.trim()]);
            setNewHallType('');
        }
    };

    const handleDeleteHall = (hallToDelete: string) => {
        setHallTypes(hallTypes.filter(hall => hall !== hallToDelete));
    };
    
    const handleAddOptionalSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (newOptionalSubject && !optionalSubjects.includes(newOptionalSubject.trim())) {
            setOptionalSubjects([...optionalSubjects, newOptionalSubject.trim()]);
            setNewOptionalSubject('');
        }
    };

    const handleDeleteOptionalSubject = (subjectToDelete: string) => {
        setOptionalSubjects(optionalSubjects.filter(subject => subject !== subjectToDelete));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setLogoPreview(result);
          setSchoolLogo(<img src={result} alt="School Logo" className="h-8 w-8 object-contain" />);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleToggleDay = (dayIndex: number) => {
        setWorkingHours(
            workingHours.map(d =>
                d.dayIndex === dayIndex ? { ...d, isWorkingDay: !d.isWorkingDay } : d
            )
        );
    };

    const handleTimeChange = (dayIndex: number, type: 'morningStart' | 'morningEnd' | 'afternoonStart' | 'afternoonEnd', value: string) => {
        setWorkingHours(
            workingHours.map(d =>
                d.dayIndex === dayIndex ? { ...d, [type]: value } : d
            )
        );
    };


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Paramètres de l'Établissement</h1>
      
      <div className="space-y-12">
        {/* School Information */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Informations de l'école</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">Nom de l'école</label>
              <input type="text" id="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="directorName" className="block text-sm font-medium text-gray-700">Nom du directeur</label>
              <input type="text" id="directorName" value={directorName} onChange={(e) => setDirectorName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className='md:col-span-2'>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo de l'école</label>
                <div className="flex items-center space-x-6">
                    <div className="h-20 w-20 flex-shrink-0 rounded-md border bg-gray-50 flex items-center justify-center text-gray-400">
                        {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-contain" /> : schoolLogo}
                    </div>
                     <input type="file" id="logo" name="logo" onChange={handleLogoChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                </div>
            </div>
          </div>
        </div>
        
        {/* Working Hours */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center">
            <ClockIcon className="h-5 w-5 mr-3 text-gray-600"/>
            Horaires de Travail
          </h2>
          <div className="space-y-4">
            {workingHours.map(day => (
              <div key={day.dayIndex} className="grid grid-cols-1 lg:grid-cols-3 items-center gap-4 p-3 rounded-lg bg-gray-50 border">
                <div className="font-semibold text-gray-800 lg:col-span-1 flex items-center">
                   <button onClick={() => handleToggleDay(day.dayIndex)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors mr-4 flex-shrink-0 ${day.isWorkingDay ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${day.isWorkingDay ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  {day.day}
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md border">
                        <p className="text-sm font-medium text-center text-gray-600 mb-2">Matin</p>
                        <div className="flex items-center space-x-2">
                             <div>
                                <label htmlFor={`morning-start-${day.dayIndex}`} className="block text-xs font-medium text-gray-500">Début</label>
                                <input
                                    type="time"
                                    id={`morning-start-${day.dayIndex}`}
                                    value={day.morningStart}
                                    onChange={(e) => handleTimeChange(day.dayIndex, 'morningStart', e.target.value)}
                                    disabled={!day.isWorkingDay}
                                    className="mt-1 block w-full px-1 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200"
                                />
                            </div>
                            <div>
                                <label htmlFor={`morning-end-${day.dayIndex}`} className="block text-xs font-medium text-gray-500">Fin</label>
                                <input
                                    type="time"
                                    id={`morning-end-${day.dayIndex}`}
                                    value={day.morningEnd}
                                    onChange={(e) => handleTimeChange(day.dayIndex, 'morningEnd', e.target.value)}
                                    disabled={!day.isWorkingDay}
                                    className="mt-1 block w-full px-1 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                     <div className="bg-white p-3 rounded-md border">
                        <p className="text-sm font-medium text-center text-gray-600 mb-2">Après-midi</p>
                        <div className="flex items-center space-x-2">
                            <div>
                                <label htmlFor={`afternoon-start-${day.dayIndex}`} className="block text-xs font-medium text-gray-500">Début</label>
                                <input
                                    type="time"
                                    id={`afternoon-start-${day.dayIndex}`}
                                    value={day.afternoonStart}
                                    onChange={(e) => handleTimeChange(day.dayIndex, 'afternoonStart', e.target.value)}
                                    disabled={!day.isWorkingDay}
                                    className="mt-1 block w-full px-1 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200"
                                />
                            </div>
                            <div>
                                <label htmlFor={`afternoon-end-${day.dayIndex}`} className="block text-xs font-medium text-gray-500">Fin</label>
                                <input
                                    type="time"
                                    id={`afternoon-end-${day.dayIndex}`}
                                    value={day.afternoonEnd}
                                    onChange={(e) => handleTimeChange(day.dayIndex, 'afternoonEnd', e.target.value)}
                                    disabled={!day.isWorkingDay}
                                    className="mt-1 block w-full px-1 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hall Management */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Gestion des Salles</h2>
          
          <form onSubmit={handleAddHall} className="flex items-end space-x-3 mb-6">
            <div className="flex-grow">
              <label htmlFor="newHallType" className="block text-sm font-medium text-gray-700">Nouveau type de salle</label>
              <input 
                type="text" 
                id="newHallType" 
                value={newHallType} 
                onChange={(e) => setNewHallType(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Amphi, Salle de réunion..."
              />
            </div>
            <button type="submit" className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors h-10">
              <PlusIcon />
              <span className="ml-2 hidden sm:inline">Ajouter</span>
            </button>
          </form>

          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Types de salles existants</h3>
            {hallTypes.length > 0 ? (
                <ul className="space-y-2">
                {hallTypes.map(hall => (
                    <li key={hall} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium text-gray-800">{hall}</span>
                    <button 
                        onClick={() => handleDeleteHall(hall)}
                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={`Supprimer ${hall}`}
                    >
                        <TrashIcon />
                    </button>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-4">Aucun type de salle défini.</p>
            )}
          </div>
        </div>
        
        {/* Optional Subjects Management */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-3 text-gray-600"/>
            Gestion des Matières Optionnelles
          </h2>
          
          <form onSubmit={handleAddOptionalSubject} className="flex items-end space-x-3 mb-6">
            <div className="flex-grow">
              <label htmlFor="newOptionalSubject" className="block text-sm font-medium text-gray-700">Nouvelle matière optionnelle</label>
              <input 
                type="text" 
                id="newOptionalSubject" 
                value={newOptionalSubject} 
                onChange={(e) => setNewOptionalSubject(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Musique, Allemand..."
              />
            </div>
            <button type="submit" className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors h-10">
              <PlusIcon />
              <span className="ml-2 hidden sm:inline">Ajouter</span>
            </button>
          </form>

          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Matières optionnelles existantes</h3>
            {optionalSubjects.length > 0 ? (
                <ul className="space-y-2">
                {optionalSubjects.map(subject => (
                    <li key={subject} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium text-gray-800">{subject}</span>
                    <button 
                        onClick={() => handleDeleteOptionalSubject(subject)}
                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={`Supprimer ${subject}`}
                    >
                        <TrashIcon />
                    </button>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-4">Aucune matière optionnelle définie.</p>
            )}
          </div>
        </div>

        {/* Organigramme des classes */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6 flex items-center">
              <LibraryIcon className="h-5 w-5 mr-3 text-gray-600"/>
              Organigramme des classes
          </h2>

          <form onSubmit={handleCreateClass} className="bg-gray-50 p-4 rounded-lg border mb-8">
              <h3 className="text-md font-semibold text-gray-700 mb-3">Créer une nouvelle classe</h3>
              <div className="flex flex-col sm:flex-row items-end sm:space-x-3 space-y-3 sm:space-y-0">
                  <div className="flex-grow w-full">
                      <label htmlFor="newClassNiveau" className="block text-sm font-medium text-gray-700">Niveau</label>
                      <select 
                          id="newClassNiveau" 
                          value={newClassNiveau} 
                          onChange={(e) => setNewClassNiveau(e.target.value)} 
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          required
                      >
                          <option value="">Sélectionnez...</option>
                          {niveauOptions.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                  </div>
                  <div className="flex-grow w-full">
                      <label htmlFor="newClassSpecialite" className="block text-sm font-medium text-gray-700">Spécialité</label>
                      <select 
                          id="newClassSpecialite" 
                          value={newClassSpecialite} 
                          onChange={(e) => setNewClassSpecialite(e.target.value)}
                          disabled={!newClassNiveau}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                          required
                      >
                          <option value="">Sélectionnez...</option>
                          {availableSpecialitesForClassCreation.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                  <button type="submit" className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors h-10 w-full sm:w-auto flex-shrink-0">
                      <PlusIcon />
                      <span className="ml-2">Créer</span>
                  </button>
              </div>
          </form>

          <div>
              <h3 className="text-md font-semibold text-gray-700 mb-4">Classes existantes</h3>
              {Object.keys(groupedClasses).length > 0 ? (
                  <div className="space-y-6">
                      {Object.entries(groupedClasses).map(([niveau, specialites]) => (
                          <div key={niveau} className="p-4 border rounded-lg">
                              <h4 className="text-lg font-bold text-gray-800 capitalize">{niveau}</h4>
                              <div className="mt-3 space-y-3 pl-4 border-l-2 border-indigo-200">
                                  {Object.entries(specialites).map(([specialite, classList]) => (
                                      <div key={specialite}>
                                          <h5 className="font-semibold text-gray-600">{specialite}</h5>
                                          <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                              {classList.sort((a,b) => a.number - b.number).map(c => (
                                                  <li key={c.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md border border-gray-200">
                                                      <span className="font-mono text-sm text-indigo-800 font-medium">{c.name}</span>
                                                      <button 
                                                          onClick={() => handleDeleteClass(c.id)}
                                                          className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                                                          aria-label={`Supprimer la classe ${c.name}`}
                                                      >
                                                          <TrashIcon />
                                                      </button>
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-md">
                      <p>Aucune classe n'a encore été créée.</p>
                      <p className="text-sm mt-1">Utilisez le formulaire ci-dessus pour commencer.</p>
                  </div>
              )}
          </div>
        </div>


        <div className="flex justify-end">
          <button className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default EtablissementPage;