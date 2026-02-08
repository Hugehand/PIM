import React, { useState } from 'react';
import { useProfileStore } from '../../stores/useProfileStore';
import { Work as WorkType } from '../../types';
import { Input, Label, Button, Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { Trash2, Plus, Pencil } from 'lucide-react';

export const Work = () => {
  const { profile, addWork, updateWork, removeWork } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const initialFormState = {
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (work: WorkType) => {
    setFormData({
      company: work.company,
      position: work.position,
      startDate: work.startDate,
      endDate: work.endDate,
      description: work.description,
    });
    setCurrentId(work.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      removeWork(id);
    }
  };

  const handleSave = () => {
    if (currentId) {
      updateWork(currentId, formData);
    } else {
      addWork(formData);
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
        <CardTitle>工作经历</CardTitle>
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
                <Label htmlFor="company">单位名称</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="请输入单位名称" />
              </div>
              <div>
                <Label htmlFor="position">岗位/职务</Label>
                <Input id="position" name="position" value={formData.position} onChange={handleChange} placeholder="请输入岗位" />
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
              <div className="md:col-span-2">
                <Label htmlFor="description">工作内容/描述</Label>
                <Input id="description" name="description" value={formData.description} onChange={handleChange} placeholder="简要描述工作内容" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>取消</Button>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.work.length === 0 ? (
              <div className="text-center text-gray-500 py-8">暂无工作经历，请点击添加</div>
            ) : (
              profile.work.map((work) => (
                <div key={work.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-lg">{work.company}</div>
                    <div className="text-gray-600">{work.position}</div>
                    <div className="text-sm text-gray-400">{work.startDate} - {work.endDate}</div>
                    {work.description && <div className="text-sm text-gray-500 mt-1">{work.description}</div>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(work)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(work.id)}>
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
