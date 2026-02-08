import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Template } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TemplateState {
  templates: Template[];
  addTemplate: (template: Omit<Template, 'id'>) => void;
  updateTemplate: (id: string, template: Partial<Template>) => void;
  removeTemplate: (id: string) => void;
}

const defaultTemplates: Template[] = [
  {
    id: 'default-3',
    name: '学习工作简历 (表格格式)',
    type: 'table', // Actually using text/markdown to simulate table structure for copy-paste to excel or just plain text table
    content: `开始时间	结束时间	毕业院校及所学专业（工作单位及职务）
{{#experiences}}
{{startDate}}	{{endDate}}	{{name}} {{role}} {{title}} {{description}}
{{/experiences}}`,
    mapping: {},
  },
  {
    id: 'default-1',
    name: '简单的自我介绍',
    type: 'text',
    content: `姓名：{{basic.name}}
性别：{{basic.gender}}
出生日期：{{basic.birthDate}}
联系电话：{{basic.phone}}
邮箱：{{basic.email}}
通讯地址：{{basic.address}}

【教育/工作经历】
{{#experiences}}
{{startDate}} - {{endDate}}  {{name}}  {{role}}  {{title}}
{{description}}
{{/experiences}}`,
    mapping: {},
  },
  {
    id: 'default-2',
    name: '标准 JSON 格式',
    type: 'json',
    content: `{
  "personalInfo": {
    "name": "{{basic.name}}",
    "gender": "{{basic.gender}}",
    "idCard": "{{basic.idNumber}}",
    "contact": {
      "phone": "{{basic.phone}}",
      "email": "{{basic.email}}",
      "address": "{{basic.address}}"
    }
  },
  "experiences": [
    {{#experiences}}
    {
      "type": "{{type}}",
      "name": "{{name}}",
      "role": "{{role}}",
      "title": "{{title}}",
      "period": "{{startDate}} to {{endDate}}",
      "details": "{{description}}"
    }{{^last}},{{/last}}
    {{/experiences}}
  ]
}`,
    mapping: {},
  }
];

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set) => ({
      templates: defaultTemplates,
      
      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, { ...template, id: uuidv4() }],
        })),

      updateTemplate: (id, template) =>
        set((state) => ({
          templates: state.templates.map((item) =>
            item.id === id ? { ...item, ...template } : item
          ),
        })),

      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'template-storage',
    }
  )
);
