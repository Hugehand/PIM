import React, { useState } from 'react';
import { BasicInfo } from './BasicInfo';
import { Experience } from './Experience';
import { Family } from './Family';
import { cn } from '../../components/ui';

const tabs = [
  { id: 'basic', label: '基本信息', component: BasicInfo },
  { id: 'experience', label: '教育/工作经历', component: Experience },
  { id: 'family', label: '家庭成员', component: Family },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || BasicInfo;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">我的档案</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 bg-white p-2 rounded-lg shadow-sm border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md text-left transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default Profile;
