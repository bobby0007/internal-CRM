import React, { useState } from 'react';
import type { RateLimitCountryCodeLimit } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CountryCodeRateLimitProps {
  limitList: RateLimitCountryCodeLimit[];
  isUpdating: boolean;
  onUpdate: (countryCode: string, request: number) => void;
}

const CountryCodeRateLimit: React.FC<CountryCodeRateLimitProps> = ({ limitList, isUpdating, onUpdate }) => {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCountryCode, setNewCountryCode] = useState('');
  const [newRequest, setNewRequest] = useState('');

  const handleEdit = (idx: number, current: number) => {
    setEditIdx(idx);
    setEditValue(current.toString());
  };

  const handleSave = (countryCode: string) => {
    const value = parseInt(editValue);
    if (!isNaN(value) && value > 0) {
      onUpdate(countryCode, value);
      setEditIdx(null);
    }
  };

  const handleAdd = () => {
    const requestValue = parseInt(newRequest);
    if (newCountryCode && !isNaN(requestValue) && requestValue > 0) {
      // Get the first item's value and unit to maintain consistency
      onUpdate(newCountryCode, requestValue);
      setShowAddForm(false);
      setNewCountryCode('');
      setNewRequest('');
    }
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Country Code Rate Limits</h3>
          {!showAddForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
            >
              Add New Country Code
            </Button>
          )}
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="text-sm font-medium mb-3">Add New Country Code Limit</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Country Code</label>
                <Input
                  value={newCountryCode}
                  onChange={(e) => setNewCountryCode(e.target.value)}
                  placeholder="e.g., 91"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Request Limit</label>
                <Input
                  type="number"
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)}
                  placeholder="e.g., 100"
                  className="w-full"
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCountryCode('');
                  setNewRequest('');
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={!newCountryCode || !newRequest || isUpdating}
              >
                Add Limit
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {limitList
                .sort((a, b) => {
                  // Special handling for default (empty or "default" country code)
                  if (!a.countryCode || a.countryCode === 'default') return 1;
                  if (!b.countryCode || b.countryCode === 'default') return -1;
                  // Normal string comparison for other country codes
                  return a.countryCode.localeCompare(b.countryCode);
                })
                .map((item, idx) => (
                <tr key={item.countryCode} className={(!item.countryCode || item.countryCode === 'default') ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 font-mono text-sm font-medium text-gray-900">
                    {!item.countryCode || item.countryCode === 'default' ? 'Default' : item.countryCode}
                  </td>
                  <td className="px-4 py-2">
                    {editIdx === idx ? (
                      <Input
                        type="number"
                        value={editValue}
                        min="1"
                        onChange={e => setEditValue(e.target.value)}
                        className="w-24"
                      />
                    ) : (
                      item.request
                    )}
                  </td>
                  <td className="px-4 py-2">{item.value}</td>
                  <td className="px-4 py-2">{item.unit.toLowerCase()}</td>
                  <td className="px-4 py-2">
                    {editIdx === idx ? (
                      <>
                        <Button size="sm" onClick={() => handleSave(item.countryCode)} disabled={isUpdating}>
                          {isUpdating ? 'Saving...' : 'Save'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditIdx(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(idx, item.request)}>
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryCodeRateLimit;
