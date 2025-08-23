import React from 'react';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { AcademicCapIcon } from '../icons/AcademicCapIcon';
import { LibraryIcon } from '../icons/LibraryIcon';
import { CurrencyDollarIcon } from '../icons/CurrencyDollarIcon';
import type { Student, Teacher, Classe, Payment } from '../../types';
import { tuitionFees } from '../scholarship/mockPaymentData';
import { useTranslation } from '../../contexts/LanguageContext';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// A simple Pie Chart component
const PieChart: React.FC<{ data: { name: string, value: number, color: string }[] }> = ({ data }) => {
  const { t } = useTranslation();
  const total = data.reduce((acc, item) => acc + item.value, 0);
  if (total === 0) return <div className="flex items-center justify-center h-48 text-gray-500">{t('common.noData')}</div>;

  let cumulativePercent = 0;
  const gradients = data.map(item => {
    const percent = (item.value / total) * 100;
    const start = cumulativePercent;
    cumulativePercent += percent;
    const end = cumulativePercent;
    return `${item.color} ${start}% ${end}%`;
  });

  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
      <div 
        className="w-36 h-36 rounded-full flex-shrink-0"
        style={{ background: `conic-gradient(${gradients.join(', ')})` }}
      />
      <div className="w-full">
        <ul className="space-y-2">
          {data.map(item => (
            <li key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="font-semibold text-gray-800">{item.value} ({(item.value / total * 100).toFixed(1)}%)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// A simple Bar Chart component
const BarChart: React.FC<{ data: { name: string, value: number }[], color: string }> = ({ data, color }) => {
  const { t } = useTranslation();
  const maxValue = Math.max(...data.map(item => item.value), 0);
  if (maxValue === 0) return <div className="flex items-center justify-center h-48 text-gray-500">{t('common.noData')}</div>;
  
  return (
    <div className="w-full h-64 flex items-end space-x-4 px-4 pt-4">
      {data.map(item => (
        <div key={item.name} className="flex-1 flex flex-col items-center">
          <div className="text-sm font-semibold text-gray-700">{item.value}</div>
          <div 
            className={`w-full rounded-t-md ${color}`}
            style={{ height: `${(item.value / maxValue) * 85}%` }}
          ></div>
          <div className="text-xs text-gray-500 mt-1 truncate">{item.name}</div>
        </div>
      ))}
    </div>
  );
};


interface DashboardPageProps {
  students: Student[];
  teachers: Teacher[];
  classes: Classe[];
  payments: Payment[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ students, teachers, classes, payments }) => {
  const { t } = useTranslation();
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  // Data for charts
  const studentsByLevel = students.reduce((acc, student) => {
    const levelName = student.academicLevel || 'N/A';
    acc[levelName] = (acc[levelName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const levelChartData = Object.entries(studentsByLevel)
    .map(([name, value]) => ({ name, value }))
    .sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  
  const genderCounts = students.reduce((acc, student) => {
    if (student.gender === 'Male') acc.male++;
    else acc.female++;
    return acc;
  }, { male: 0, female: 0 });
  const genderPieData = [
    { name: t('dashboardPage.boys'), value: genderCounts.male, color: '#60a5fa' }, // blue-400
    { name: t('dashboardPage.girls'), value: genderCounts.female, color: '#f472b6' } // pink-400
  ];

  const paymentStatusCounts = students.reduce((acc, student) => {
    const feeInfo = tuitionFees.find(f => f.niveau === student.academicLevel && f.specialite === student.academicSpecialty);
    if (!feeInfo) {
      acc.unpaid++;
      return acc;
    }
    const totalDue = feeInfo.total;
    const studentPayments = payments.filter(p => p.studentId === student.id);
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid <= 0) acc.unpaid++;
    else if (totalPaid >= totalDue) acc.paid++;
    else acc.partial++;
    
    return acc;
  }, { paid: 0, partial: 0, unpaid: 0 });
  const financialPieData = [
    { name: t('dashboardPage.paid'), value: paymentStatusCounts.paid, color: '#4ade80' }, // green-400
    { name: t('dashboardPage.partial'), value: paymentStatusCounts.partial, color: '#facc15' }, // yellow-400
    { name: t('dashboardPage.unpaid'), value: paymentStatusCounts.unpaid, color: '#f87171' } // red-400
  ];


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{t('dashboardPage.title')}</h1>
        <p className="mt-1 text-gray-600">{t('dashboardPage.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<UserGroupIcon />} title={t('dashboardPage.students')} value={totalStudents.toLocaleString()} color="border-blue-500" />
        <StatCard icon={<AcademicCapIcon />} title={t('dashboardPage.teachers')} value={totalTeachers.toLocaleString()} color="border-green-500" />
        <StatCard icon={<LibraryIcon className="h-6 w-6"/>} title={t('dashboardPage.classes')} value={totalClasses.toLocaleString()} color="border-yellow-500" />
        <StatCard icon={<CurrencyDollarIcon />} title={t('dashboardPage.revenue')} value={totalRevenue.toLocaleString('fr-FR', {minimumFractionDigits: 2})} color="border-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('dashboardPage.studentDistribution')}</h2>
          <BarChart data={levelChartData} color="bg-blue-400" />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('dashboardPage.genderDistribution')}</h2>
            <PieChart data={genderPieData} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('dashboardPage.financialOverview')}</h2>
            <PieChart data={financialPieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;