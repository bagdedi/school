import React, { useState, useMemo, useEffect } from 'react';
import { FilterIcon } from '../icons/FilterIcon';
import { ResetIcon } from '../icons/ResetIcon';
import type { Student, SharedFilterState } from '../../types';
import { Modal } from '../common/Modal';
import { ClassDetailsTable } from './ClassDetailsTable';

const anneeScolaireOptions = ['2023-2024', '2024-2025', '2025-2026'];
const niveauOptions = ['1 annee', '2 annee', '3 annee', '4 annee'];

// --- DYNAMIC DATA COMPONENTS ---

interface OptionStat {
  name: string;
  count: number;
  color: string;
}

interface ClasseStat {
  id: string;
  name: string;
  totalStudents: number;
  males: number;
  females: number;
  options: OptionStat[];
}


const PieChart: React.FC<{ data: OptionStat[] }> = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.count, 0);
  if (total === 0) return <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">N/A</div>;

  let cumulativePercentage = 0;
  const gradients = data.map(item => {
    const percentage = (item.count / total) * 100;
    const start = cumulativePercentage;
    cumulativePercentage += percentage;
    const end = cumulativePercentage;
    return `${item.color} ${start}% ${end}%`;
  });

  return (
    <div
      className="w-24 h-24 rounded-full"
      style={{ background: `conic-gradient(${gradients.join(', ')})` }}
    />
  );
};

interface ClasseCardProps {
  data: ClasseStat;
  onShowDetails: (data: ClasseStat) => void;
}

const ClasseCard: React.FC<ClasseCardProps> = ({ data, onShowDetails }) => {
  return (
    <div className="bg-blue-600 text-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="bg-gray-200 text-gray-800 p-3 font-bold text-center">
        Classe: {data.name}
      </div>
      <div className="p-4 space-y-3 flex-grow">
        <p>Nombre des etudiants: {data.totalStudents}</p>
        <p>Males: {data.males}</p>
        <p>Femelles: {data.females}</p>
        <div className="pt-4 text-center">
          <h3 className="font-semibold mb-3">Option</h3>
          <div className="flex justify-center items-center space-x-6">
            <PieChart data={data.options} />
            <ul className="text-left text-sm space-y-1">
              {data.options.map(opt => (
                <li key={opt.name} className="flex items-center">
                  <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: opt.color }}></span>
                  <span className="capitalize">{opt.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="p-4 mt-auto">
        <button 
          onClick={() => onShowDetails(data)}
          className="w-full bg-white text-blue-600 font-bold py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          details
        </button>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---

interface EtatPedagogiquePageProps {
  optionalSubjects: string[];
  students: Student[];
  filters: SharedFilterState;
  onFilterChange: (filterName: keyof SharedFilterState, value: string) => void;
  onResetFilters: () => void;
}

const EtatPedagogiquePage: React.FC<EtatPedagogiquePageProps> = ({ 
  optionalSubjects, 
  students,
  filters,
  onFilterChange,
  onResetFilters 
}) => {
  const [anneeScolaire, setAnneeScolaire] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedClassDetails, setSelectedClassDetails] = useState<ClasseStat | null>(null);

  const optionColors = useMemo(() => {
      const COLORS = ['#facc15', '#f97316', '#84cc16', '#78350f', '#3b82f6', '#8b5cf6'];
      return optionalSubjects.reduce((acc, subject, index) => {
          acc[subject.toLowerCase()] = COLORS[index % COLORS.length];
          return acc;
      }, {} as Record<string, string>);
  }, [optionalSubjects]);

  const classeStats = useMemo((): ClasseStat[] => {
    if (!isFiltered) {
        return [];
    }

    const filteredStudents = students.filter(student => {
        const niveauMatch = filters.niveau ? student.academicLevel === filters.niveau : true;
        const specialiteMatch = filters.specialite ? student.academicSpecialty === filters.specialite : true;
        const optionMatch = filters.option ? student.option === filters.option : true;
        // Assuming the `students` prop is already for the correct school year.
        return niveauMatch && specialiteMatch && optionMatch;
    });

    const studentsByClass = filteredStudents.reduce((acc, student) => {
        const classeName = student.classe || 'Non assigné';
        if (!acc[classeName]) {
            acc[classeName] = [];
        }
        acc[classeName].push(student);
        return acc;
    }, {} as Record<string, Student[]>);
    

    return Object.entries(studentsByClass).map(([className, classStudents], index) => {
        
        const optionsCount = classStudents.reduce((acc, student) => {
            if (student.option) {
                acc[student.option] = (acc[student.option] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const classOptions: OptionStat[] = Object.entries(optionsCount).map(([optionName, count]) => ({
            name: optionName,
            count: count,
            color: optionColors[optionName.toLowerCase()] || '#6b7280',
        }));

        return {
            id: `class-stat-${className}-${index}`,
            name: className,
            totalStudents: classStudents.length,
            males: classStudents.filter(s => s.gender === 'Male').length,
            females: classStudents.filter(s => s.gender === 'Female').length,
            options: classOptions,
        };
    });
  }, [isFiltered, students, filters, optionalSubjects, optionColors]);

  const availableSpecialites = useMemo(() => {
    switch (filters.niveau) {
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
  }, [filters.niveau]);

  const isSpecialiteDisabled = !filters.niveau;
  const isOptionDisabled = filters.niveau !== '3 annee' && filters.niveau !== '4 annee';

  const handleFilter = () => {
    if (anneeScolaire || filters.niveau || filters.specialite || filters.option) {
      setIsFiltered(true);
    } else {
        setIsFiltered(false);
    }
  };

  const handleReset = () => {
    onResetFilters();
    setAnneeScolaire('');
    setIsFiltered(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Etat Pédagogique</h1>
          <p className="mt-1 text-gray-600">Sélectionnez les paramètres pour générer l'état pédagogique.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Filtres de sélection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="anneeScolaire" className="block text-sm font-medium text-gray-700">Année Scolaire</label>
              <select
                id="anneeScolaire"
                value={anneeScolaire}
                onChange={(e) => setAnneeScolaire(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionnez...</option>
                {anneeScolaireOptions.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">Niveau</label>
              <select
                id="niveau"
                value={filters.niveau}
                onChange={(e) => onFilterChange('niveau', e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionnez...</option>
                {niveauOptions.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="specialite" className="block text-sm font-medium text-gray-700">Spécialité</label>
              <select
                id="specialite"
                value={filters.specialite}
                onChange={(e) => onFilterChange('specialite', e.target.value)}
                disabled={isSpecialiteDisabled}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              >
                <option value="">Sélectionnez...</option>
                {availableSpecialites.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="option" className="block text-sm font-medium text-gray-700">Option</label>
              <select
                id="option"
                value={filters.option}
                onChange={(e) => onFilterChange('option', e.target.value)}
                disabled={isOptionDisabled}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              >
                <option value="">Sélectionnez...</option>
                {optionalSubjects.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleReset}
              className="flex items-center bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <ResetIcon className="mr-2" />
              Réinitialiser
            </button>
            <button
              onClick={handleFilter}
              className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FilterIcon className="mr-2" />
              Filtrer
            </button>
          </div>
        </div>
        
        {isFiltered && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Résultats de l'état pédagogique</h2>
            {classeStats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {classeStats.map(classe => (
                    <ClasseCard key={classe.id} data={classe} onShowDetails={setSelectedClassDetails} />
                  ))}
              </div>
            ) : (
              <div className="bg-gray-50 text-center py-10 rounded-lg border">
                  <p className="text-gray-600 font-semibold">Aucun résultat trouvé</p>
                  <p className="text-sm text-gray-500 mt-1">Veuillez ajuster vos filtres ou vérifier les données des étudiants.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedClassDetails && (
        <Modal
          isOpen={!!selectedClassDetails}
          onClose={() => setSelectedClassDetails(null)}
          title={`Liste des étudiants - Classe: ${selectedClassDetails.name}`}
          size="4xl"
        >
          <ClassDetailsTable
            classNameToShow={selectedClassDetails.name}
            students={students}
            optionalSubjects={optionalSubjects}
            optionColors={optionColors}
          />
        </Modal>
      )}
    </>
  );
};

export default EtatPedagogiquePage;
