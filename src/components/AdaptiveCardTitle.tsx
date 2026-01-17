import { cn } from '@/lib/utils';
import { CardTitle as CardTitlePrimitive } from '@/components/ui/card';

// AdaptiveCardTitle component props interface
interface AdaptiveCardTitleProps {
  children: React.ReactNode;
  className?: string;
  completed?: boolean;
}

// AdaptiveCardTitle Component
export const AdaptiveCardTitle = ({
  children,
  className,
  completed
}: AdaptiveCardTitleProps) => {
  return (
    <CardTitlePrimitive
      className={cn(
        "text-xl font-bold leading-tight select-none text-center flex justify-center items-center",
        "max-w-full break-words hyphens-auto",
        "data-[size=small]:text-lg data-[size=large]:text-2xl",
        "data-[theme=dark]:text-white data-[theme=light]:text-gray-900",
        "adaptive-title",
        "flex-center-all quantum-symmetry",
        completed && "line-through text-gray-400 opacity-70",
        className
      )}
      data-adaptive="true"
    >
      {children}
    </CardTitlePrimitive>
  );
};