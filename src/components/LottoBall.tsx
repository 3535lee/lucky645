'use client'

import { getBallColor } from '@/lib/utils';

interface LottoBallProps {
  number: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  isBonus?: boolean;
}

export default function LottoBall({ number, size = 'md', isBonus = false }: LottoBallProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 lg:w-16 lg:h-16 text-base lg:text-xl',
    lg: 'w-12 h-12 lg:w-20 lg:h-20 text-lg lg:text-2xl',
    xl: 'w-8 h-8 md:w-14 md:h-14 text-sm md:text-xl',
    xxl: 'w-8 h-8 md:w-16 md:h-16 text-sm md:text-2xl'
  };

  const colorClass = getBallColor(number);
  const sizeClass = sizeClasses[size];
  const bonusClass = isBonus ? 'ring-2 ring-orange-400' : '';
  
  // Use simple string concatenation to ensure identical rendering
  const className = sizeClass + ' ' + colorClass + ' rounded-full flex items-center justify-center font-bold shadow-md' + (bonusClass ? ' ' + bonusClass : '');

  return (
    <div className={className}>
      {number}
    </div>
  );
}