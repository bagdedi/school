import type { TuitionFee, Payment } from '../../types';
import { mockStudents } from '../timetable/mockData';

export const tuitionFees: TuitionFee[] = [
    {
        niveau: '1 annee',
        specialite: 'Tronc Commun',
        total: 5000,
        installments: [
            { name: 'Inscription', dueDate: '2025-09-15', amount: 1000 },
            { name: '1ère Tranche', dueDate: '2025-10-15', amount: 1500 },
            { name: '2ème Tranche', dueDate: '2026-01-15', amount: 1500 },
            { name: '3ème Tranche', dueDate: '2026-04-15', amount: 1000 },
        ],
    },
    {
        niveau: '2 annee',
        specialite: 'Lettres',
        total: 5200,
        installments: [
            { name: 'Inscription', dueDate: '2025-09-15', amount: 1200 },
            { name: '1ère Tranche', dueDate: '2025-10-15', amount: 1500 },
            { name: '2ème Tranche', dueDate: '2026-01-15', amount: 1500 },
            { name: '3ème Tranche', dueDate: '2026-04-15', amount: 1000 },
        ],
    },
    {
        niveau: '3 annee',
        specialite: 'Sciences de l\'Informatique',
        total: 6000,
        installments: [
            { name: 'Inscription', dueDate: '2025-09-15', amount: 1500 },
            { name: '1ère Tranche', dueDate: '2025-10-15', amount: 1500 },
            { name: '2ème Tranche', dueDate: '2026-01-15', amount: 1500 },
            { name: '3ème Tranche', dueDate: '2026-04-15', amount: 1500 },
        ],
    },
     {
        niveau: '4 annee',
        specialite: 'Sciences Techniques',
        total: 6500,
        installments: [
            { name: 'Inscription', dueDate: '2025-09-15', amount: 2000 },
            { name: '1ère Tranche', dueDate: '2025-10-15', amount: 1500 },
            { name: '2ème Tranche', dueDate: '2026-01-15', amount: 1500 },
            { name: '3ème Tranche', dueDate: '2026-04-15', amount: 1500 },
        ],
    },
];

// Generate mock payments for a subset of students
export const mockPayments: Payment[] = [];
let paymentIdCounter = 1;

mockStudents.slice(0, 150).forEach(student => {
    const feeInfo = tuitionFees.find(f => f.niveau === student.academicLevel && f.specialite === student.academicSpecialty);
    if (!feeInfo) return;

    const paymentStatus = Math.random();

    if (paymentStatus > 0.95) { // Unpaid
        return;
    }

    if (paymentStatus < 0.6) { // Fully paid
        feeInfo.installments.forEach(installment => {
            mockPayments.push({
                id: `P${paymentIdCounter++}`,
                studentId: student.id,
                amount: installment.amount,
                date: new Date(new Date(installment.dueDate).getTime() - (10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                tranche: installment.name,
            });
        });
    } else { // Partially paid
        const numPayments = Math.floor(Math.random() * (feeInfo.installments.length -1)) + 1;
        for (let i = 0; i < numPayments; i++) {
            const installment = feeInfo.installments[i];
            mockPayments.push({
                id: `P${paymentIdCounter++}`,
                studentId: student.id,
                amount: installment.amount,
                date: new Date(new Date(installment.dueDate).getTime() - (10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                tranche: installment.name,
            });
        }
        // Maybe a partial last payment
        if (Math.random() > 0.5 && numPayments < feeInfo.installments.length) {
            const nextInstallment = feeInfo.installments[numPayments];
            mockPayments.push({
                id: `P${paymentIdCounter++}`,
                studentId: student.id,
                amount: nextInstallment.amount * Math.random(),
                date: new Date().toISOString().split('T')[0],
                tranche: nextInstallment.name,
            });
        }
    }
});