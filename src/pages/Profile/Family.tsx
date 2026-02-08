import React, { useState } from 'react';
import { useProfileStore } from '../../stores/useProfileStore';
import { Family as FamilyType } from '../../types';
import { Input, Label, Button, Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { Trash2, Plus, Pencil } from 'lucide-react';

export const Family = () => {
  const { profile, addFamily, updateFamily, removeFamily } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const initialFormState = {
    relation: '',
    name: '',
    company: '',
    position: '',
    phone: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (family: FamilyType) => {
    setFormData({
      relation: family.relation,
      name: family.name,
      company: family.company,
      position: family.position,
      phone: family.phone,
    });
    setCurrentId(family.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      removeFamily(id);
    }
  };

  const handleSave = () => {
    if (currentId) {
      updateFamily(currentId, formData);
    } else {
      addFamily(formData);
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
        <CardTitle>家庭成员</CardTitle>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" /> 添加成员
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="relation">关系</Label>
                <Input id="relation" name="relation" value={formData.relation} onChange={handleChange} placeholder="父亲/母亲/配偶" />
              </div>
              <div>
                <Label htmlFor="name">姓名</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="请输入姓名" />
              </div>
              <div>
                <Label htmlFor="company">工作单位</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="请输入单位" />
              </div>
              <div>
                <Label htmlFor="position">职务</Label>
                <Input id="position" name="position" value={formData.position} onChange={handleChange} placeholder="请输入职务" />
              </div>
              <div>
                <Label htmlFor="phone">联系电话</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="请输入电话" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>取消</Button>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.family.length === 0 ? (
              <div className="text-center text-gray-500 py-8">暂无家庭成员信息，请点击添加</div>
            ) : (
              profile.family.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-lg">{member.relation} - {member.name}</div>
                    <div className="text-gray-600">{member.company} | {member.position}</div>
                    <div className="text-sm text-gray-400">{member.phone}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(member.id)}>
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
