import { getBallColor } from '@/lib/utils';

interface LottoBallProps {
  number: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isBonus?: boolean;
}

export default function LottoBall({ number, size = 'md', isBonus = false }: LottoBallProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const colorClass = getBallColor(number);

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${colorClass}
      rounded-full 
      flex 
      items-center 
      justify-center 
      font-bold 
      shadow-md
      ${isBonus ? 'ring-2 ring-orange-400' : ''}
    `}>
      {number}
    </div>
  );
}