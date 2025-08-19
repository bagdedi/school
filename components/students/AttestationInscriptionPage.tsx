import React, { useState, useEffect } from 'react';
import type { Student } from '../../types';
import { AmilcarUniversityLogo } from '../icons/AmilcarUniversityLogo';
import { PrintIcon } from '../icons/PrintIcon';

const AttestationInscriptionPage: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const studentData = params.get('student');
    if (studentData) {
      setStudent(JSON.parse(decodeURIComponent(studentData)));
    }
  }, []);

  if (!student) {
    return <div className="p-8 text-center text-gray-600">Loading student data...</div>;
  }
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 print:bg-white print:p-0">
      <button 
          onClick={() => window.print()}
          className="no-print fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Print Attestation"
      >
          <PrintIcon className="h-6 w-6" />
      </button>

      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-lg p-16 font-serif text-gray-800 relative print:shadow-none print:max-w-none print:rounded-none print:h-screen print:flex print:flex-col print:p-12">
        <div className="flex-grow">
          {/* Header */}
          <header className="text-center mb-12">
            <AmilcarUniversityLogo className="h-20 w-20 mx-auto mb-4" />
            <h1 className="text-lg font-bold tracking-wider">École Supérieure Privée Amilcar des Technologies Avancées et de Management</h1>
          </header>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold underline underline-offset-4 decoration-2">ATTESTATION D'INSCRIPTION</h2>
            <p className="mt-4 text-sm">Année Universitaire: {student.schoolYear}</p>
          </div>

          {/* Body */}
          <div className="text-sm leading-relaxed space-y-6">
              <p>
                  Je soussigné(e), Dr. Helmi Ahmed EL KAMEL, certifie que :
              </p>
              <div className="ml-8 space-y-2 font-sans">
                  <p><span className="font-semibold w-32 inline-block">Nom et Prénom :</span> <span className="capitalize">{student.firstName} {student.lastName}</span></p>
                  <p><span className="font-semibold w-32 inline-block">Date de Naissance :</span> {formatDate(student.dateOfBirth)}</p>
                  <p><span className="font-semibold w-32 inline-block">Titulaire :</span> CIN: {student.idNumber}</p>
                  <p><span className="font-semibold w-32 inline-block">Diplôme :</span> {student.academicDiploma}</p>
                  <p><span className="font-semibold w-32 inline-block">Spécialité :</span> {student.academicSpecialty}</p>
                  <p><span className="font-semibold w-32 inline-block">Niveau :</span> {student.academicLevel}</p>
                  <p><span className="font-semibold w-32 inline-block">Matricule :</span> {student.matricule}</p>
              </div>
              <p>
                  est régulièrement inscrit(e) à l'École Supérieure Privée Amilcar des Technologies Avancées et de Management pour l'année universitaire {student.schoolYear}.
              </p>
          </div>

          {/* Signature */}
          <div className="mt-16 text-right text-sm">
              <p>Fait à Tunis, le {new Date().toLocaleDateString('fr-FR')}</p>
              <p className="mt-4">Le Directeur</p>
              <p className="mt-1">Dr. Helmi Ahmed EL KAMEL</p>
          </div>
        </div>


        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 bg-blue-800 text-white text-xs text-center p-3 rounded-b-lg print:static print:bg-blue-800 print:text-white print:rounded-none print:-mx-12 print:-mb-12 print:p-3">
            <p>21698144100 contact@amilcaruniversity.com www.amilcaruniversity.com</p>
            <p>1 Rue Jamel Eddine Al Afghani, 1002 Tunis Belvédère</p>
            <p>MF: 1868591PAM000 | RC: C01144132024</p>
        </footer>
      </div>
    </div>
  );
};

export default AttestationInscriptionPage;