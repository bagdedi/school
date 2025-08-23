import React, { useMemo } from 'react';
import type { Student, StudentGrades, SubjectGrade, SubjectCoefficient, Term } from '../../types';
import { TunisiaMinistryLogo } from '../icons/TunisiaMinistryLogo';
import { findAssessmentRule } from '../scholarship/continuousAssessmentData';

interface BulletinProps {
    student: Student;
    studentGrades: StudentGrades | undefined;
    allClassGrades: StudentGrades[];
    schoolName: string;
    directorName: string;
    subjectCoefficients: SubjectCoefficient[];
    classStudentCount: number;
    term: Term;
}

const formatNumber = (num?: number | null, precision = 2) => {
    if (num === null || typeof num === 'undefined' || isNaN(num)) return '--';
    return num.toFixed(precision).replace('.', ',');
};

const calculateAveragesAndRanks = (allGrades: StudentGrades[], subjectCoefficients: SubjectCoefficient[], students: Student[]) => {
    const studentAverages = new Map<string, { generalAverage: number, subjectAverages: Map<string, number> }>();
    
    allGrades.forEach(studentData => {
        const studentInfo = students.find(s => s.id === studentData.studentId);
        if (!studentInfo) return;

        let totalPoints = 0;
        let totalCoeffs = 0;
        const subjectAverages = new Map<string, number>();

        studentData.grades.forEach(subject => {
            const rule = findAssessmentRule({
                subject: subject.subjectName,
                level: studentInfo.academicLevel,
                specialization: studentInfo.academicSpecialty
            } as any);

            const subjectCoeffInfo = subjectCoefficients.find(sc =>
                sc.subject === subject.subjectName &&
                sc.level === studentInfo.academicLevel &&
                sc.specialization === studentInfo.academicSpecialty
            );
            const mainCoefficient = subjectCoeffInfo ? parseFloat(subjectCoeffInfo.coefficient) : 0;

            if (rule && mainCoefficient > 0) {
                let numerator = 0;
                let denominator = 0;
                for (const exam of rule.exams) {
                    const grade = subject.notes[exam.name];
                    const examCoeff = parseFloat(String(exam.coefficient).replace(',', '.'));
                    if (grade !== null && grade !== undefined && !isNaN(grade) && !isNaN(examCoeff)) {
                        numerator += grade * examCoeff;
                        denominator += examCoeff;
                    }
                }
                if (denominator > 0) {
                    const subjectAverage = numerator / denominator;
                    totalPoints += subjectAverage * mainCoefficient;
                    totalCoeffs += mainCoefficient;
                    subjectAverages.set(subject.subjectName, subjectAverage);
                }
            }
        });
        
        if (totalCoeffs > 0) {
            const generalAverage = totalPoints / totalCoeffs;
            studentAverages.set(studentData.studentId, { generalAverage, subjectAverages });
        }
    });
    
    const sortedStudents = Array.from(studentAverages.entries()).sort((a, b) => b[1].generalAverage - a[1].generalAverage);
    const generalRanks = new Map<string, number>();
    sortedStudents.forEach(([studentId,], index) => generalRanks.set(studentId, index + 1));
    
    return { generalRanks, studentAverages };
};

export const Bulletin: React.FC<BulletinProps> = ({ student, studentGrades, allClassGrades, schoolName, directorName, subjectCoefficients, classStudentCount, term }) => {
    
    // The student list for rank calculation should be derived from allClassGrades to match
    const studentListForRanks = useMemo(() => {
        const studentIds = new Set(allClassGrades.map(g => g.studentId));
        return Array.from(studentIds).map(id => ({ id } as Student)); // Simplified student object is enough
    }, [allClassGrades]);
    
    const { generalRanks } = useMemo(() => calculateAveragesAndRanks(allClassGrades, subjectCoefficients, studentListForRanks), [allClassGrades, subjectCoefficients, studentListForRanks]);
    
    const processedData = useMemo(() => {
        if (!studentGrades) return { processedGrades: [], totalPoints: 0, totalCoefficients: 0 };

        const calculateSubjectAverage = (subject: SubjectGrade) => {
            const rule = findAssessmentRule({
                subject: subject.subjectName,
                level: student.academicLevel,
                specialization: student.academicSpecialty,
            } as any);

            if (!rule) return subject.average;
            
            let numerator = 0;
            let denominator = 0;
            for (const exam of rule.exams) {
                const grade = subject.notes[exam.name];
                const examCoeff = parseFloat(String(exam.coefficient).replace(',', '.'));
                if (grade !== null && grade !== undefined && !isNaN(grade) && !isNaN(examCoeff)) {
                    numerator += grade * examCoeff;
                    denominator += examCoeff;
                }
            }
            return denominator > 0 ? (numerator / denominator) : undefined;
        };
        
        let totalPoints = 0;
        let totalCoefficients = 0;

        const processedGrades: SubjectGrade[] = studentGrades.grades.map(subject => {
            const subjectCoeffInfo = subjectCoefficients.find(sc =>
                sc.subject === subject.subjectName &&
                sc.level === student.academicLevel &&
                sc.specialization === student.academicSpecialty
            );
            const coefficient = subjectCoeffInfo ? parseFloat(subjectCoeffInfo.coefficient) : 0;
            const newAverage = calculateSubjectAverage(subject);
            const newTotal = (newAverage !== undefined && !isNaN(newAverage)) ? newAverage * coefficient : undefined;

            if (newTotal !== undefined && !isNaN(newTotal)) {
                totalPoints += newTotal;
                totalCoefficients += coefficient;
            }

            return {
                ...subject,
                average: newAverage,
                coefficient,
                total: newTotal,
            };
        });

        return { processedGrades, totalPoints, totalCoefficients };
    }, [student, studentGrades, subjectCoefficients]);
    
    const { processedGrades, totalPoints, totalCoefficients } = processedData;

    const generalAverage = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
    const generalRank = generalRanks.get(student.id);
    
    const getAppreciation = (avg: number) => {
        if (isNaN(avg)) return '';
        if (avg >= 18) return 'ممتاز';
        if (avg >= 16) return 'جيد جدا';
        if (avg >= 14) return 'جيد';
        if (avg >= 12) return 'حسن';
        if (avg >= 10) return 'مقبول';
        return 'ضعيف';
    };

    const getTermInArabic = (term: Term) => {
        switch (term) {
            case 'Trimestre 1': return 'الثلاثي الأول';
            case 'Trimestre 2': return 'الثلاثي الثاني';
            case 'Trimestre 3': return 'الثلاثي الثالث';
            default: return '';
        }
    };


    if (!studentGrades) {
        return <div className="p-8 text-center text-gray-500">Aucune donnée de notes disponible pour cet étudiant pour le {term}.</div>;
    }

    return (
        <div id="bulletin-to-print" style={{ fontFamily: 'Amiri, serif', direction: 'rtl', width: '210mm', minHeight: '297mm', margin: 'auto', backgroundColor: 'white', padding: '10mm', color: 'black' }}>
            <header className="flex justify-between items-start mb-4">
                <div className="text-center text-sm">
                    <p>الجمهورية التونسية</p>
                    <p>وزارة التربية</p>
                    <p>المندوبية الجهوية للتربية {student.placeOfBirth}</p>
                    <p className="font-bold">{schoolName}</p>
                </div>
                <div className="flex flex-col items-center">
                    <TunisiaMinistryLogo className="w-20 h-24"/>
                    <h1 className="text-xl font-bold mt-2">بطاقة النتائج المدرسية</h1>
                    <p className="text-sm">{getTermInArabic(term)} - السنة الدراسية: 2025-2026</p>
                </div>
                <div className="text-right text-xs space-y-1">
                    <p>الاسم واللقب: <span className="font-bold">{student.lastName} {student.firstName}</span></p>
                    <p>تاريخ ومكان الميلاد: {student.dateOfBirth} بـ {student.placeOfBirth}</p>
                    <p>القسم: {student.classe}</p>
                    <p>عدد التلاميذ: {classStudentCount}</p>
                    <p>العدد الرتبي: {generalRank || '--'}</p>
                    <p>رقم التسجيل: {student.matricule}</p>
                </div>
            </header>

            <main>
                <table className="w-full border-collapse border border-black text-xs">
                    <thead className="bg-gray-200">
                        <tr className="font-bold">
                            <td rowSpan={2} className="border border-black p-1 text-center w-[15%]">المواد</td>
                            <td colSpan={2} className="border border-black p-1 text-center">فروض مراقبة</td>
                            <td rowSpan={2} className="border border-black p-1 text-center">فرض تأليفي x2</td>
                            <td rowSpan={2} className="border border-black p-1 text-center">معدل الثلاثي</td>
                            <td rowSpan={2} className="border border-black p-1 text-center">ضارب</td>
                            <td rowSpan={2} className="border border-black p-1 text-center">الحاصل</td>
                            <td rowSpan={2} className="border border-black p-1 text-center">ملاحظات الأستاذ(ة)</td>
                        </tr>
                        <tr className="font-bold">
                            <td className="border border-black p-1 text-center">ف.م.1</td>
                            <td className="border border-black p-1 text-center">ف.م.2</td>
                        </tr>
                    </thead>
                    <tbody>
                        {processedGrades.map((subject, index) => (
                            <React.Fragment key={index}>
                                <tr className={subject.subGrades ? 'bg-gray-100 font-bold' : ''}>
                                    <td className="border border-black p-1">{subject.subjectName}</td>
                                    <td className="border border-black p-1 text-center">{formatNumber(subject.notes['Devoir de Contrôle'] || subject.notes['Devoir de Contrôle 1'])}</td>
                                    <td className="border border-black p-1 text-center">{formatNumber(subject.notes['Devoir de Contrôle 2'])}</td>
                                    <td className="border border-black p-1 text-center">{formatNumber(subject.notes['Devoir de Synthèse'])}</td>
                                    <td className="border border-black p-1 text-center font-bold">{formatNumber(subject.average)}</td>
                                    <td className="border border-black p-1 text-center">{formatNumber(subject.coefficient, 1)}</td>
                                    <td className="border border-black p-1 text-center">{formatNumber(subject.total)}</td>
                                    <td className="border border-black p-1">{subject.appreciation}</td>
                                </tr>
                                {subject.subGrades?.map((sub, subIndex) => (
                                    <tr key={subIndex} className="text-gray-700">
                                        <td className="border border-black p-1 pr-4">{sub.subjectName}</td>
                                        <td className="border border-black p-1 text-center">{formatNumber(sub.notes['Devoir de Contrôle'])}</td>
                                        <td className="border border-black p-1 text-center">{formatNumber(sub.notes['Devoir de Contrôle 2'])}</td>
                                        <td className="border border-black p-1 text-center">{formatNumber(sub.notes['Devoir de Synthèse'])}</td>
                                        <td className="border border-black p-1 text-center font-bold">{formatNumber(sub.average)}</td>
                                        <td className="border border-black p-1 text-center">{formatNumber(sub.coefficient, 1)}</td>
                                        <td className="border border-black p-1 text-center">{formatNumber(sub.total)}</td>
                                        <td className="border border-black p-1">{sub.appreciation}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold bg-gray-200">
                            <td colSpan={5} className="border border-black p-2 text-left">المجموع</td>
                            <td className="border border-black p-2 text-center">{formatNumber(totalCoefficients, 0)}</td>
                            <td className="border border-black p-2 text-center">{formatNumber(totalPoints)}</td>
                            <td className="border border-black p-2"></td>
                        </tr>
                    </tfoot>
                </table>

                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                    <div className="border border-black">
                        <div className="p-1 font-bold text-center bg-gray-200">النتائج</div>
                        <div className="grid grid-cols-3">
                            <div className="p-1 border-l border-black text-center">الفترة</div>
                            <div className="p-1 border-l border-black text-center">المعدل</div>
                            <div className="p-1 text-center">الرتبة</div>
                        </div>
                        <div className="grid grid-cols-3 border-t border-black">
                            <div className="p-1 border-l border-black text-center">{getTermInArabic(term)}</div>
                            <div className="p-1 border-l border-black text-center font-bold">{formatNumber(generalAverage)}</div>
                            <div className="p-1 text-center font-bold">{generalRank || '--'}</div>
                        </div>
                    </div>
                     <div className="border border-black">
                        <div className="p-1 font-bold text-center bg-gray-200">العقوبات</div>
                        <div className="grid grid-cols-4">
                            <div className="p-1 border-l border-black text-center">إنذار</div>
                            <div className="p-1 border-l border-black text-center">طرد</div>
                            <div className="p-1 border-l border-black text-center">مجلس</div>
                            <div className="p-1 text-center">العقوبات</div>
                        </div>
                         <div className="grid grid-cols-4 border-t border-black">
                            <div className="p-1 border-l border-black text-center h-6"></div>
                            <div className="p-1 border-l border-black text-center h-6"></div>
                            <div className="p-1 border-l border-black text-center h-6"></div>
                            <div className="p-1 text-center h-6"></div>
                        </div>
                    </div>
                    <div className="border border-black">
                        <div className="p-1 font-bold text-center bg-gray-200">المواظبة</div>
                        <div className="grid grid-cols-3">
                            <div className="p-1 border-l border-black text-center">تأخير</div>
                            <div className="p-1 border-l border-black text-center">غياب</div>
                            <div className="p-1 text-center">مجلس</div>
                        </div>
                         <div className="grid grid-cols-3 border-t border-black">
                            <div className="p-1 border-l border-black text-center h-6"></div>
                            <div className="p-1 border-l border-black text-center h-6"></div>
                            <div className="p-1 text-center h-6"></div>
                        </div>
                    </div>
                </div>
                 <div className="border border-black mt-2 text-xs">
                    <div className="p-1 font-bold text-center bg-gray-200">قرار مجلس القسم وملاحظات المدير</div>
                    <div className="p-2 h-12">
                        {getAppreciation(generalAverage)}
                    </div>
                </div>
                 <div className="flex justify-between mt-4 text-xs">
                     <p>المدير(ة)</p>
                     <p className="font-bold">{directorName}</p>
                 </div>
            </main>
        </div>
    );
};