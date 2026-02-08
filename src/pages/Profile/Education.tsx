import React, { useState } from 'react';
import { useProfileStore } from '../../stores/useProfileStore';
import { Education as EducationType } from '../../types';
import { Input, Label, Button, Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { Trash2, Plus, Pencil } from 'lucide-react';

export const Education = () => {
  const { profile, addEducation, updateEducation, removeEducation } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const initialFormState = {
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (edu: EducationType) => {
    setFormData({
      school: edu.school,
      major: edu.major,
      degree: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
    });
    setCurrentId(edu.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      removeEducation(id);
    }
  };

  const handleSave = () => {
    if (currentId) {
      updateEducation(currentId, formData);
    } else {
      addEducation(formData);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>教育经历</CardTitle>
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
              <div>
                <Label htmlFor="school">学校名称</Label>
                <Input id="school" name="school" value={formData.school} onChange={handleChange} placeholder="请输入学校名称" />
              </div>
              <div>
                <Label htmlFor="major">专业</Label>
                <Input id="major" name="major" value={formData.major} onChange={handleChange} placeholder="请输入专业" />
              </div>
              <div>
                <Label htmlFor="degree">学历/学位</Label>
                <Input id="degree" name="degree" value={formData.degree} onChange={handleChange} placeholder="本科/学士" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div>
                    <Label htmlFor="startDate">开始时间</Label>
                    <Input id="startDate" name="startDate" type="month" value={formData.startDate} onChange={handleChange} />
                 </div>
                 <div>
                    <Label htmlFor="endDate">结束时间</Label>
                    <Input id="endDate" name="endDate" type="month" value={formData.endDate} onChange={handleChange} />
                 </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>取消</Button>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.education.length === 0 ? (
              <div className="text-center text-gray-500 py-8">暂无教育经历，请点击添加</div>
            ) : (
              profile.education.map((edu) => (
                <div key={edu.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-lg">{edu.school}</div>
                    <div className="text-gray-600">{edu.major} | {edu.degree}</div>
                    <div className="text-sm text-gray-400">{edu.startDate} - {edu.endDate}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(edu)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(edu.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
