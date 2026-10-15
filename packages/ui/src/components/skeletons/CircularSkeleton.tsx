import { Skeleton } from './Skeleton';

interface CircularSkeletonProps {
    size?: number;
    strokeWidth?: number;
}

export const CircularSkeleton = ({ size = 150, strokeWidth = 12 }: CircularSkeletonProps) => (
    <div
        aria-hidden="true"
        className="flex flex-col items-center rounded-3xl border border-main-text/10 bg-core-bg p-6 text-center"
    >
        <Skeleton className="mb-4 h-4 w-32" />

        <Skeleton className="relative my-2 rounded-full" style={{ width: size, height: size }}>
            <div className="absolute rounded-full bg-core-bg" style={{ inset: strokeWidth }} />
        </Skeleton>

        <Skeleton className="mt-4 h-3 w-24" />
    </div>
);