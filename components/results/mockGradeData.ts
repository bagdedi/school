import type { StudentGrades } from '../../types';

export const mockGradeData: StudentGrades[] = [
    {
        studentId: 'S0001', // Assuming there's a student with this ID. Adjust if needed.
        term: 'Trimestre 1',
        grades: [
            {
                subjectName: 'العربية',
                coefficient: 2,
                notes: {},
                average: 16.78,
                appreciation: 'جيد جدا',
                subGrades: [
                    {
                        subjectName: 'إنشاء',
                        coefficient: 1, // Sub-coefficients for calculation
                        notes: {
                            'Devoir de Contrôle': 20.00,
                            'Devoir de Synthèse': 17.00,
                        },
                        average: 18.00,
                        appreciation: 'Excellent'
                    },
                    {
                        subjectName: 'دراسة نص',
                        coefficient: 1,
                        notes: {
                            'Devoir de Contrôle': 15.00,
                            'Devoir de Synthèse': 14.00,
                        },
                        average: 14.33,
                        appreciation: 'Assez bien'
                    }
                ]
            },
            {
                subjectName: 'الفرنسية',
                coefficient: 4,
                notes: {},
                average: 16.01,
                appreciation: 'Moyen'
            },
            {
                subjectName: 'الأنقليزية',
                coefficient: 1.5,
                notes: {},
                average: 10.67,
                appreciation: 'Assez bien'
            },
            {
                subjectName: 'التاريخ',
                coefficient: 1,
                notes: {},
                average: 14.00,
                appreciation: 'Bien'
            },
            {
                subjectName: 'الجغرافيا',
                coefficient: 1,
                notes: {},
                average: 12.00,
                appreciation: 'Bien'
            },
            {
                subjectName: 'التربية الاسلامية',
                coefficient: 1,
                notes: {},
                average: 14.50,
                appreciation: 'Bien'
            },
            {
                subjectName: 'الرياضيات',
                coefficient: 3,
                notes: {},
                average: 15.17,
                appreciation: 'Assez bien'
            },
            {
                subjectName: 'الاعلامية',
                coefficient: 1,
                notes: {},
                average: 13.75,
                appreciation: 'Bien'
            },
            {
                subjectName: 'الموسيقى',
                coefficient: 1,
                notes: {},
                average: 12.33,
                appreciation: 'Assez bien'
            },
            {
                subjectName: 'التربية التشكيلية',
                coefficient: 1,
                notes: {},
                average: 13.88,
                appreciation: 'Moyen'
            },
            {
                subjectName: 'التربية البدنية',
                coefficient: 1,
                notes: {},
                average: 10.67,
                appreciation: 'Assez bien'
            },
            {
                subjectName: 'التربية التقنية',
                coefficient: 1,
                notes: {},
                average: 13.00,
                appreciation: 'Bien'
            },
        ]
    }
];
