import { useId } from 'react';
import { cn } from '../utils/cn';

export interface ProgressBarProps {
    value: number;
    max?: number;
    variant?: 'circular' | 'linear';
    label?: string;
    subLabel?: string;
    caption?: string;
    size?: number;
    strokeWidth?: number;
    color?: string;
    threshold?: number;
    onActionClick?: () => void;
    actionText?: string;
}

type Tone = 'danger' | 'warning' | 'success';

const getTone = (percentage: number): Tone => {
    if (percentage < 25) return 'danger';
    if (percentage < 80) return 'warning';
    return 'success';
};

const TONES: Record<Tone, { stroke: string; bar: string }> = {
    danger: { stroke: 'stroke-danger', bar: 'bg-danger' },
    warning: { stroke: 'stroke-warning', bar: 'bg-warning' },
    success: { stroke: 'stroke-success', bar: 'bg-success' },
};

export const ProgressBar = ({
    value,
    max = 100,
    variant = 'circular',
    label,
    subLabel,
    caption = 'Maîtrisé',
    size = 150,
    strokeWidth = 12,
    color,
    threshold,
    onActionClick,
    actionText,
}: ProgressBarProps) => {
    const labelId = useId();

    const clamped = Math.min(Math.max(value, 0), max);
    const percentage = max > 0 ? Math.round((clamped / max) * 100) : 0;
    const tone = TONES[getTone(percentage)];
    const hasThreshold = threshold !== undefined && threshold > 0 && threshold < 100;

    const progressAria = {
        role: 'progressbar' as const,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': percentage,
        'aria-valuetext': `${percentage} %${hasThreshold ? `, seuil à ${threshold} %` : ''}`,
        ...(label ? { 'aria-labelledby': labelId } : { 'aria-label': 'Progression' }),
    };

    if (variant === 'linear') {
        return (
            <div className="rounded-2xl border border-main-text/10 bg-core-bg p-5">
                {(label || subLabel) && (
                    <div className="mb-3 flex items-baseline justify-between gap-4">
                        <div>
                            {label && (
                                <h4 id={labelId} className="text-sm font-semibold text-main-text">
                                    {label}
                                </h4>
                            )}
                            {subLabel && <p className="text-xs text-sub-text">{subLabel}</p>}
                        </div>
                        <span className="text-sm font-bold tabular-nums text-main-text">{percentage}%</span>
                    </div>
                )}

                <div
                    {...progressAria}
                    className="relative h-3 overflow-hidden rounded-full bg-core-bg shadow-neu-pressed"
                >
                    <div
                        className={cn(
                            'h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none',
                            !color && tone.bar
                        )}
                        style={{ width: `${percentage}%`, ...(color && { backgroundColor: color }) }}
                    />
                    {hasThreshold && (
                        <span
                            aria-hidden="true"
                            className="absolute inset-y-0 w-0.5 bg-main-text/40"
                            style={{ left: `${threshold}%` }}
                        />
                    )}
                </div>
            </div>
        );
    }

    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - percentage / 100);

    const tick = (() => {
        if (!hasThreshold) return null;
        const angle = (threshold / 100) * 2 * Math.PI;
        const r1 = radius - strokeWidth / 2 - 4;
        const r2 = radius + strokeWidth / 2 + 4;
        return {
            x1: center + r1 * Math.cos(angle),
            y1: center + r1 * Math.sin(angle),
            x2: center + r2 * Math.cos(angle),
            y2: center + r2 * Math.sin(angle),
        };
    })();

    return (
        <div className="flex flex-col items-center rounded-3xl border border-main-text/10 bg-core-bg p-6 text-center">
            {label && (
                <h3 id={labelId} className="mb-1 text-base font-bold text-main-text">
                    {label}
                </h3>
            )}
            {subLabel && <p className="mb-4 text-xs text-sub-text">{subLabel}</p>}

            <div
                {...progressAria}
                className="relative my-2 flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                <svg
                    width={size}
                    height={size}
                    className="-rotate-90 overflow-visible"
                    aria-hidden="true"
                >
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        strokeWidth={strokeWidth}
                        className="stroke-main-text/10"
                    />
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className={cn(
                            'transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none',
                            !color && tone.stroke
                        )}
                        style={color ? { stroke: color } : undefined}
                    />
                    {tick && (
                        <line
                            {...tick}
                            strokeWidth={2}
                            strokeLinecap="round"
                            className="stroke-main-text/50"
                        />
                    )}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="font-extrabold tabular-nums text-main-text"
                        style={{ fontSize: Math.round(size * 0.2) }}
                    >
                        {percentage}%
                    </span>
                    {caption && <span className="text-xs font-medium text-sub-text">{caption}</span>}
                </div>
            </div>

            {actionText && (
                <button
                    type="button"
                    onClick={onActionClick}
                    className="mt-4 rounded text-xs font-semibold text-secondary-strong underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};