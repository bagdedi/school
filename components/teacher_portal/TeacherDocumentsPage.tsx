import React, { useState, useMemo } from 'react';
import type { Teacher, TeacherDocument, Classe } from '../../types';
import { Toaster, toast } from 'react-hot-toast';
import { DocumentArrowUpIcon } from '../icons/DocumentArrowUpIcon';
import { ArrowDownTrayIcon } from '../icons/ArrowDownTrayIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface TeacherDocumentsPageProps {
  teacher: Teacher;
  documents: TeacherDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<TeacherDocument[]>>;
  classes: Classe[];
}

const TeacherDocumentsPage: React.FC<TeacherDocumentsPageProps> = ({ teacher, documents, setDocuments, classes }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedNiveaux, setSelectedNiveaux] = useState<string[]>([]);
  const [selectedSpecialites, setSelectedSpecialites] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const teacherDocuments = useMemo(() => {
    return documents
        .filter(doc => doc.teacherId === teacher.id)
        .sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [documents, teacher.id]);

  const uniqueNiveaux = useMemo(() => [...new Set(classes.map(c => c.niveau))].sort(), [classes]);
  const uniqueSpecialites = useMemo(() => [...new Set(classes.map(c => c.specialite))].sort(), [classes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCheckboxChange = (type: 'niveau' | 'specialite', value: string) => {
    if (type === 'niveau') {
      setSelectedNiveaux(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    } else {
      setSelectedSpecialites(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || selectedNiveaux.length === 0 || selectedSpecialites.length === 0) {
      toast.error("Veuillez remplir tous les champs et sélectionner au moins un niveau et une spécialité.");
      return;
    }
    
    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const newDocument: TeacherDocument = {
        id: `doc_${Date.now()}`,
        teacherId: teacher.id,
        title,
        fileUrl: reader.result as string,
        fileName: file.name,
        fileType: file.type,
        niveau: selectedNiveaux,
        specialite: selectedSpecialites,
        uploadedAt: new Date().toISOString(),
      };
      setDocuments(prev => [...prev, newDocument]);
      
      // Reset form
      setTitle('');
      setFile(null);
      setSelectedNiveaux([]);
      setSelectedSpecialites([]);
      (document.getElementById('file-upload') as HTMLInputElement).value = '';
      
      toast.success("Document téléversé avec succès !");
      setIsUploading(false);
    };
    reader.onerror = () => {
        toast.error("Erreur lors de la lecture du fichier.");
        setIsUploading(false);
    }
  };
  
  const handleDelete = (docId: string) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
          setDocuments(prev => prev.filter(doc => doc.id !== docId));
          toast.success("Document supprimé.");
      }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Documents</h1>
        <p className="mt-1 text-gray-600">Téléversez et partagez des documents avec vos étudiants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-4 flex items-center">
              <DocumentArrowUpIcon className="mr-3 h-6 w-6 text-gray-500" />
              Nouveau Document
            </h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre du document</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Fichier</label>
              <input type="file" id="file-upload" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required />
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Cibler par Niveau</h3>
                <div className="grid grid-cols-2 gap-2">
                    {uniqueNiveaux.map(niveau => (
                        <label key={niveau} className="flex items-center space-x-2 p-2 rounded-md bg-gray-50 border has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-300">
                            <input type="checkbox" value={niveau} checked={selectedNiveaux.includes(niveau)} onChange={() => handleCheckboxChange('niveau', niveau)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span>{niveau}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Cibler par Spécialité</h3>
                <div className="max-h-32 overflow-y-auto space-y-2 p-2 bg-gray-50 border rounded-md">
                    {uniqueSpecialites.map(spec => (
                        <label key={spec} className="flex items-center space-x-2">
                            <input type="checkbox" value={spec} checked={selectedSpecialites.includes(spec)} onChange={() => handleCheckboxChange('specialite', spec)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span>{spec}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <button type="submit" disabled={isUploading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
              {isUploading ? 'Téléversement...' : 'Téléverser'}
            </button>
          </form>
        </div>
        
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
           <h2 className="text-xl font-semibold text-gray-700 mb-4">Mes Documents</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="p-3">Titre</th>
                            <th className="p-3">Cible</th>
                            <th className="p-3">Date</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {teacherDocuments.map(doc => (
                            <tr key={doc.id} className="border-b border-gray-200">
                                <td className="p-3 font-medium">{doc.title}<p className="text-xs text-gray-500">{doc.fileName}</p></td>
                                <td className="p-3 text-xs">
                                    <div className="flex flex-wrap gap-1">
                                      {doc.niveau.map(n => <span key={n} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{n}</span>)}
                                      {doc.specialite.map(s => <span key={s} className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">{s}</span>)}
                                    </div>
                                </td>
                                <td className="p-3 text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                                <td className="p-3">
                                    <div className="flex justify-center items-center space-x-2">
                                        <a href={doc.fileUrl} download={doc.fileName} className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100" title="Télécharger">
                                            <ArrowDownTrayIcon />
                                        </a>
                                        <button onClick={() => handleDelete(doc.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100" title="Supprimer">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {teacherDocuments.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        <p>Vous n'avez encore téléversé aucun document.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDocumentsPage;