import React from 'react';
import { MerchantStatus } from '../types';
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: MerchantStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        'status-badge',
        {
          'status-active': status === 'ACTIVE',
          'status-blocked': status === 'BLOCKED' || status === 'HARD_BLOCK' || status === 'SOFT_BLOCK',
          'status-pending': status === 'PENDING',
        }
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;