import React, { useState } from 'react';
import { Search, Timer, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RateLimit } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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

const RateLimitCard = ({ 
  limit,
  aid, 
  onUpdate,
  isUpdating 
}: { 
  limit: RateLimit;
  aid: string;
  onUpdate: (aid: string, restrictionType: string, limit: number) => void;
  isUpdating: boolean;
}) => {
  const [newRequest, setNewRequest] = useState(limit.limits.request.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    const requestValue = parseInt(newRequest);
    if (!isNaN(requestValue) && requestValue > 0) {
      onUpdate(aid, limit.restrictionType, requestValue);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg border shadow-sm p-4 space-y-3"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {limit.restrictionType}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Status: <span className={limit.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}>
              {limit.status}
            </span>
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          limit.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          ID: {limit.id}
        </span>
      </div>

      <div className="bg-gray-50 rounded-md p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-500">Limit:</span>{' '}
            <span className="font-medium">
              {limit.limits.request} requests
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Per:</span>{' '}
            <span className="font-medium">
              {limit.limits.value} {limit.limits.unit.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        {isEditing ? (
          <>
            <Input
              type="number"
              value={newRequest}
              onChange={(e) => setNewRequest(e.target.value)}
              className="w-32"
              min="1"
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isUpdating}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isUpdating ? 'Updating...' : 'Submit'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setNewRequest(limit.limits.request.toString());
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Edit Limit
          </Button>
        )}
      </div>
    </motion.div>
  );
};

const RateLimit = () => {
  const [searchInput, setSearchInput] = useState('');
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
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
    setRateLimits([]);

    const trimmedAid = searchInput.trim();
    if (!trimmedAid) {
      setError('Please enter a valid App ID');
      setIsLoading(false);
      return;
    }

    try {
      const response = await ApiService.getRateLimitInfo(trimmedAid);
      if (response.statusCode === 200) {
        setRateLimits(response.data);
      } else {
        setError('No rate limits found for the provided App ID');
      }
    } catch (err) {
      setError('Failed to fetch rate limit information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLimit = async (aid: string, restrictionType: string, limit: number) => {
    setIsUpdating(true);
    try {
      const response = await ApiService.updateRateLimit(aid, restrictionType, limit);
      
      if (response.statusCode === 200) {
        setRateLimits(prev => prev.map(rateLimit => 
          rateLimit.restrictionType === restrictionType
            ? { ...rateLimit, limits: { ...rateLimit.limits, request: limit } }
            : rateLimit
        ));
        
        toast({
          title: "Rate Limit Updated",
          description: "The rate limit has been successfully updated.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update the rate limit. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while updating the rate limit.",
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
          <Timer className="h-8 w-8 text-blue-500 mr-3" />
          <span className="hidden sm:inline">Rate Limit Management</span>
          <span className="sm:hidden">Rate Limits</span>
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
              {rateLimits.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-gray-500">
                      No rate limits found for this App ID.
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {rateLimits.map((limit) => (
                      <RateLimitCard
                        key={limit.id}
                        limit={limit}
                        aid={searchInput.trim()}
                        onUpdate={handleUpdateLimit}
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

export default RateLimit;