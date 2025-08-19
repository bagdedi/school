import React, { useMemo } from 'react';
import type { Student } from '../../types';
import { CheckIcon } from '../icons/CheckIcon';

interface ClassDetailsTableProps {
  classNameToShow: string;
  students: Student[];
  optionalSubjects: string[];
  optionColors: Record<string, string>;
}

export const ClassDetailsTable: React.FC<ClassDetailsTableProps> = ({
  classNameToShow,
  students,
  optionalSubjects,
  optionColors,
}) => {
  const classStudents = useMemo(() => {
    return students
      .filter(s => s.classe === classNameToShow)
      .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
  }, [students, classNameToShow]);

  const optionTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    // Initialize all subjects with 0
    optionalSubjects.forEach(subject => {
        totals[subject] = 0;
    });
    // Count students for each option
    classStudents.forEach(student => {
        if (student.option && totals.hasOwnProperty(student.option)) {
            totals[student.option]++;
        }
    });
    return totals;
  }, [classStudents, optionalSubjects]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-12">N°</th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Nom Complet</th>
            {optionalSubjects.map(subject => (
              <th
                key={subject}
                className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700"
                style={{ backgroundColor: (optionColors[subject.toLowerCase()] || '#E5E7EB') + '4D' }} // 4D for ~30% opacity
              >
                {subject}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classStudents.map((student, index) => (
            <tr
              key={student.id}
              className={`hover:bg-gray-100 ${
                student.gender === 'Male' ? 'bg-blue-50/50' : 'bg-pink-50/50'
              }`}
            >
              <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{`${student.lastName} ${student.firstName}`}</td>
              {optionalSubjects.map(subject => (
                <td key={subject} className="border border-gray-300 px-3 py-2 text-center">
                  {student.option === subject && (
                    <CheckIcon className="h-4 w-4 mx-auto text-green-600" />
                  )}
                </td>
              ))}
            </tr>
          ))}
          {classStudents.length === 0 && (
            <tr>
                <td colSpan={optionalSubjects.length + 2} className="text-center py-4 text-gray-500 italic border border-gray-300">
                    Aucun étudiant dans cette classe pour les filtres actuels.
                </td>
            </tr>
          )}
        </tbody>
        {classStudents.length > 0 && (
            <tfoot>
                <tr className="bg-gray-200 font-bold text-gray-800">
                    <td colSpan={2} className="border border-gray-400 px-3 py-2 text-right">Nombre Total</td>
                    {optionalSubjects.map(subject => (
                        <td key={subject} className="border border-gray-400 px-3 py-2 text-center">
                            {optionTotals[subject]}
                        </td>
                    ))}
                </tr>
            </tfoot>
        )}
      </table>
    </div>
  );
};
