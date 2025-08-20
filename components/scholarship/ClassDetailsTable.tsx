import React, { useMemo } from 'react';
import type { Student } from '../../types';

interface ClassDetailsTableProps {
  classNameToShow: string;
  students: Student[];
}

// Color mapping for option badges for better visual distinction
const optionStyles: { [key: string]: string } = {
  'Musique': 'bg-orange-100 text-orange-800 border border-orange-200',
  'Dessin': 'bg-purple-100 text-purple-800 border border-purple-200',
  'allemand': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  'espagnole': 'bg-red-100 text-red-800 border border-red-200',
};

const getOptionBadgeClass = (option: string) => {
    return optionStyles[option] || 'bg-gray-100 text-gray-800 border border-gray-200';
};


export const ClassDetailsTable: React.FC<ClassDetailsTableProps> = ({
  classNameToShow,
  students,
}) => {
  const classStudents = useMemo(() => {
    return students
      .filter(s => s.classe === classNameToShow)
      .sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
  }, [students, classNameToShow]);

  const totalsByOption = useMemo(() => {
    const counts: { [key: string]: number } = {};

    classStudents.forEach(student => {
        if (student.option) {
            counts[student.option] = (counts[student.option] || 0) + 1;
        }
    });

    const sortedOptions = Object.entries(counts)
      .map(([option, count]) => ({ option, count }))
      .sort((a, b) => a.option.localeCompare(b.option));

    return {
        total: classStudents.length,
        options: sortedOptions,
    };
  }, [classStudents]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-12">N°</th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Nom Complet</th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-32">Option</th>
          </tr>
        </thead>
        <tbody>
          {classStudents.map((student, index) => (
            <tr
              key={student.id}
              className={`transition-colors hover:bg-gray-200 ${student.gender === 'Male' ? 'bg-blue-50' : 'bg-pink-50'}`}
            >
              <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{`${student.lastName} ${student.firstName}`}</td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                {student.option ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getOptionBadgeClass(student.option)}`}>
                        {student.option}
                    </span>
                ) : (
                    <span className="text-gray-400">-</span>
                )}
              </td>
            </tr>
          ))}
          {classStudents.length === 0 && (
            <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500 italic border border-gray-300">
                    Aucun étudiant dans cette classe pour les filtres actuels.
                </td>
            </tr>
          )}
        </tbody>
        <tfoot className="bg-gray-200 font-bold text-gray-800">
            {totalsByOption.options.map(({ option, count }) => (
                <tr key={option}>
                    <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right">Total {option}:</td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-mono">{count}</td>
                </tr>
            ))}
            <tr className="border-t-2 border-gray-400">
                <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right">Total Étudiants:</td>
                <td className="border border-gray-300 px-3 py-2 text-center font-mono">{totalsByOption.total}</td>
            </tr>
        </tfoot>
      </table>
    </div>
  );
};