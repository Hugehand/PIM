# 技术架构 - 个人信息管家

## 1. 技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + Shadcn UI (或通用的无障碍组件)
- **状态管理**: Zustand
- **路由**: React Router DOM
- **图标**: Lucide React
- **存储**: LocalStorage (通过 Zustand 持久化中间件) 或 IndexedDB (Dexie.js) 如果数据变得复杂。对于 MVP，LocalStorage 足够了。

## 2. 项目结构
```
src/
├── components/        # 可复用的 UI 组件
├── layouts/           # 页面布局 (侧边栏, 顶部栏)
├── pages/             # 路由组件
│   ├── Dashboard/
│   ├── Profile/       # 主数据录入
│   ├── Templates/     # 模板管理
│   └── Generator/     # 数据生成
├── stores/            # Zustand stores (useProfileStore, useTemplateStore)
├── types/             # TypeScript 接口 (Profile, Education, Family, Template)
├── utils/             # 辅助函数 (Formatters, Mappers)
└── App.tsx
```

## 3. 数据模型

### 3.1 个人档案 (Profile)
```typescript
interface Profile {
  basic: {
    name: string;
    gender: string;
    idNumber: string;
    phone: string;
    email: string;
    address: string;
    // ...其他字段
  };
  education: Array<{
    id: string;
    school: string;
    major: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  work: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  family: Array<{
    id: string;
    relation: string;
    name: string;
    company: string;
    position: string;
    phone: string;
  }>;
}
```

### 3.2 模板 (Template)
```typescript
interface Template {
  id: string;
  name: string;
  type: 'text' | 'json' | 'table';
  content: string; // 带有占位符的模板字符串，例如 {{name}}
  mapping: Record<string, string>; // 将模板键映射到档案键
}
```

## 4. 关键逻辑
- **数据持久化**: `useProfileStore` 将自动与 LocalStorage 同步。
- **模板引擎**: 一个工具函数 `generateOutput(profile, template)`，用档案数据替换模板中的占位符。
    - 使用轻量级模板方法（例如，正则替换或如果需要逻辑则使用像 `handlebars` 这样的小型库）。

## 5. 安全与隐私
- **仅限本地**: 明确确保没有 API 调用将用户档案数据发送到外部服务器。
