import React from 'react';

const SettingsToggle: React.FC<{ label: string; description: string; enabled: boolean }> = ({ label, description, enabled }) => {
  const [isOn, setIsOn] = React.useState(enabled);
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button onClick={() => setIsOn(!isOn)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOn ? 'bg-indigo-600' : 'bg-gray-300'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
};


const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
      
      <div className="space-y-12">
        {/* Profile Settings */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" defaultValue="Admin User" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" defaultValue="admin@northwood.edu" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-2">Notifications</h2>
          <div className="divide-y">
            <SettingsToggle label="Email Notifications" description="Get notified by email about important events." enabled={true} />
            <SettingsToggle label="Push Notifications" description="Receive push notifications on your devices." enabled={true} />
            <SettingsToggle label="Weekly Summaries" description="Receive a weekly summary report." enabled={false} />
          </div>
        </div>
        
        {/* Security Settings */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">Security</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Password</p>
              <p className="text-sm text-gray-500">Last changed on 12/01/2024</p>
            </div>
            <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
              Change Password
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
