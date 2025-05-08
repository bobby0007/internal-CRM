import { useState, FormEvent, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type {
  TemplateCatalogRequest,
  GetTemplateCatalogResponse,
  TemplateInfo,
  TemplateUpdateRequest,
} from '../types';
import ApiService from '../services/api';

const TemplateConfig = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState<GetTemplateCatalogResponse | null>(null);
  const [defaultTemplateCode, setDefaultTemplateCode] = useState('');

  const [editingTemplate, setEditingTemplate] = useState<{index: number, countryCode: string, templateCode: string, trafficSplit: number} | null>(null);
  const [newCountryCode, setNewCountryCode] = useState('');
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState<{templateCode: string, trafficSplit: number}>({templateCode: '', trafficSplit: 0});
  const [addingToCountryCode, setAddingToCountryCode] = useState<string>('');
  
  const [request, setRequest] = useState<TemplateCatalogRequest>({
    aid: '',
    channel: 'OTP',
    communicationMode: 'SMS'
  });

  const fetchTemplateData = useCallback(async () => {
    if (!request.aid) {
      toast({
        title: 'Error',
        description: 'Please enter an App ID',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.getTemplateCatalog(request);
      console.log('Template Catalog Response:', response);
      // If we get a success response with no data or empty data, initialize with empty config
      if (!response.data || (!response.data.buttonEnabled && !response.data.loadBalancingEnabled)) {
        const emptyConfig: GetTemplateCatalogResponse = {
          buttonEnabled: false,
          loadBalancingEnabled: false,
          loadBalanceTemplates: {},
          statusCode: 200,
          message: 'Successfully Processed.'
        };
        setTemplateData(emptyConfig);
      } else {
        setTemplateData(response.data);
      }
      
      toast({
        title: 'Success',
        description: 'Template configuration fetched successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch template configuration';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [request, toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    fetchTemplateData();
  };

  const handleRequestChange = (field: keyof TemplateCatalogRequest, value: string) => {
    setRequest((prev: TemplateCatalogRequest) => ({ ...prev, [field]: value }));
  };

  const validateTrafficSplit = (templates: TemplateInfo[]): { isValid: boolean; total: number } => {
    const total = templates.reduce((sum, template) => sum + template.trafficSplit, 0);
    return { isValid: total === 100, total };
  };

  const handleUpdateTemplate = async () => {
    if (!templateData || !request.aid) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const updateRequest: TemplateUpdateRequest = {
        aid: request.aid,
        channel: request.channel,
        communicationMode: request.communicationMode,
        defaultTemplateCode,
        updateDetails: {
          buttonEnabled: templateData.buttonEnabled ?? false,
          loadBalancingEnabled: templateData.loadBalancingEnabled ?? false,
          loadBalanceTemplates: templateData.loadBalanceTemplates ?? {}
        }
      };

      await ApiService.updateTemplateCatalog(updateRequest);
      
      toast({
        title: 'Success',
        description: 'Template configuration updated successfully',
      });
      
      // Refresh data
      fetchTemplateData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update template configuration';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTemplate = (countryCode: string) => {
    if (!templateData?.loadBalanceTemplates) return;
    setAddingToCountryCode(countryCode);
    setNewTemplate({templateCode: '', trafficSplit: 0});
    setShowAddTemplateDialog(true);
  };

  const handleSaveNewTemplate = () => {
    if (!templateData?.loadBalanceTemplates || !newTemplate.templateCode || !addingToCountryCode) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Check if template code already exists
    const existingTemplates = templateData.loadBalanceTemplates[addingToCountryCode] || [];
    if (existingTemplates.some(t => t.templateCode === newTemplate.templateCode)) {
      toast({
        title: 'Error',
        description: 'Template code already exists',
        variant: 'destructive',
      });
      return;
    }

    // No validation on add template button - validation will happen on final save button
    
    const templates = [...existingTemplates];
    templates.push({
      templateCode: newTemplate.templateCode.trim(),
      trafficSplit: newTemplate.trafficSplit
    });
    
    setTemplateData({
      ...templateData,
      loadBalanceTemplates: {
        ...templateData.loadBalanceTemplates,
        [addingToCountryCode]: templates
      }
    });

    toast({
      title: 'Success',
      description: 'Template added successfully',
    });

    setShowAddTemplateDialog(false);
    setNewTemplate({templateCode: '', trafficSplit: 0});
  };

  const handleDeleteTemplate = (countryCode: string, templateIndex: number) => {
    if (!templateData?.loadBalanceTemplates) return;
    
    const templates = [...(templateData.loadBalanceTemplates[countryCode] || [])];
    templates.splice(templateIndex, 1);
    
    setTemplateData({
      ...templateData,
      loadBalanceTemplates: {
        ...templateData.loadBalanceTemplates,
        [countryCode]: templates
      }
    });
  };

  const handleEditTemplate = (countryCode: string, template: TemplateInfo, index: number) => {
    setEditingTemplate({
      index,
      countryCode,
      templateCode: template.templateCode,
      trafficSplit: template.trafficSplit
    });
  };

  const handleSaveTemplate = () => {
    if (!templateData?.loadBalanceTemplates || !editingTemplate) {
      toast({
        title: 'Error',
        description: 'Invalid template data',
        variant: 'destructive',
      });
      return;
    }

    const templates = [...(templateData.loadBalanceTemplates[editingTemplate.countryCode] || [])];
    
    // Check if template code already exists (excluding current template)
    const isDuplicate = templates.some((t, idx) => 
      idx !== editingTemplate.index && t.templateCode === editingTemplate.templateCode
    );
    if (isDuplicate) {
      toast({
        title: 'Error',
        description: 'Template code already exists',
        variant: 'destructive',
      });
      return;
    }

    // No validation on the edit template button - validation will happen on final save button
    
    templates[editingTemplate.index] = {
      templateCode: editingTemplate.templateCode.trim(),
      trafficSplit: editingTemplate.trafficSplit
    };
    
    setTemplateData({
      ...templateData,
      loadBalanceTemplates: {
        ...templateData.loadBalanceTemplates,
        [editingTemplate.countryCode]: templates
      }
    });
    
    toast({
      title: 'Success',
      description: 'Template updated successfully',
    });

    setEditingTemplate(null);
  };

  const handleToggleLoadBalancing = () => {
    if (!templateData) return;
    
    setTemplateData({
      ...templateData,
      loadBalancingEnabled: !templateData.loadBalancingEnabled
    });
  };

  const handleToggleButton = () => {
    if (!templateData) return;
    
    setTemplateData({
      ...templateData,
      buttonEnabled: !templateData.buttonEnabled
    });
  };

  const renderTemplateCard = (countryCode: string, templates: TemplateInfo[] = []) => {
    // Create a mapping of sorted indices to original indices
    const sortedIndices = templates
      .map((_, index) => index)
      .sort((a, b) => templates[b].trafficSplit - templates[a].trafficSplit);
    
    const sortedTemplates = sortedIndices.map(index => templates[index]);
    const { isValid, total } = validateTrafficSplit(templates);

    return (
      <Card key={countryCode} className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{countryCode === 'default' ? 'Default Templates' : `Country Code: ${countryCode}`}</CardTitle>
              <CardDescription>
                {templates.length} template{templates.length !== 1 ? 's' : ''} configured
              </CardDescription>
            </div>
            <Badge
              variant={isValid ? 'default' : 'destructive'}
              className={isValid ? 'bg-green-500' : undefined}
            >
              {total}% Total Traffic
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedTemplates.map((template, index) => (
              <div key={`${template.templateCode}-${index}`} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                {editingTemplate && editingTemplate.countryCode === countryCode && editingTemplate.templateCode === template.templateCode ? (
                  <div className="flex items-center space-x-4 w-full">
                    <Input
                      value={editingTemplate.templateCode}
                      onChange={(e) => {
                        setEditingTemplate({
                          ...editingTemplate,
                          templateCode: e.target.value
                        });
                      }}
                      placeholder="Template Code"
                      className="w-1/3"
                    />
                    <Input
                      type="number"
                      value={editingTemplate.trafficSplit}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                        setEditingTemplate({
                          ...editingTemplate,
                          trafficSplit: isNaN(value) ? 0 : value
                        });
                      }}
                      placeholder="Traffic Split"
                      className="w-1/3"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveTemplate}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTemplate(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="font-medium">{template.templateCode}</div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{template.trafficSplit}% Traffic</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTemplate(countryCode, templates[sortedIndices[index]], sortedIndices[index])}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(countryCode, sortedIndices[index])}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddTemplate(countryCode)}
              className="w-full"
            >
              Add Template
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Dialog open={showAddTemplateDialog} onOpenChange={setShowAddTemplateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="templateCode">Template Code</label>
              <Input
                id="templateCode"
                value={newTemplate.templateCode}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, templateCode: e.target.value }))}
                placeholder="Enter template code"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="trafficSplit">Traffic Split</label>
              <Input
                id="trafficSplit"
                type="number"
                value={newTemplate.trafficSplit}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, trafficSplit: parseInt(e.target.value) || 0 }))}
                placeholder="Enter traffic split"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddTemplateDialog(false);
                setNewTemplate({templateCode: '', trafficSplit: 0});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNewTemplate}>Add Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">App ID</label>
              <Input
                type="text"
                value={request.aid}
                onChange={(e) => handleRequestChange('aid', e.target.value)}
                placeholder="Enter App ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Channel</label>
              <Select value={request.channel} onValueChange={(value) => handleRequestChange('channel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OTP">OTP</SelectItem>
                  <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                  <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Communication Mode</label>
              <Select value={request.communicationMode} onValueChange={(value) => handleRequestChange('communicationMode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Loading...' : 'Fetch Templates'}
            </Button>
            {templateData && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchTemplateData()}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Refresh
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleUpdateTemplate}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </>
            )}
          </div>
          {templateData && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Default Template Code</label>
              <Input
                value={defaultTemplateCode}
                onChange={(e) => setDefaultTemplateCode(e.target.value)}
                placeholder="Enter default template code"
                className="w-full"
              />
            </div>
          )}

        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {templateData && !error && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Configuration</CardTitle>
                <CardDescription>System-wide template settings</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <div className="text-sm text-muted-foreground">Button Status</div>
                  <div className="font-medium mt-1 flex items-center justify-between">
                    <Badge 
                      variant={templateData?.buttonEnabled ? 'default' : 'secondary'}
                      className={cn(templateData?.buttonEnabled && 'bg-green-500')}
                    >
                      {templateData?.buttonEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleButton}
                    >
                      Toggle
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <div className="text-sm text-muted-foreground">Load Balancing</div>
                  <div className="font-medium mt-1 flex items-center justify-between">
                    <Badge 
                      variant={templateData?.loadBalancingEnabled ? 'default' : 'secondary'}
                      className={cn(templateData?.loadBalancingEnabled && 'bg-green-500')}
                    >
                      {templateData?.loadBalancingEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleLoadBalancing}
                    >
                      Toggle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCountry(true)}
                >
                  Add Country Code
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowJsonInput(true)}
                >
                  Import JSON
                </Button>
              </div>

              {showAddCountry && (
                <div className="p-4 border rounded-lg space-y-4">
                  <h3 className="font-medium">Add New Country Code</h3>
                  <div className="flex gap-4">
                    <Input
                      value={newCountryCode}
                      onChange={(e) => setNewCountryCode(e.target.value)}
                      placeholder="Enter country code"
                      className="w-1/3"
                    />
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => {
                        if (!templateData || !newCountryCode) return;
                        setTemplateData({
                          ...templateData,
                          loadBalanceTemplates: {
                            ...templateData.loadBalanceTemplates,
                            [newCountryCode]: []
                          }
                        });
                        setNewCountryCode('');
                        setShowAddCountry(false);
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setNewCountryCode('');
                        setShowAddCountry(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {showJsonInput && (
                <div className="p-4 border rounded-lg space-y-4">
                  <h3 className="font-medium">Import JSON Configuration</h3>
                  <div className="space-y-4">
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder="Paste your JSON configuration here"
                      className="w-full h-48 p-2 border rounded-lg font-mono text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => {
                          try {
                            const parsedJson = JSON.parse(jsonInput);
                            if (!templateData) return;
                            
                            setTemplateData({
                              ...templateData,
                              loadBalanceTemplates: {
                                ...templateData.loadBalanceTemplates,
                                ...parsedJson
                              }
                            });
                            setJsonInput('');
                            setShowJsonInput(false);
                            toast({
                              title: 'Success',
                              description: 'JSON configuration imported successfully',
                            });
                          } catch (error) {
                            toast({
                              title: 'Error',
                              description: 'Invalid JSON format',
                              variant: 'destructive',
                            });
                          }
                        }}
                      >
                        Import
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setJsonInput('');
                          setShowJsonInput(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(templateData?.loadBalanceTemplates || {}).map(([countryCode, templates]) => 
                  renderTemplateCard(countryCode, templates)
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateConfig;