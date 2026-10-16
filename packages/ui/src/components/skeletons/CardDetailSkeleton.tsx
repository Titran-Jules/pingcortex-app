import { Skeleton } from './Skeleton';

export const CardDetailSkeleton = () => (
    <div
        aria-hidden="true"
        className="flex w-full flex-col gap-4 rounded-3xl border border-main-text/10 bg-core-bg p-6"
    >
        <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="space-y-2 py-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
    </div>
);