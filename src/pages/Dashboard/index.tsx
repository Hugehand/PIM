import React from 'react';
import { Link } from 'react-router-dom';
import { useProfileStore } from '../../stores/useProfileStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { User, FileText, Zap, ChevronRight } from 'lucide-react';

export const Dashboard = () => {
  const { profile } = useProfileStore();
  const { templates } = useTemplateStore();

  const completionStatus = [
    { label: '基本信息', filled: !!profile.basic.name },
    { label: '教育经历', filled: profile.education.length > 0 },
    { label: '工作经历', filled: profile.work.length > 0 },
    { label: '家庭成员', filled: profile.family.length > 0 },
  ];

  const completedCount = completionStatus.filter(s => s.filled).length;
  const progress = Math.round((completedCount / 4) * 100);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">欢迎回来，{profile.basic.name || '新朋友'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <CardHeader>
            <CardTitle className="text-lg opacity-90">快速开始</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">一键生成</div>
            <p className="opacity-80 mb-4 text-sm">选择模板，立即生成目标格式数据。</p>
            <Link to="/generate" className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-50 transition-colors">
              <Zap className="w-4 h-4 mr-2" /> 去生成
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">档案完善度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end mb-2">
              <span className="text-4xl font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="space-y-1">
              {completionStatus.map((item, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${item.filled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={item.filled ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link to="/profile" className="text-blue-600 text-sm font-medium flex items-center hover:underline">
                完善档案 <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">模板库</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{templates.length}</div>
            <p className="text-gray-500 text-sm mb-4">个可用模板</p>
            <div className="space-y-2">
              {templates.slice(0, 3).map(t => (
                <div key={t.id} className="text-sm text-gray-600 truncate flex items-center">
                  <FileText className="w-3 h-3 mr-2 opacity-50" />
                  {t.name}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link to="/templates" className="text-blue-600 text-sm font-medium flex items-center hover:underline">
                管理模板 <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
