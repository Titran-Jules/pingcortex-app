import React from 'react';

export interface ProgressBarProps {
    value: number;
    max?: number;
    variant?: 'circular' | 'linear';
    label?: string;
    subLabel?: string;
    size?: number;
    strokeWidth?: number;
    color?: string;
    onActionClick?: () => void;
    actionText?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    variant = 'circular',
    label,
    subLabel,
    size = 150,
    strokeWidth = 12,
    color = '#6366f1',
    onActionClick,
    actionText
}) => {

    const colorsByValue = (value: number) => {
        if (value < 25) {
            return '#BE123C';
        } else if (value < 80) {
            return '#A16207';
        } else {
            return '#15803D';
        }
    }

    const clampedValue = Math.min(Math.max(value, 0), max);
    const percentage = Math.round((clampedValue / max) * 100);

    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const accessibleLabel = label ? `${label}, ${percentage}% complété` : `Progression : ${percentage}%`;

    if (variant === 'linear') {
        return (
        <div className="p-6 rounded-2xl bg-core-bg shadow-neu-flat transition-all duration-300"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={accessibleLabel}
        >
            {(label || subLabel) && (
            <div className="flex justify-between items-center mb-3">
                <div>
                    {label && <h4 className="font-semibold text-main-text text-sm">{label}</h4>}
                    {subLabel && <p className="text-xs text-sub-text">{subLabel}</p>}
                </div>
                <span className="text-sm font-bold text-sub-text">{percentage}%</span>
            </div>
            )}
            <div className="w-full h-4 rounded-full bg-core-bg shadow-neu-pressed overflow-hidden p-0.5">
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out motion-reduce:transition-non"
                    style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}66`
                    }}
                />
                </div>
        </div>
        );
    }

    return (
        <div className="p-6 rounded-3xl bg-core-bg shadow-neu-flat flex flex-col items-center text-center transition-all duration-300"
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={accessibleLabel}
        >
            {label && <h3 className="font-bold text-main-text text-base mb-1">{label}</h3>}
            {subLabel && <p className="text-xs text-sub-text mb-4">{subLabel}</p>}

        <div className="relative flex items-center justify-center my-2" style={{ width: size, height: size }} role='progressbar' >
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-sub-text/10
                    "
                />
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colorsByValue(clampedValue)}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-sub-text">{percentage}%</span>
                <span className="text-[10px] uppercase tracking-wider text-sub-text font-medium">Maîtrisé</span>
            </div>
        </div>

        {actionText && (
            <button
            onClick={onActionClick}
            className="mt-4 text-xs font-semibold text-secondary hover:underline transition-colors"
            >
            {actionText}
            </button>
        )}
        </div>
    );
};