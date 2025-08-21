import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import type { Student, Payment, TuitionFee, Installment } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { Toaster, toast } from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  tuitionFees: TuitionFee[];
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, student, payments, setPayments, tuitionFees }) => {
  const [newPaymentAmount, setNewPaymentAmount] = useState('');
  const [selectedTranche, setSelectedTranche] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const studentFeeInfo = useMemo(() => {
    return tuitionFees.find(f => f.niveau === student.academicLevel && f.specialite === student.academicSpecialty);
  }, [student, tuitionFees]);

  const studentPayments = useMemo(() => {
    return payments.filter(p => p.studentId === student.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [payments, student]);
  
  const totalPaid = useMemo(() => {
    return studentPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [studentPayments]);
  
  const totalDue = studentFeeInfo?.total || 0;
  const balance = totalDue - totalPaid;

  const installmentStatus = useMemo(() => {
    if (!studentFeeInfo) return [];

    let paidTowards: { [key: string]: number } = {};
    studentPayments.forEach(p => {
        paidTowards[p.tranche] = (paidTowards[p.tranche] || 0) + p.amount;
    });

    return studentFeeInfo.installments.map(installment => {
        const paid = paidTowards[installment.name] || 0;
        return {
            ...installment,
            paid,
            isPaid: paid >= installment.amount,
        };
    });

  }, [studentFeeInfo, studentPayments]);
  
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newPaymentAmount);
    if (isNaN(amount) || amount <= 0 || !selectedTranche) {
      toast.error("Veuillez entrer un montant valide et sélectionner une tranche.");
      return;
    }
    
    const newPayment: Payment = {
        id: `P${Date.now()}`,
        studentId: student.id,
        amount,
        date: paymentDate,
        tranche: selectedTranche,
    };
    
    setPayments(prev => [...prev, newPayment]);
    toast.success("Paiement ajouté avec succès !");

    // Reset form
    setNewPaymentAmount('');
    setSelectedTranche('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
  };


  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Modal isOpen={isOpen} onClose={onClose} title={`Gestion des Paiements - ${student.firstName} ${student.lastName}`} size="4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* Left Column: Summary and Installments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-800 mb-4">Résumé Financier</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Total à Payer</p>
                <p className="text-xl font-bold text-gray-800">{totalDue.toFixed(2)} TND</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant Payé</p>
                <p className="text-xl font-bold text-green-600">{totalPaid.toFixed(2)} TND</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Solde Restant</p>
                <p className="text-xl font-bold text-red-600">{balance.toFixed(2)} TND</p>
              </div>
            </div>
          </div>
          {/* Installments */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Échéancier</h3>
            <div className="space-y-3">
              {installmentStatus.map(inst => (
                <div key={inst.name} className={`p-3 rounded-lg flex items-center justify-between ${inst.isPaid ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} border`}>
                  <div className="flex items-center">
                    {inst.isPaid ? 
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-3 flex-shrink-0"><CheckIcon className="w-4 h-4" /></div> : 
                      <div className="w-6 h-6 rounded-full bg-gray-300 mr-3 flex-shrink-0"></div>
                    }
                    <div>
                      <p className="font-semibold">{inst.name}</p>
                      <p className="text-xs text-gray-500">Échéance: {inst.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{inst.amount.toFixed(2)} TND</p>
                    {inst.paid > 0 && <p className={`text-xs ${inst.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>Payé: {inst.paid.toFixed(2)} TND</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Payment History */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Historique des paiements</h3>
             <div className="overflow-auto max-h-60 border rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-3 py-2 text-left font-semibold text-gray-600">Date</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-600">Tranche</th>
                            <th className="px-3 py-2 text-right font-semibold text-gray-600">Montant</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {studentPayments.map(p => (
                            <tr key={p.id}>
                                <td className="px-3 py-2">{p.date}</td>
                                <td className="px-3 py-2">{p.tranche}</td>
                                <td className="px-3 py-2 text-right font-medium">{p.amount.toFixed(2)} TND</td>
                            </tr>
                        ))}
                        {studentPayments.length === 0 && (
                            <tr><td colSpan={3} className="text-center py-4 text-gray-500">Aucun paiement enregistré.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
        {/* Right Column: Add Payment */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 sticky top-4">
            <h3 className="font-semibold text-gray-800 mb-4">Ajouter un paiement</h3>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Montant</label>
                <input
                  type="number"
                  id="amount"
                  value={newPaymentAmount}
                  onChange={(e) => setNewPaymentAmount(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="tranche" className="block text-sm font-medium text-gray-700">Tranche</label>
                <select id="tranche" value={selectedTranche} onChange={(e) => setSelectedTranche(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Sélectionnez...</option>
                  {studentFeeInfo?.installments.map(inst => (
                    <option key={inst.name} value={inst.name}>{inst.name}</option>
                  ))}
                </select>
              </div>
               <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">Date du paiement</label>
                <input
                  type="date"
                  id="paymentDate"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                <PlusIcon />
                <span className="ml-2">Enregistrer le paiement</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
    </>
  );
};