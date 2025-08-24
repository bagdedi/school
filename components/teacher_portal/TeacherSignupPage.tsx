import React from 'react';
import type { Teacher } from '../../types';
import { LogoIcon } from '../icons/LogoIcon';
import { TeacherForm } from '../teachers/TeacherForm';
import { Toaster, toast } from 'react-hot-toast';

interface TeacherSignupPageProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherSignupPage: React.FC<TeacherSignupPageProps> = ({ teachers, setTeachers }) => {
  
  const handleSignup = (teacherData: Omit<Teacher, 'id' | 'avatar' | 'photoUrl' | 'matricule'>) => {
    if (teachers.some(t => t.email.toLowerCase() === teacherData.email.toLowerCase())) {
        toast.error("Un enseignant avec cet email existe déjà.");
        return;
    }

    const newTeacher: Teacher = {
      id: `T${String(teachers.length + 1).padStart(3, '0')}`,
      matricule: `T2024${String(teachers.length + 1).padStart(3, '0')}`,
      ...teacherData,
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
    };
    
    setTeachers([...teachers, newTeacher]);
    toast.success("Compte créé avec succès ! Vous pouvez maintenant vous connecter.", { duration: 4000 });
    setTimeout(() => {
        window.location.href = '/teacher/login';
    }, 2000);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
        <div className="max-w-4xl w-full mx-auto">
            <div className="flex justify-center mb-6">
                <LogoIcon />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Créer un Compte Enseignant</h1>
                    <p className="text-gray-500 mt-1">Remplissez le formulaire pour vous inscrire.</p>
                </div>
                <TeacherForm
                    teacher={null}
                    onSave={handleSignup}
                    onCancel={() => window.location.href = '/teacher/login'}
                />
            </div>
        </div>
      </div>
    </>
  );
};

export default TeacherSignupPage;