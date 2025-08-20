import React, { useState, useMemo } from 'react';
import { FilterIcon } from '../icons/FilterIcon';
import { ResetIcon } from '../icons/ResetIcon';
import type { Student, SharedFilterState } from '../../types';
import { Modal } from '../common/Modal';
import { ClassDetailsTable } from './ClassDetailsTable';

const anneeScolaireOptions = ['2023-2024', '2024-2025', '2025-2026'];
const niveauOptions = ['1 annee', '2 annee', '3 annee', '4 annee'];

// --- DYNAMIC DATA COMPONENTS ---

const COLORS = ['#f97316', '#f59e0b', '#10b981', '#8b5cf6', '#3b82f6', '#ec4899'];

interface PieChartProps {
  data: { name: string; value: number }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-blue-200 py-4 text-sm">Pas de données d'option.</div>;
  }
  
  const total = data.reduce((acc, item) => acc + item.value, 0);
  if (total === 0) {
    return <div className="text-center text-blue-200 py-4 text-sm">Pas de données d'option.</div>;
  }

  let cumulativePercent = 0;
  const gradients = data.map((item, index) => {
    const percent = (item.value / total) * 100;
    const start = cumulativePercent;
    cumulativePercent += percent;
    const end = cumulativePercent;
    return `${COLORS[index % COLORS.length]} ${start}% ${end}%`;
  });

  return (
    <div className="flex flex-col items-center text-white">
      <div 
        className="w-28 h-28 rounded-full"
        style={{ background: `conic-gradient(${gradients.join(', ')})` }}
        role="img"
        aria-label="Répartition des options"
      ></div>
      <div className="mt-3 w-full">
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          {data.map((item, index) => (
            <li key={item.name} className="flex items-center">
              <span className="w-2.5 h-2.5 mr-1.5" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface ClasseStat {
  id: string;
  name: string;
  totalStudents: number;
  males: number;
  females: number;
  optionsDistribution: { name: string; value: number }[];
}


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
      <div className="p-4 space-y-2 flex-grow">
        <p>Nombre des etudiants: {data.totalStudents}</p>
        <p>Males: {data.males}</p>
        <p>Femelles: {data.females}</p>
        
        {data.optionsDistribution.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-400">
                <h4 className="text-center font-semibold mb-2 text-sm">option</h4>
                <PieChart data={data.optionsDistribution} />
            </div>
        )}
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

  const filteredStudentsForStats = useMemo(() => {
    if (!isFiltered) return [];
    
    return students.filter(student => {
        const anneeMatch = anneeScolaire ? student.schoolYear === anneeScolaire : true;
        const niveauMatch = filters.niveau ? student.academicLevel === filters.niveau : true;
        const specialiteMatch = filters.specialite ? student.academicSpecialty === filters.specialite : true;
        const optionMatch = filters.option ? student.option === filters.option : true;
        return anneeMatch && niveauMatch && specialiteMatch && optionMatch;
    });
  }, [isFiltered, students, filters, anneeScolaire]);

  const classeStats = useMemo((): ClasseStat[] => {
    if (filteredStudentsForStats.length === 0) return [];
    
    const studentsByClass = filteredStudentsForStats.reduce((acc, student) => {
        const classeName = student.classe || 'Non assigné';
        if (!acc[classeName]) {
            acc[classeName] = [];
        }
        acc[classeName].push(student);
        return acc;
    }, {} as Record<string, Student[]>);
    

    return Object.entries(studentsByClass).map(([className, classStudents], index) => {
        const optionsStatsForClass = classStudents
            .filter(s => s.option)
            .reduce((acc, student) => {
                const option = student.option!;
                acc[option] = (acc[option] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const optionsDistribution = Object.entries(optionsStatsForClass)
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value);
            
        return {
            id: `class-stat-${className}-${index}`,
            name: className,
            totalStudents: classStudents.length,
            males: classStudents.filter(s => s.gender === 'Male').length,
            females: classStudents.filter(s => s.gender === 'Female').length,
            optionsDistribution,
        };
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [filteredStudentsForStats]);


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
          />
        </Modal>
      )}
    </>
  );
};

export default EtatPedagogiquePage;