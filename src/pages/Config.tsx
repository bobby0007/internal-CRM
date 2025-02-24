import React, { useState } from 'react';
import { Search, Sliders, AlertCircle, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MerchantConfig } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import ApiService from '../services/api';

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    ))}
  </div>
);

const ConfigCard = ({ 
  config,
  aid, 
  onUpdate,
  isUpdating 
}: { 
  config: MerchantConfig;
  aid: string;
  onUpdate: (aid: string, type: string, value: string | boolean, status: string) => void;
  isUpdating: boolean;
}) => {
  const [localValue, setLocalValue] = useState(config.value);
  const [localStatus, setLocalStatus] = useState(config.status);
  const [isDirty, setIsDirty] = useState(false);

  const handleSubmit = () => {
    if (config.inputValue === 'boolean') {
      onUpdate(aid, config.type, localValue === 'TRUE', localStatus);
    } else {
      onUpdate(aid, config.type, localValue || '', localStatus);
    }
    setIsDirty(false);
  };

  const handleValueChange = (value: string | boolean) => {
    setLocalValue(typeof value === 'boolean' ? (value ? 'TRUE' : 'FALSE') : value);
    setIsDirty(true);
  };

  const handleStatusChange = (checked: boolean) => {
    setLocalStatus(checked ? 'ACTIVE' : 'INACTIVE');
    setIsDirty(true);
  };

  const formatConfigType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg border shadow-sm p-4 space-y-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {formatConfigType(config.type)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Type: {config.inputValue}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            localStatus === 'ACTIVE' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {localStatus}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {config.inputValue === 'boolean' ? (
          <>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Power className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Status</span>
              </div>
              <Switch
                checked={localStatus === 'ACTIVE'}
                onCheckedChange={handleStatusChange}
                disabled={isUpdating}
              />
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div>
                <span className="text-sm font-medium text-gray-700">Value</span>
                <p className="text-xs text-gray-500 mt-1">Toggle to enable/disable this feature</p>
              </div>
              <Switch
                checked={localValue === 'TRUE'}
                onCheckedChange={(checked) => handleValueChange(checked)}
                disabled={isUpdating || localStatus === 'INACTIVE'}
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Input
              type="number"
              value={localValue || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-full"
              placeholder="Enter value"
              disabled={isUpdating || localStatus === 'INACTIVE'}
            />
          </div>
        )}

        {isDirty && (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setLocalValue(config.value);
                setLocalStatus(config.status);
                setIsDirty(false);
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isUpdating}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isUpdating ? 'Updating...' : 'Submit Changes'}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Config = () => {
  const [searchInput, setSearchInput] = useState('');
  const [configs, setConfigs] = useState<MerchantConfig[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setConfigs([]);

    const trimmedAid = searchInput.trim();
    if (!trimmedAid) {
      setError('Please enter a valid App ID');
      setIsLoading(false);
      return;
    }

    try {
      const response = await ApiService.getMerchantConfigInfo(trimmedAid);
      if (response.statusCode === 200) {
        setConfigs(response.data);
      } else {
        setError('No configuration found for the provided App ID');
      }
    } catch (err) {
      setError('Failed to fetch configuration information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConfig = async (aid: string, type: string, value: string | boolean, status: string) => {
    setIsUpdating(true);
    try {
      const response = await ApiService.updateMerchantConfig(aid, type, value, status);
      
      if (response.statusCode === 200) {
        setConfigs(prev => prev.map(config => 
          config.type === type
            ? { 
                ...config, 
                value: value.toString().toUpperCase(),
                status: status as "ACTIVE" | "INACTIVE"
              }
            : config
        ));
        
        toast({
          title: "Configuration Updated",
          description: "The configuration has been successfully updated.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update the configuration. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while updating the configuration.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Sliders className="h-8 w-8 text-blue-500 mr-3" />
          <span className="hidden sm:inline">Merchant Configuration</span>
          <span className="sm:hidden">Configuration</span>
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
                placeholder="Enter App ID..."
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {hasSearched && (
        <div className="space-y-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {configs.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-gray-500">
                      No configuration found for this App ID.
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {configs.map((config) => (
                      <ConfigCard
                        key={config.type}
                        config={config}
                        aid={searchInput.trim()}
                        onUpdate={handleUpdateConfig}
                        isUpdating={isUpdating}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Config;