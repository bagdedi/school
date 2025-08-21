import React, { useState, useMemo, useEffect } from 'react';
import type { Student, Classe, StudentGrades, SubjectCoefficient } from '../../types';
import { Bulletin } from './Bulletin';
import { ResetIcon } from '../icons/ResetIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { PrintIcon } from '../icons/PrintIcon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BulletinsPageProps {
    students: Student[];
    classes: Classe[];
    grades: StudentGrades[];
    schoolName: string;
    directorName: string;
    subjectCoefficients: SubjectCoefficient[];
}

const BulletinsPage: React.FC<BulletinsPageProps> = ({ students, classes, grades, schoolName, directorName, subjectCoefficients }) => {
    const [filters, setFilters] = useState({ niveau: '', specialite: '', classe: '', studentId: '' });
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => {
            const newFilters = { ...prev, [filterName]: value };
            if (filterName === 'niveau') {
                newFilters.specialite = '';
                newFilters.classe = '';
                newFilters.studentId = '';
            } else if (filterName === 'specialite') {
                newFilters.classe = '';
                newFilters.studentId = '';
            } else if (filterName === 'classe') {
                newFilters.studentId = '';
            }
            return newFilters;
        });
    };

    const uniqueNiveaux = useMemo(() => [...new Set(classes.map(c => c.niveau))].sort(), [classes]);
    const availableSpecialites = useMemo(() => {
        if (!filters.niveau) return [];
        return [...new Set(classes.filter(c => c.niveau === filters.niveau).map(c => c.specialite))].sort();
    }, [filters.niveau, classes]);

    const availableClasses = useMemo(() => {
        if (!filters.niveau || !filters.specialite) return [];
        return classes.filter(c => c.niveau === filters.niveau && c.specialite === filters.specialite).sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    }, [filters.niveau, filters.specialite, classes]);

    const availableStudents = useMemo(() => {
        if (!filters.classe) return [];
        return students.filter(s => s.classe === filters.classe).sort((a,b) => a.lastName.localeCompare(b.lastName));
    }, [filters.classe, students]);

    useEffect(() => {
        if (filters.studentId) {
            setSelectedStudent(students.find(s => s.id === filters.studentId) || null);
        } else {
            setSelectedStudent(null);
        }
    }, [filters.studentId, students]);

    const resetFilters = () => {
        setFilters({ niveau: '', specialite: '', classe: '', studentId: '' });
    };
    
    const handlePrint = () => {
        const bulletinElement = document.getElementById('bulletin-to-print');
        if (!bulletinElement || !selectedStudent) return;
        setIsPrinting(true);
        html2canvas(bulletinElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            onclone: (document) => {
              // Ensure the font is loaded
              const fontLink = document.createElement('link');
              fontLink.rel = 'stylesheet';
              fontLink.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
              document.head.appendChild(fontLink);
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Bulletin_${selectedStudent.lastName}_${selectedStudent.firstName}.pdf`);
        }).finally(() => {
            setIsPrinting(false);
        });
    };

    const studentGradesData = grades.find(g => g.studentId === selectedStudent?.id && g.term === 'Trimestre 1');
    const allClassGrades = grades.filter(g => availableStudents.some(s => s.id === g.studentId));
    const classStudentCount = availableStudents.length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Consultation des Bulletins</h1>
                <p className="mt-1 text-gray-600">Filtrez pour sélectionner un étudiant et afficher son bulletin de notes.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Niveau</label>
                        <select value={filters.niveau} onChange={e => handleFilterChange('niveau', e.target.value)} className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Sélectionnez...</option>
                            {uniqueNiveaux.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Spécialité</label>
                        <select value={filters.specialite} onChange={e => handleFilterChange('specialite', e.target.value)} disabled={!filters.niveau} className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                            <option value="">Sélectionnez...</option>
                            {availableSpecialites.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Classe</label>
                        <select value={filters.classe} onChange={e => handleFilterChange('classe', e.target.value)} disabled={!filters.specialite} className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                            <option value="">Sélectionnez...</option>
                            {availableClasses.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Étudiant</label>
                        <select value={filters.studentId} onChange={e => handleFilterChange('studentId', e.target.value)} disabled={!filters.classe} className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100">
                            <option value="">Sélectionnez...</option>
                            {availableStudents.map(s => <option key={s.id} value={s.id}>{s.lastName} {s.firstName}</option>)}
                        </select>
                    </div>
                    <button onClick={resetFilters} className="flex items-center justify-center bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors h-10">
                        <ResetIcon className="mr-2 h-4 w-4" />
                        Réinitialiser
                    </button>
                </div>
            </div>

            {selectedStudent ? (
                <div className="animate-fade-in">
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={handlePrint} 
                            disabled={isPrinting}
                            className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                        >
                            <PrintIcon className="h-4 w-4 mr-2" />
                            {isPrinting ? 'Génération...' : 'Exporter PDF'}
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <Bulletin 
                            student={selectedStudent} 
                            studentGrades={studentGradesData}
                            allClassGrades={allClassGrades}
                            schoolName={schoolName}
                            directorName={directorName}
                            subjectCoefficients={subjectCoefficients}
                            classStudentCount={classStudentCount}
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 mt-6">
                    <AcademicCapIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700">Veuillez sélectionner un étudiant</h3>
                    <p>Utilisez les filtres ci-dessus pour afficher un bulletin de notes.</p>
                </div>
            )}
        </div>
    );
};

export default BulletinsPage;