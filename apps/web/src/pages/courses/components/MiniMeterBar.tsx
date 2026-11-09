import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@pingcortex/ui';

type MeterTone = 'danger' | 'warning' | 'success';

const getTone = (percentage: number): MeterTone => {
    if (percentage < 25) return 'danger';
    if (percentage < 80) return 'warning';
    return 'success';
};

const TONES: Record<MeterTone, string> = {
    danger: 'bg-danger',
    warning: 'bg-warning',
    success: 'bg-success',
};

export interface MiniMeterBarProps extends ComponentPropsWithoutRef<'div'> {
    value: number;
    ariaLabel: string;
}

export const MiniMeterBar = ({ value, ariaLabel, className, ...props }: MiniMeterBarProps) => {
    const clamped = Math.min(Math.max(Math.round(value), 0), 100);
    const tone = TONES[getTone(clamped)];

    return (
        <div
            role="progressbar"
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clamped}
            className={cn(
                'relative h-1.5 w-full overflow-hidden rounded-full bg-core-bg shadow-neu-pressed-sm',
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    'h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none',
                    tone
                )}
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
};
