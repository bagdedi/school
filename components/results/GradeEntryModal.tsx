import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import type { Classe, Student, Teacher, StudentGrades, SubjectGrade } from '../../types';
import { findAssessmentRule } from '../scholarship/continuousAssessmentData';
import { Toaster, toast } from 'react-hot-toast';
import { SaveIcon } from '../icons/SaveIcon';
import { CalculatorIcon } from '../icons/CalculatorIcon';
import { PrintIcon } from '../icons/PrintIcon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface GradeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  classe: Classe;
  teacher: Teacher;
  subjectName: string;
  students: Student[];
  allGrades: StudentGrades[];
  setAllGrades: React.Dispatch<React.SetStateAction<StudentGrades[]>>;
}

type LocalGrades = { [studentId: string]: { [examName: string]: string } };
type Averages = { [studentId: string]: string };
type Observations = { [studentId: string]: string };

const getObservationForAverage = (average: number): string => {
  if (isNaN(average)) return '';
  if (average < 8) return 'mediocre';
  if (average < 10) return 'faible';
  if (average < 12) return 'passable';
  if (average < 14) return 'assez bien';
  if (average < 16) return 'bien';
  if (average < 18) return 'très bien';
  return 'excellent';
};

export const GradeEntryModal: React.FC<GradeEntryModalProps> = ({
  isOpen,
  onClose,
  classe,
  teacher,
  subjectName,
  students,
  allGrades,
  setAllGrades,
}) => {
  const [localGrades, setLocalGrades] = useState<LocalGrades>({});
  const [averages, setAverages] = useState<Averages>({});
  const [observations, setObservations] = useState<Observations>({});
  const [navigationDirection, setNavigationDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isCalculated, setIsCalculated] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const sortedStudents = useMemo(() => {
    return [...students].sort((a,b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
  }, [students]);

  const assessmentRule = useMemo(() => {
    return findAssessmentRule({
      id: '',
      subject: subjectName,
      level: classe.niveau,
      specialization: classe.specialite,
      hours: '',
      coefficient: '',
    });
  }, [subjectName, classe]);

  useEffect(() => {
    if (isOpen) {
        const initialLocalGrades: LocalGrades = {};
        sortedStudents.forEach(student => {
            const studentGradeData = allGrades.find(g => g.studentId === student.id && g.term === 'Trimestre 1');
            const subjectGrade = studentGradeData?.grades.find(sg => sg.subjectName === subjectName);
            if (subjectGrade) {
                initialLocalGrades[student.id] = {};
                Object.entries(subjectGrade.notes).forEach(([examName, grade]) => {
                    initialLocalGrades[student.id][examName] = grade !== null ? String(grade) : '';
                });
            }
        });
        setLocalGrades(initialLocalGrades);
        setAverages({});
        setObservations({});
        setIsCalculated(false);
    }
  }, [isOpen, sortedStudents, allGrades, subjectName]);

  const calculateStudentAverage = (studentId: string, currentGrades: LocalGrades): string => {
    if (!assessmentRule) return 'N/A';

    const studentGrades = currentGrades[studentId] || {};
    let numerator = 0;
    let denominator = 0;

    for (const exam of assessmentRule.exams) {
      const gradeStr = studentGrades[exam.name];
      const coeffStr = String(exam.coefficient).replace(',', '.');
      if (gradeStr !== undefined && gradeStr !== '') {
        const grade = parseFloat(gradeStr.replace(',', '.'));
        const coeff = parseFloat(coeffStr);
        if (!isNaN(grade) && !isNaN(coeff)) {
          numerator += grade * coeff;
          denominator += coeff;
        }
      }
    }
    
    if (denominator === 0) return '-';
    
    const average = numerator / denominator;
    return average.toFixed(2);
  };
  
  const examColumns = useMemo(() => assessmentRule?.exams || [], [assessmentRule]);

  const handleGradeChange = (studentId: string, examName: string, value: string) => {
    const sanitizedValue = value.replace(',', '.');
    if (sanitizedValue && !/^\d*\.?\d*$/.test(sanitizedValue)) return;

    const numValue = parseFloat(sanitizedValue);
    if (!isNaN(numValue) && numValue > 20) return;

    setLocalGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [examName]: sanitizedValue,
      },
    }));
    
    if (isCalculated) {
      setIsCalculated(false);
      setAverages({});
      setObservations({});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, studentIndex: number, examIndex: number) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    let nextStudentIndex = studentIndex;
    let nextExamIndex = examIndex;

    if (navigationDirection === 'horizontal') {
        nextExamIndex++;
        if (nextExamIndex >= examColumns.length) {
            nextExamIndex = 0;
            nextStudentIndex++;
            if (nextStudentIndex >= sortedStudents.length) {
                nextStudentIndex = 0; // Loop to first student
            }
        }
    } else { // vertical
        nextStudentIndex++;
        if (nextStudentIndex >= sortedStudents.length) {
            nextStudentIndex = 0;
            nextExamIndex++;
            if (nextExamIndex >= examColumns.length) {
                nextExamIndex = 0; // Loop to first column
            }
        }
    }

    const nextStudent = sortedStudents[nextStudentIndex];
    const nextExam = examColumns[nextExamIndex];

    if (nextStudent && nextExam) {
        const nextInputId = `grade-${nextStudent.id}-${nextExam.name}`;
        document.getElementById(nextInputId)?.focus();
    }
  };
  
  const handleConfirmCalculations = () => {
    const newAverages: Averages = {};
    const newObservations: Observations = {};

    sortedStudents.forEach(student => {
        const avgStr = calculateStudentAverage(student.id, localGrades);
        newAverages[student.id] = avgStr;
        if (avgStr !== '-' && avgStr !== 'N/A') {
            const avgNum = parseFloat(avgStr);
            newObservations[student.id] = getObservationForAverage(avgNum);
        } else {
            newObservations[student.id] = '';
        }
    });

    setAverages(newAverages);
    setObservations(newObservations);
    setIsCalculated(true);
    toast.success('Calculs confirmés !');
  };
  
  const handleSave = () => {
    setAllGrades(currentAllGrades => {
        const newAllGrades = [...currentAllGrades];

        sortedStudents.forEach(student => {
            const studentId = student.id;
            const studentGrades = localGrades[studentId];
            if (!studentGrades) return;

            let studentRecord = newAllGrades.find(g => g.studentId === studentId && g.term === 'Trimestre 1');
            if (!studentRecord) {
                studentRecord = { studentId, term: 'Trimestre 1', grades: [] };
                newAllGrades.push(studentRecord);
            }

            let subjectRecord = studentRecord.grades.find(sg => sg.subjectName === subjectName);
            if (!subjectRecord) {
                subjectRecord = { subjectName, notes: {}, coefficient: 0 }; // Placeholder coefficient
                studentRecord.grades.push(subjectRecord);
            }
            
            // Update notes
            const newNotes: { [examName: string]: number | null } = {};
            examColumns.forEach(exam => {
                const gradeStr = studentGrades[exam.name];
                if (gradeStr !== undefined && gradeStr !== '') {
                    newNotes[exam.name] = parseFloat(gradeStr.replace(',', '.'));
                } else {
                    newNotes[exam.name] = null;
                }
            });
            subjectRecord.notes = newNotes;
            subjectRecord.appreciation = observations[studentId] || '';
            const averageStr = averages[studentId];
            if (averageStr && averageStr !== '-' && averageStr !== 'N/A') {
                subjectRecord.average = parseFloat(averageStr);
            }
        });
        
        return newAllGrades;
    });

    toast.success('Notes enregistrées avec succès!');
    onClose();
  };
  
  const handlePrint = () => {
    if (!printRef.current) return;
    toast.loading('Génération du PDF...', { duration: 1000 });
    html2canvas(printRef.current, { scale: 2, useCORS: true })
        .then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;

            let imgWidth = pdfWidth - 20; // margin
            let imgHeight = imgWidth / ratio;
            
            if (imgHeight > pdfHeight - 20) {
                imgHeight = pdfHeight - 20;
                imgWidth = imgHeight * ratio;
            }

            const x = (pdfWidth - imgWidth) / 2;
            const y = (pdfHeight - imgHeight) / 2;

            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save(`Resultats-${classe.name.replace(/\s/g, '_')}-${subjectName.replace(/\s/g, '_')}.pdf`);
            toast.success('PDF généré avec succès!');
        }).catch(err => {
            console.error("Erreur PDF:", err);
            toast.error('Erreur lors de la génération du PDF.');
        });
  };

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Saisie des Notes`}
      size="4xl"
    >
        <div className="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 text-sm">
                <p><strong className="font-semibold text-gray-600">Classe:</strong> <span className="font-mono text-indigo-700 font-bold">{classe.name}</span></p>
                <p><strong className="font-semibold text-gray-600">Matière:</strong> <span className="font-mono text-indigo-700 font-bold">{subjectName}</span></p>
                <p><strong className="font-semibold text-gray-600">Enseignant:</strong> <span className="font-mono text-indigo-700 font-bold">{`${teacher.firstName} ${teacher.lastName}`}</span></p>
            </div>
        </div>
        
        <div className="mb-4 flex items-center justify-end space-x-4">
            <span className="text-sm font-medium text-gray-700">Navigation (Touche Entrée):</span>
            <div className="flex items-center space-x-3 text-sm">
                 <label className="flex items-center cursor-pointer">
                    <input type="radio" name="nav-direction" value="horizontal" checked={navigationDirection === 'horizontal'} onChange={() => setNavigationDirection('horizontal')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span className="ml-2 text-gray-700">Horizontal</span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <input type="radio" name="nav-direction" value="vertical" checked={navigationDirection === 'vertical'} onChange={() => setNavigationDirection('vertical')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span className="ml-2 text-gray-700">Vertical</span>
                </label>
            </div>
        </div>
      
      {assessmentRule ? (
        <div className="overflow-x-auto max-h-[60vh] border rounded-lg">
          <table className="w-full text-sm text-left table-fixed">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="py-2 px-3 font-semibold text-gray-700 w-12">N°</th>
                <th className="py-2 px-3 font-semibold text-gray-700 w-56">Nom de l'étudiant</th>
                {examColumns.map(exam => (
                  <th key={exam.name} className="py-2 px-3 font-semibold text-gray-700 text-center w-28">{exam.name}</th>
                ))}
                <th className="py-2 px-3 font-semibold text-gray-700 text-center w-28 bg-gray-300">Moyenne</th>
                <th className="py-2 px-3 font-semibold text-gray-700 w-64">Observation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStudents.map((student, studentIndex) => {
                const average = averages[student.id] || '-';
                return (
                    <tr key={student.id} className="hover:bg-gray-50">
                        <td className="py-1 px-3 text-center text-gray-500">{studentIndex + 1}</td>
                        <td className="py-1 px-3 font-medium text-gray-800 truncate capitalize">{`${student.lastName} ${student.firstName}`}</td>
                        {examColumns.map((exam, examIndex) => (
                        <td key={exam.name} className="py-1 px-2">
                            <input
                                id={`grade-${student.id}-${exam.name}`}
                                type="text"
                                value={localGrades[student.id]?.[exam.name] || ''}
                                onChange={(e) => handleGradeChange(student.id, exam.name, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, studentIndex, examIndex)}
                                className="w-full p-1.5 text-center border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-sm"
                                placeholder={`/20`}
                            />
                        </td>
                        ))}
                        <td className="py-1 px-3 text-center font-bold text-lg">
                             {average !== '-' && (
                                <span className={`px-2 py-1 rounded-md ${parseFloat(average) < 10 ? 'text-red-700 bg-red-100' : 'text-green-800 bg-green-100'}`}>
                                    {average}
                                </span>
                            )}
                            {average === '-' && <span>-</span>}
                        </td>
                        <td className="py-1 px-2">
                            <input
                                type="text"
                                value={observations[student.id] || ''}
                                readOnly
                                className="w-full p-1.5 border-0 rounded-md focus:ring-0 transition-shadow text-sm bg-transparent italic text-gray-700"
                                placeholder="..."
                            />
                        </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
          <div className="text-center py-10 rounded-lg border bg-yellow-50 text-yellow-800">
            <p className="font-semibold">Aucune règle d'évaluation trouvée pour cette matière.</p>
            <p className="text-sm">Veuillez configurer les règles de contrôle continu dans la section Scolarité.</p>
          </div>
      )}

      <div className="flex justify-end space-x-3 pt-6 mt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleConfirmCalculations}
          disabled={!assessmentRule}
          className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <CalculatorIcon className="mr-2 h-4 w-4" />
          Calculer
        </button>
        <button
            type="button"
            onClick={handlePrint}
            disabled={!isCalculated}
            className="flex items-center bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <PrintIcon className="mr-2 h-4 w-4" />
            Imprimer
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isCalculated}
          className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <SaveIcon className="mr-2 h-4 w-4" />
          Enregistrer
        </button>
      </div>
      
      <div aria-hidden="true">
        <div style={{ position: 'fixed', left: '-9999px', top: 0, background: 'white', padding: '20px', fontFamily: 'Arial, sans-serif', color: 'black' }} ref={printRef}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Fiche de Saisie des Notes</h1>
                <table style={{ width: '100%', margin: '10px 0', fontSize: '12px', border: 'none' }}>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'left', padding: '2px' }}><strong>Classe:</strong> {classe.name}</td>
                            <td style={{ textAlign: 'center', padding: '2px' }}><strong>Matière:</strong> {subjectName}</td>
                            <td style={{ textAlign: 'right', padding: '2px' }}><strong>Enseignant:</strong> {`${teacher.firstName} ${teacher.lastName}`}</td>
                        </tr>
                        <tr>
                             <td style={{ textAlign: 'left', padding: '2px' }}><strong>Année Scolaire:</strong> 2025/2026</td>
                            <td colSpan={2} style={{ textAlign: 'right', padding: '2px' }}><strong>Date d'impression:</strong> {new Date().toLocaleDateString('fr-FR')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e2e8f0', fontWeight: 'bold' }}>
                        <th style={{ border: '1px solid #999', padding: '4px', textAlign: 'center' }}>N°</th>
                        <th style={{ border: '1px solid #999', padding: '4px', textAlign: 'left' }}>Nom de l'étudiant</th>
                        {examColumns.map(exam => (
                            <th key={exam.name} style={{ border: '1px solid #999', padding: '4px', textAlign: 'center' }}>{exam.name}</th>
                        ))}
                        <th style={{ border: '1px solid #999', padding: '4px', textAlign: 'center' }}>Moyenne</th>
                        <th style={{ border: '1px solid #999', padding: '4px', textAlign: 'left' }}>Observation</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedStudents.map((student, index) => (
                        <tr key={student.id}>
                            <td style={{ border: '1px solid #999', padding: '4px', textAlign: 'center' }}>{index + 1}</td>
                            <td style={{ border: '1px solid #999', padding: '4px', textTransform: 'capitalize' }}>{`${student.lastName} ${student.firstName}`}</td>
                            {examColumns.map(exam => (
                                <td key={exam.name} style={{ border: '1px solid #999', padding: '4px', textAlign: 'center' }}>
                                    {localGrades[student.id]?.[exam.name] || '-'}
                                </td>
                            ))}
                            <td style={{ border: '1px solid #999', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                                {averages[student.id] || '-'}
                            </td>
                            <td style={{ border: '1px solid #999', padding: '4px' }}>
                                {observations[student.id] || ''}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </Modal>
    </>
  );
};