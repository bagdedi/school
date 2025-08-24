import React, { useState, useEffect, useRef } from 'react';
import type { Student } from '../../types';
import { AmilcarUniversityLogo } from '../icons/AmilcarUniversityLogo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AttestationPresencePage: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [status, setStatus] = useState<'loading' | 'generating' | 'done' | 'error'>('loading');
  const attestationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const studentData = params.get('student');
    if (studentData) {
      try {
        setStudent(JSON.parse(decodeURIComponent(studentData)));
      } catch (e) {
        console.error("Failed to parse student data:", e);
        setStatus('error');
      }
    } else {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (student && attestationRef.current) {
      setStatus('generating');
      const element = attestationRef.current;
      const timer = setTimeout(() => {
        html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          
          const blob = pdf.output('blob');
          window.location.href = URL.createObjectURL(blob);
          setStatus('done');
        }).catch(err => {
          console.error("Error generating PDF:", err);
          setStatus('error');
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [student]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }
  
  if (status !== 'generating' && status !== 'loading' && !student) {
    return <div className="p-8 text-center text-red-600 font-semibold">Erreur: Impossible de charger les données de l'étudiant.</div>;
  }
  
  return (
    <>
      <div className="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center text-center z-50">
        {status === 'done' ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">Attestation Générée</h2>
            <p className="mt-2 text-gray-600">Votre document a été généré avec succès.</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">Génération de l'attestation en cours...</h2>
            <p className="mt-2 text-gray-600">Veuillez patienter pendant la préparation de votre document.</p>
          </>
        )}
      </div>
      
      {/* Hidden renderable certificate for html2canvas */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, background: 'white' }}>
        {student && (
           <div ref={attestationRef} className="font-serif text-gray-800 relative flex flex-col" style={{ width: '210mm', height: '297mm', padding: '16mm', backgroundColor: 'white' }}>
            <div className="flex-grow flex flex-col">
              <header className="text-center mb-12">
                <AmilcarUniversityLogo className="h-20 w-20 mx-auto mb-4" />
                <h1 className="text-lg font-bold tracking-wider">École Supérieure Privée Amilcar des Technologies Avancées et de Management</h1>
              </header>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold underline underline-offset-4 decoration-2">ATTESTATION DE PRESENCE</h2>
                <p className="mt-4 text-sm">Année Universitaire: {student.schoolYear}</p>
              </div>

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
                      est régulièrement présent(e) aux cours pour l'année universitaire {student.schoolYear}.
                  </p>
              </div>

              <div className="mt-auto pt-16 text-right text-sm">
                  <p>Fait à Tunis, le {new Date().toLocaleDateString('fr-FR')}</p>
                  <p className="mt-4">Le Directeur</p>
                  <p className="mt-1">Dr. Helmi Ahmed EL KAMEL</p>
              </div>
            </div>

            <footer className="absolute bottom-0 left-0 right-0 bg-blue-800 text-white text-xs text-center p-3">
                <p>21698144100 contact@amilcaruniversity.com www.amilcaruniversity.com</p>
                <p>1 Rue Jamel Eddine Al Afghani, 1002 Tunis Belvédère</p>
                <p>MF: 1868591PAM000 | RC: C01144132024</p>
            </footer>
          </div>
        )}
      </div>
    </>
  );
};

export default AttestationPresencePage;