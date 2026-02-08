import React, { useState } from 'react';
import { useProfileStore } from '../../stores/useProfileStore';
import { Experience as ExperienceType } from '../../types';
import { Input, Label, Button, Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { Trash2, Plus, Pencil, GraduationCap, Briefcase, List } from 'lucide-react';

export const Experience = () => {
  const { profile, addExperience, updateExperience, removeExperience } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  // Sort experiences by start date (older first for display to match image)
  const sortedExperiences = [...(profile.experiences || [])].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const initialFormState: Omit<ExperienceType, 'id'> = {
    type: 'education', // default, not shown in UI anymore but needed for type compatibility
    name: '',
    role: '',
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (exp: ExperienceType) => {
    setFormData({
      type: exp.type || 'education',
      name: exp.name || '',
      role: exp.role || '',
      title: exp.title || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      location: exp.location || '',
      description: exp.description || '',
    });
    setCurrentId(exp.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      removeExperience(id);
    }
  };

  const handleSave = () => {
    // Determine type heuristically if needed, or just default to 'work' or 'education' since we merged them visually.
    // For now, let's keep the existing type if editing, or default to 'education' if new (it doesn't matter much visually now).
    const dataToSave = { 
        ...formData,
        type: formData.type || 'education' // Ensure type is set
    };
    
    if (currentId) {
      updateExperience(currentId, dataToSave);
    } else {
      addExperience(dataToSave);
    }
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>教育与工作经历</CardTitle>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" /> 添加经历
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2 md:col-span-2">
                 <div>
                    <Label htmlFor="startDate">开始时间</Label>
                    <Input 
                        id="startDate" 
                        name="startDate" 
                        type="date" 
                        value={formData.startDate} 
                        onChange={handleChange} 
                        placeholder="YYYY-MM-DD"
                    />
                 </div>
                 <div>
                    <Label htmlFor="endDate">结束时间</Label>
                    <Input 
                        id="endDate" 
                        name="endDate" 
                        type="date" 
                        value={formData.endDate} 
                        onChange={handleChange} 
                        placeholder="YYYY-MM-DD"
                    />
                 </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="name">毕业院校及所学专业（工作单位及职务）</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="例如：山东大学 计算机专业 或 某某科技公司 Java开发" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>取消</Button>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
             {/* Table Header like structure */}
             {sortedExperiences.length > 0 && (
               <div className="grid grid-cols-12 gap-2 p-3 bg-blue-50 text-sm font-semibold text-gray-700 border-b border-gray-200">
                 <div className="col-span-3 md:col-span-2">开始时间</div>
                 <div className="col-span-3 md:col-span-2">结束时间</div>
                 <div className="col-span-6 md:col-span-8">毕业院校及所学专业（工作单位及职务）</div>
               </div>
             )}

            {sortedExperiences.length === 0 ? (
              <div className="text-center text-gray-500 py-8">暂无经历，请点击添加</div>
            ) : (
              sortedExperiences.map((exp, index) => {
                return (
                  <div 
                    key={exp.id} 
                    className={`grid grid-cols-12 gap-2 p-3 text-sm border-b hover:bg-gray-50 items-center group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <div className="col-span-3 md:col-span-2 font-mono text-gray-600">{exp.startDate}</div>
                    <div className="col-span-3 md:col-span-2 font-mono text-gray-600">{exp.endDate}</div>
                    <div className="col-span-5 md:col-span-7">
                      <div className="font-medium text-gray-900">
                        {exp.name} 
                      </div>
                    </div>
                    
                    {/* Action Buttons - Visible on hover or always on mobile */}
                    <div className="col-span-1 md:col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(exp)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600" onClick={() => handleDelete(exp.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
