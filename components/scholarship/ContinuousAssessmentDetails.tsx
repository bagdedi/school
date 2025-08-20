import React from 'react';
import type { SubjectCoefficient } from '../../types';
import { findAssessmentRule, type AssessmentRule } from './continuousAssessmentData';
import { InfoIcon } from '../icons/InfoIcon';
import { CalculatorIcon } from '../icons/CalculatorIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';

const RuleDisplay: React.FC<{ rule: AssessmentRule }> = ({ rule }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
                <span>Épreuves</span>
            </h3>
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Type d'épreuve</th>
                            <th className="px-4 py-2 text-center font-semibold text-gray-600">Coefficient</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Fréquence</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Durée</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rule.exams.map((exam, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 font-medium text-gray-900">{exam.name}</td>
                                <td className="px-4 py-2 text-center font-bold text-indigo-600">{exam.coefficient}</td>
                                <td className="px-4 py-2 text-gray-600">{exam.frequency || '-'}</td>
                                <td className="px-4 py-2 text-gray-600">{exam.duration || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <CalculatorIcon className="h-5 w-5 mr-2 text-gray-500" />
                 <span className="ml-2">Calcul de la moyenne</span>
            </h3>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 p-4 rounded-r-lg">
                <p className="font-mono text-center text-lg">{rule.formula}</p>
                <p className="text-center text-sm mt-1">{rule.formulaDescription}</p>
            </div>
        </div>
        {rule.notes && rule.notes.length > 0 && (
            <div>
                 <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <InfoIcon className="h-5 w-5 mr-2" />
                    Remarques
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border">
                    {rule.notes.map((note, index) => <li key={index}>{note}</li>)}
                </ul>
            </div>
        )}
    </div>
);


interface ContinuousAssessmentDetailsProps {
    subject: SubjectCoefficient | null;
}

export const ContinuousAssessmentDetails: React.FC<ContinuousAssessmentDetailsProps> = ({ subject }) => {
    if (!subject) return null;
    
    const rule = findAssessmentRule(subject);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">{subject.subject}</h2>
                <p className="text-sm text-gray-500">{subject.level} - {subject.specialization}</p>
            </div>
            <hr className="my-4" />
            
            {rule ? (
                <RuleDisplay rule={rule} />
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <InfoIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <h3 className="font-semibold text-gray-700">Données non disponibles</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Les détails du contrôle continu pour cette matière n'ont pas encore été ajoutés.
                    </p>
                </div>
            )}
        </div>
    );
};