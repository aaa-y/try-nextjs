'use client';

import { ReactNode } from 'react';

type BadgeColor = 'blue' | 'green' | 'red' | 'yellow' | 'gray';

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
}

/**
 * Badge component for displaying a small piece of information
 * 
 * This component follows the Atom pattern from Atomic Design:
 * - It's a basic building block
 * - It has a single responsibility
 * - It's highly reusable
 */
export default function Badge({ children, color = 'gray' }: BadgeProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
}
