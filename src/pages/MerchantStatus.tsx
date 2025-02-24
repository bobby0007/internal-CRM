import React, { useState } from 'react';
import { ShieldCheck, Ban, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { Merchant, MerchantStatus as MerchantStatusType } from '../types';
import StatusBadge from '../components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ApiService from '../services/api';

const LoadingSkeleton = () => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              MID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Merchant Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(3)].map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="md:hidden space-y-4 p-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  </div>
);

const MerchantCard = ({ merchant, onStatusChange, isUpdating }: {
  merchant: Merchant;
  onStatusChange: (mid: string, status: MerchantStatusType) => void;
  isUpdating: boolean;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900">{merchant.mid}</h3>
        <p className="text-sm text-gray-500">{merchant.name}</p>
      </div>
      <StatusBadge status={merchant.status} />
    </div>
    
    <div className="flex items-center justify-end">
      <Button
        variant={merchant.status === 'HARD_BLOCK' ? "default" : "destructive"}
        onClick={() => onStatusChange(merchant.mid, merchant.status)}
        disabled={isUpdating}
      >
        {isUpdating
          ? 'Updating...'
          : merchant.status === 'HARD_BLOCK'
          ? 'Activate'
          : 'Hard Block'}
      </Button>
    </div>
  </div>
);

const MerchantStatus = () => {
  const [searchInput, setSearchInput] = useState('');
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const isValidMid = (mid: string) => {
    return /^[a-zA-Z0-9]+$/.test(mid);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setMerchant(null);

    const trimmedMid = searchInput.trim();
    if (!trimmedMid) {
      setError('Please enter a valid MID');
      setIsLoading(false);
      return;
    }

    if (!isValidMid(trimmedMid)) {
      setError('MID must contain only letters and numbers (no special characters or spaces)');
      setIsLoading(false);
      return;
    }

    try {
      const response = await ApiService.getMerchantDetails(trimmedMid);

      if (response.statusCode === 200) {
        setMerchant({
          mid: trimmedMid,
          name: response.data.orgName,
          status: response.data.status as MerchantStatusType,
          internationalTxns: false,
          lastUpdated: new Date().toISOString(),
          transactionVolume: 0
        });
      } else {
        setError('No merchant found with the provided MID');
      }
    } catch (err) {
      setError('Failed to fetch merchant details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (mid: string, currentStatus: MerchantStatusType) => {
    setIsUpdating(true);
    const newStatus = currentStatus === 'HARD_BLOCK' ? 'ACTIVE' : 'HARD_BLOCK';
    
    try {
      const response = await ApiService.updateMerchantStatus(mid.trim(), newStatus);

      if (response.statusCode === 200) {
        setMerchant(prev => {
          if (prev && prev.mid === mid) {
            return {
              ...prev,
              status: newStatus as MerchantStatusType
            };
          }
          return prev;
        });
      } else {
        setError('Failed to update merchant status. Please try again.');
      }
    } catch (err) {
      setError('Failed to update merchant status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: MerchantStatusType) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'BLOCKED':
      case 'HARD_BLOCK':
      case 'SOFT_BLOCK':
        return <Ban className="h-5 w-5 text-red-500" />;
      case 'PENDING':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <ShieldCheck className="h-8 w-8 text-blue-500 mr-3" />
          <span className="hidden sm:inline">Merchant Status Management</span>
          <span className="sm:hidden">Merchant Status</span>
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
                placeholder="Enter merchant MID..."
                className="pl-10"
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      {hasSearched && (
        <>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
                {!merchant ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No merchant found matching your search criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            MID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Merchant Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {merchant.mid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {merchant.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(merchant.status)}
                              <span className="ml-2">
                                <StatusBadge status={merchant.status} />
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant={merchant.status === 'HARD_BLOCK' ? "default" : "destructive"}
                              onClick={() => handleStatusChange(merchant.mid, merchant.status)}
                              disabled={isUpdating}
                            >
                              {isUpdating
                                ? 'Updating...'
                                : merchant.status === 'HARD_BLOCK'
                                ? 'Activate'
                                : 'Hard Block'}
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Mobile View */}
              <div className="md:hidden">
                {!merchant ? (
                  <div className="bg-white rounded-lg p-6 text-center">
                    <p className="text-gray-500">No merchant found matching your search criteria.</p>
                  </div>
                ) : (
                  <MerchantCard
                    merchant={merchant}
                    onStatusChange={handleStatusChange}
                    isUpdating={isUpdating}
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MerchantStatus;