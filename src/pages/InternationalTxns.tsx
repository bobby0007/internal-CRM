import React, { useState } from 'react';
import { Globe2, Search } from 'lucide-react';
import { clsx } from 'clsx';
import type { Merchant, MerchantStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
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
              International Transactions
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
                <div className="h-4 bg-gray-200 rounded w-32"></div>
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

const MerchantCard = ({ merchant, onToggle, isUpdating }: {
  merchant: Merchant;
  onToggle: (mid: string, status: boolean) => void;
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
    
    <div className="flex items-center justify-between">
      <span
        className={clsx(
          'px-3 py-1 text-sm leading-5 font-semibold rounded-full',
          merchant.internationalTxns
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        )}
      >
        {merchant.internationalTxns ? 'Enabled' : 'Disabled'}
      </span>
      <button
        onClick={() => onToggle(merchant.mid, merchant.internationalTxns)}
        disabled={isUpdating}
        className={clsx(
          'px-4 py-2 rounded-md text-sm font-medium text-white transition-colors duration-150',
          {
            'bg-red-500 hover:bg-red-600': merchant.internationalTxns,
            'bg-green-500 hover:bg-green-600': !merchant.internationalTxns,
            'opacity-50 cursor-not-allowed': isUpdating
          }
        )}
      >
        {isUpdating
          ? 'Updating...'
          : merchant.internationalTxns
          ? 'Disable'
          : 'Enable'}
      </button>
    </div>
  </div>
);

const InternationalTxns = () => {
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
          status: response.data.status as MerchantStatus,
          internationalTxns: response.data.internationalEnabled,
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

  const handleToggleInternational = async (mid: string, currentStatus: boolean) => {
    setIsUpdating(true);
    try {
      const response = await ApiService.updateInternationalStatus(mid, !currentStatus);

      if (response.statusCode === 200) {
        setMerchant(prev => {
          if (prev && prev.mid === mid) {
            return {
              ...prev,
              internationalTxns: !currentStatus,
              lastUpdated: new Date().toISOString()
            };
          }
          return prev;
        });
      } else {
        setError('Failed to update international transaction status. Please try again.');
      }
    } catch (err) {
      setError('Failed to update international transaction status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Globe2 className="h-8 w-8 text-blue-500 mr-3" />
          <span className="hidden sm:inline">International Transactions</span>
          <span className="sm:hidden">Int'l Txns</span>
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter merchant MID..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                "w-full sm:w-auto px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isLoading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
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
                            International Transactions
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
                            <StatusBadge status={merchant.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={clsx(
                                'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full',
                                merchant.internationalTxns
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              )}
                            >
                              {merchant.internationalTxns ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleInternational(merchant.mid, merchant.internationalTxns)}
                              disabled={isUpdating}
                              className={clsx(
                                'px-4 py-2 rounded-md text-sm font-medium text-white transition-colors duration-150',
                                {
                                  'bg-red-500 hover:bg-red-600': merchant.internationalTxns,
                                  'bg-green-500 hover:bg-green-600': !merchant.internationalTxns,
                                  'opacity-50 cursor-not-allowed': isUpdating
                                }
                              )}
                            >
                              {isUpdating
                                ? 'Updating...'
                                : merchant.internationalTxns
                                ? 'Disable'
                                : 'Enable'}
                            </button>
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
                    onToggle={handleToggleInternational}
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

export default InternationalTxns;