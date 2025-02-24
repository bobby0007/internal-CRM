import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Hash, 
  Plus, 
  Search, 
  Trash2, 
  MessageSquare, 
  Languages,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Template } from '../types';
import { mockTemplates } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Toast } from "@/components/ui/toast";

const TemplateForm = () => {
  const [template, setTemplate] = useState<Template>({
    dltPeId: '',
    senderId: '',
    templateId: '',
    templateText: '',
    category: '',
    language: 'English',
  });

  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const { toast } = useToast();

  const filteredTemplates = templates.filter(t => 
    t.templateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.templateText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTemplates((prev) => [template, ...prev]);
    setTemplate({
      dltPeId: '',
      senderId: '',
      templateId: '',
      templateText: '',
      category: '',
      language: 'English',
    });
    toast({
      title: "Template Created",
      description: "Your template has been successfully created.",
    });
    setActiveTab('view');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.templateId !== templateId));
    toast({
      title: "Template Deleted",
      description: "The template has been removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <MessageSquare className="h-8 w-8 text-blue-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Template Management</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Create and manage your message templates. Templates can be used for various purposes such as OTP, transactions, and promotional messages.
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            View Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Create New Template</CardTitle>
                <CardDescription>
                  Fill in the details below to create a new message template.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dltPeId">DLT PE ID</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="dltPeId"
                          name="dltPeId"
                          value={template.dltPeId}
                          onChange={handleChange}
                          className="pl-9"
                          required
                          placeholder="Enter DLT PE ID"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="senderId">Sender ID</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Send className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="senderId"
                          name="senderId"
                          value={template.senderId}
                          onChange={handleChange}
                          className="pl-9"
                          required
                          placeholder="Enter Sender ID"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="templateId">Template ID</Label>
                    <Input
                      id="templateId"
                      name="templateId"
                      value={template.templateId}
                      onChange={handleChange}
                      required
                      placeholder="Enter Template ID"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Select
                          value={template.category}
                          onValueChange={(value) => handleSelectChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OTP">OTP</SelectItem>
                            <SelectItem value="Transaction">Transaction</SelectItem>
                            <SelectItem value="Promotional">Promotional</SelectItem>
                            <SelectItem value="Alert">Alert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <div className="relative">
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Select
                          value={template.language}
                          onValueChange={(value) => handleSelectChange('language', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                            <SelectItem value="Marathi">Marathi</SelectItem>
                            <SelectItem value="Gujarati">Gujarati</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="templateText">Template Text</Label>
                    <Textarea
                      id="templateText"
                      name="templateText"
                      value={template.templateText}
                      onChange={handleChange}
                      rows={4}
                      required
                      placeholder="Enter your template text here. Use {#var#} for variables."
                      className="resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Template
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="view">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Existing Templates</CardTitle>
                <CardDescription>
                  View and manage your existing message templates.
                </CardDescription>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredTemplates.map((t, index) => (
                      <motion.div
                        key={t.templateId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {t.templateId}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  Language: {t.language}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  {t.category}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(t.templateId)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                              {t.templateText}
                            </p>
                            <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t">
                              <span>DLT PE ID: {t.dltPeId}</span>
                              <span>Sender ID: {t.senderId}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredTemplates.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No templates found matching your search.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      <Toast />
    </div>
  );
};

export default TemplateForm;