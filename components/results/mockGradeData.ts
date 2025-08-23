import type { StudentGrades, SubjectGrade, Term } from '../../types';
import { mockStudents } from '../timetable/mockData';
import { mockSubjectCoefficients } from '../scholarship/mockSubjectData';
import { findAssessmentRule } from '../scholarship/continuousAssessmentData';

const terms: Term[] = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

const generateMockGrades = (): StudentGrades[] => {
    const allStudentGrades: StudentGrades[] = [];

    mockStudents.forEach(student => {
        // Assign a random performance factor to each student for grade consistency
        const studentPerformanceFactor = 0.65 + Math.random() * 0.45; // between 0.65 (D) and 1.1 (A+)
        
        terms.forEach(term => {
            const subjectsForStudent = mockSubjectCoefficients.filter(sc => 
                sc.level === student.academicLevel && sc.specialization === student.academicSpecialty
            );

            const gradesForTerm: SubjectGrade[] = [];
            
            // Add a slight variation per term
            const termPerformanceFactor = studentPerformanceFactor + (Math.random() - 0.5) * 0.1;

            subjectsForStudent.forEach(subjectInfo => {
                const rule = findAssessmentRule(subjectInfo);
                if (!rule) return;

                const notes: { [examName: string]: number | null } = {};
                rule.exams.forEach(exam => {
                    // 5% chance of missing an exam
                    if (Math.random() < 0.05) {
                        notes[exam.name] = null;
                    } else {
                        const baseGrade = 4 + Math.random() * 16; // Base grade between 4 and 20
                        // Apply performance factor and add some random variance
                        const finalGrade = Math.min(20, Math.max(0, baseGrade * termPerformanceFactor + (Math.random() - 0.5) * 3));
                        notes[exam.name] = parseFloat(finalGrade.toFixed(2));
                    }
                });

                gradesForTerm.push({
                    subjectName: subjectInfo.subject,
                    coefficient: parseFloat(subjectInfo.coefficient), // This will be recalculated in the bulletin component
                    notes: notes,
                });
            });

            if (gradesForTerm.length > 0) {
                allStudentGrades.push({
                    studentId: student.id,
                    term: term,
                    grades: gradesForTerm,
                });
            }
        });
    });

    return allStudentGrades;
};

export const mockGradeData: StudentGrades[] = generateMockGrades();