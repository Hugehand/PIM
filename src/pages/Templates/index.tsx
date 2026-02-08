import React, { useState } from 'react';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { Template } from '../../types';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label } from '../../components/ui';
import { Plus, Trash2, Edit2, Copy, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const Templates = () => {
  const { templates, addTemplate, updateTemplate, removeTemplate } = useTemplateStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Template | null>(null);

  const handleCreate = () => {
    const newTemplate: Template = {
      id: uuidv4(),
      name: '新模板',
      type: 'text',
      content: '',
      mapping: {},
    };
    addTemplate(newTemplate);
    setEditingId(newTemplate.id);
    setEditForm(newTemplate);
  };

  const handleEdit = (template: Template) => {
    setEditingId(template.id);
    setEditForm({ ...template });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个模板吗？')) {
      removeTemplate(id);
    }
  };

  const handleSave = () => {
    if (editForm && editingId) {
      updateTemplate(editingId, editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const insertVariable = (variable: string) => {
    if (!editForm) return;
    const textArea = document.getElementById('template-content') as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = editForm.content;
      const newText = text.substring(0, start) + variable + text.substring(end);
      setEditForm({ ...editForm, content: newText });
      
      // Restore cursor position (approximate)
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    } else {
      setEditForm({ ...editForm, content: editForm.content + variable });
    }
  };

  if (editingId && editForm) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">编辑模板</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>取消</Button>
            <Button onClick={handleSave}>保存模板</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="name">模板名称</Label>
                  <Input 
                    id="name" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                  />
                </div>
                <div>
                  <Label htmlFor="type">输出格式</Label>
                  <select 
                    id="type"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
                  >
                    <option value="text">纯文本 (Text)</option>
                    <option value="json">JSON</option>
                    <option value="table">表格 (CSV/TSV)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="template-content">模板内容</Label>
                  <textarea
                    id="template-content"
                    className="w-full h-96 p-3 font-mono text-sm border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    placeholder="在此输入模板内容..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">变量参考</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-semibold mb-2">基本信息</div>
                    <div className="flex flex-wrap gap-2">
                      {['{{basic.name}}', '{{basic.gender}}', '{{basic.idNumber}}', '{{basic.phone}}', '{{basic.email}}', '{{basic.address}}', '{{basic.location}}'].map(v => (
                        <button key={v} onClick={() => insertVariable(v)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono">{v}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">所有经历 (按时间排序)</div>
                    <div className="p-2 bg-gray-50 rounded font-mono text-xs mb-2">
                      {'{{#experiences}} ... {{/experiences}}'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['{{name}}', '{{role}}', '{{title}}', '{{location}}', '{{startDate}}', '{{endDate}}', '{{description}}'].map(v => (
                        <button key={v} onClick={() => insertVariable(v)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono">{v}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">教育经历 (仅教育)</div>
                    <div className="p-2 bg-gray-50 rounded font-mono text-xs mb-2">
                      {'{{#education}} ... {{/education}}'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['{{name}}', '{{role}}', '{{title}}', '{{location}}', '{{startDate}}', '{{endDate}}'].map(v => (
                        <button key={v} onClick={() => insertVariable(v)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono">{v}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">工作经历 (仅工作)</div>
                    <div className="p-2 bg-gray-50 rounded font-mono text-xs mb-2">
                      {'{{#work}} ... {{/work}}'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['{{name}}', '{{role}}', '{{title}}', '{{location}}', '{{startDate}}', '{{endDate}}'].map(v => (
                        <button key={v} onClick={() => insertVariable(v)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono">{v}</button>
                      ))}
                    </div>
                  </div>
                   <div>
                    <div className="font-semibold mb-2">家庭成员</div>
                    <div className="p-2 bg-gray-50 rounded font-mono text-xs mb-2">
                      {'{{#family}} ... {{/family}}'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['{{relation}}', '{{name}}', '{{company}}', '{{position}}', '{{phone}}'].map(v => (
                        <button key={v} onClick={() => insertVariable(v)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono">{v}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">模板库</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> 新建模板
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{template.name}</CardTitle>
              <div className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 uppercase">{template.type}</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3 font-mono bg-gray-50 p-2 rounded">
                {template.content}
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                  <Edit2 className="w-3 h-3 mr-1" /> 编辑
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(template.id)}>
                  <Trash2 className="w-3 h-3 mr-1" /> 删除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;
