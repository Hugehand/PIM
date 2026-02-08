import React, { useState, useMemo } from 'react';
import { useProfileStore } from '../../stores/useProfileStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { generateOutput } from '../../utils/generator';
import { Button, Card, CardHeader, CardTitle, CardContent, Label } from '../../components/ui';
import { Copy, Check, FileText } from 'lucide-react';

export const Generator = () => {
  const { profile } = useProfileStore();
  const { templates } = useTemplateStore();
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const generatedContent = useMemo(() => {
    if (!selectedTemplate) return '';
    try {
      return generateOutput(profile, selectedTemplate);
    } catch (error) {
      console.error('Generation error:', error);
      return '生成出错，请检查模板格式。';
    }
  }, [profile, selectedTemplate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">一键生成</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">选择模板</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`w-full text-left px-4 py-3 rounded-md border transition-colors ${
                      selectedTemplateId === template.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1 uppercase">{template.type}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <CardTitle className="text-lg">预览结果</CardTitle>
              <Button onClick={handleCopy} disabled={!generatedContent}>
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> 已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> 复制结果
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <textarea
                readOnly
                className="w-full h-[500px] p-4 font-mono text-sm resize-none focus:outline-none"
                value={generatedContent}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Generator;
