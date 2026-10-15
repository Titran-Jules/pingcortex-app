import { Skeleton } from './Skeleton';

export const CardListSkeleton = () => (
    <div
        aria-hidden="true"
        className="flex w-full items-center gap-4 rounded-2xl border border-main-text/10 bg-core-bg p-5"
    >
        <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />

        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    </div>
);