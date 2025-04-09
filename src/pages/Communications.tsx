import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CommunicationTemplate } from '../types';
import ApiService from '../services/api';

const Communications = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState<CommunicationTemplate>({
    appId: '',
    body: '',
    channel: 'WHATSAPP',
    merchantName: '',
    templateType: 'SERVICE_IMPLICT',
    partnerAppId: '',
    partnerAppToken: '',
    whatsappNumber: '',
    partnerName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await ApiService.createPartner(template);
      toast({
        title: 'Success',
        description: response.data.message || 'Template created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create template',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CommunicationTemplate, value: string) => {
    setTemplate(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Communications</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <LayoutGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mandatory Fields */}
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium">App ID</label>
              <Input
                value={template.appId}
                onChange={(e) => handleChange('appId', e.target.value)}
                placeholder="Enter App ID"
                required
              />
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium">Merchant Name</label>
              <Input
                value={template.merchantName}
                onChange={(e) => handleChange('merchantName', e.target.value)}
                placeholder="Enter Merchant Name"
                required
              />
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium">Channel</label>
              <Select
                value={template.channel}
                onValueChange={(value) => handleChange('channel', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium">Template Type</label>
              <Select
                value={template.templateType}
                onValueChange={(value) => handleChange('templateType', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Template Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SERVICE_IMPLICT">Service Implicit</SelectItem>
                  <SelectItem value="SERVICE_EXPLICIT">Service Explicit</SelectItem>
                  <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Body */}
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2 md:col-span-2"
            >
              <label className="text-sm font-medium">Body</label>
              <Textarea
                value={template.body}
                onChange={(e) => handleChange('body', e.target.value)}
                placeholder="Enter Template Body"
                required
                className="min-h-[100px]"
              />
            </motion.div>

            {/* Conditional Fields */}
            <AnimatePresence>
              {template.channel === 'SMS' && (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.2,
                    layout: { duration: 0.3 }
                  }}
                  className="space-y-6 md:col-span-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">PE ID</label>
                      <Input
                        value={template.peId}
                        onChange={(e) => handleChange('peId', e.target.value)}
                        placeholder="Enter PE ID"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Header</label>
                      <Input
                        value={template.header}
                        onChange={(e) => handleChange('header', e.target.value)}
                        placeholder="Enter Header"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {template.channel === 'WHATSAPP' && (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.2,
                    layout: { duration: 0.3 }
                  }}
                  className="space-y-6 md:col-span-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Partner App ID</label>
                      <Input
                        value={template.partnerAppId}
                        onChange={(e) => handleChange('partnerAppId', e.target.value)}
                        placeholder="Enter Partner App ID"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Partner App Token</label>
                      <Input
                        value={template.partnerAppToken}
                        onChange={(e) => handleChange('partnerAppToken', e.target.value)}
                        placeholder="Enter Partner App Token"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">WhatsApp Number</label>
                      <Input
                        value={template.whatsappNumber}
                        onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                        placeholder="Enter WhatsApp Number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Partner Name</label>
                      <Input
                        value={template.partnerName}
                        onChange={(e) => handleChange('partnerName', e.target.value)}
                        placeholder="Enter Partner Name"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Optional Fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Gateway Name (Optional)</label>
              <Input
                value={template.gatewayName}
                onChange={(e) => handleChange('gatewayName', e.target.value)}
                placeholder="Enter Gateway Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Template ID (Optional)</label>
              <Input
                value={template.templateId}
                onChange={(e) => handleChange('templateId', e.target.value)}
                placeholder="Enter Template ID"
              />
            </div>
          </div>
          </LayoutGroup>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Communications;
