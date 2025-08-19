'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface ResponsiveTableCellProps {
  children: React.ReactNode;
  className?: string;
  label?: string; // For mobile view
  hideOnMobile?: boolean;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          {children}
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {children}
      </div>
    </div>
  );
}

export function ResponsiveTableHeader({ children, className }: ResponsiveTableProps) {
  return (
    <thead className={cn("bg-gray-50 hidden md:table-header-group", className)}>
      {children}
    </thead>
  );
}

export function ResponsiveTableBody({ children, className }: ResponsiveTableProps) {
  return (
    <tbody className={cn("bg-white divide-y divide-gray-200 hidden md:table-row-group", className)}>
      {children}
    </tbody>
  );
}

export function ResponsiveTableRow({ children, className, onClick }: ResponsiveTableRowProps) {
  return (
    <>
      {/* Desktop Row */}
      <tr 
        className={cn("hidden md:table-row hover:bg-gray-50", onClick && "cursor-pointer", className)}
        onClick={onClick}
      >
        {children}
      </tr>
      
      {/* Mobile Card */}
      <div 
        className={cn(
          "md:hidden bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3",
          onClick && "cursor-pointer hover:shadow-md transition-shadow",
          className
        )}
        onClick={onClick}
      >
        {children}
      </div>
    </>
  );
}

export function ResponsiveTableCell({ children, className, label, hideOnMobile }: ResponsiveTableCellProps) {
  if (hideOnMobile) {
    return (
      <td className={cn("hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900", className)}>
        {children}
      </td>
    );
  }

  return (
    <>
      {/* Desktop Cell */}
      <td className={cn("hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900", className)}>
        {children}
      </td>
      
      {/* Mobile Row */}
      <div className="md:hidden flex justify-between items-center">
        {label && (
          <span className="text-sm font-medium text-gray-500">{label}:</span>
        )}
        <div className={cn("text-sm text-gray-900", className)}>
          {children}
        </div>
      </div>
    </>
  );
}

export function ResponsiveTableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", className)}>
      {children}
    </th>
  );
}

// Utility component for action buttons in mobile view
export function MobileTableActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:hidden flex justify-end space-x-2 pt-2 border-t border-gray-100 mt-2">
      {children}
    </div>
  );
}
