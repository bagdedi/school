import React, { useState } from 'react';
import type { Teacher } from '../../types';
import { LogoIcon } from '../icons/LogoIcon';
import { Toaster, toast } from 'react-hot-toast';

interface TeacherLoginPageProps {
  teachers: Teacher[];
  onLogin: (teacher: Teacher) => void;
}

const TeacherLoginPage: React.FC<TeacherLoginPageProps> = ({ teachers, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());

    if (teacher && teacher.password === password) {
      toast.success(`Bienvenue, ${teacher.firstName} !`);
      setTimeout(() => onLogin(teacher), 1000);
    } else {
      toast.error("Email ou mot de passe incorrect.");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-center mb-6">
            <LogoIcon />
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Espace Enseignant</h1>
              <p className="text-gray-500 mt-1">Connectez-vous à votre compte</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Se Connecter
              </button>
            </form>
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Pas encore de compte ?{' '}
                <a href="/teacher/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  S'inscrire
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherLoginPage;