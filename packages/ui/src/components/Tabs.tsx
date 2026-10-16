import React, { createContext, useContext } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../utils/cn';

export type TabsVariant = 'underline' | 'segmented';

const TabsVariantContext = createContext<TabsVariant>('underline');

export interface TabsProps extends React.ComponentProps<typeof RadixTabs.Root> {
    variant?: TabsVariant;
}

export const Tabs = ({ variant = 'underline', ...props }: TabsProps) => (
    <TabsVariantContext.Provider value={variant}>
        <RadixTabs.Root {...props} />
    </TabsVariantContext.Provider>
);

const listStyles: Record<TabsVariant, string> = {
    underline:
        'w-full overflow-x-auto border-b border-main-text/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    segmented: 'w-fit max-w-full rounded-neu-sm bg-core-bg p-1 shadow-neu-pressed',
};

export interface TabsListProps extends React.ComponentProps<typeof RadixTabs.List> {
    'aria-label': string;
}

export const TabsList = ({ className, ...props }: TabsListProps) => {
    const variant = useContext(TabsVariantContext);
    return (
        <RadixTabs.List
            className={cn('flex items-center gap-1', listStyles[variant], className)}
            {...props}
        />
    );
};

const triggerStyles: Record<TabsVariant, string> = {
    underline: cn(
        'relative px-4 py-3 text-sub-text hover:bg-main-text/5',
        'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent after:transition-colors motion-reduce:after:transition-none',
        'data-[state=active]:text-main-text data-[state=active]:after:bg-secondary-strong'
    ),
    segmented: cn(
        'px-4 py-2.5 text-sub-text',
        'data-[state=active]:bg-container-bg data-[state=active]:text-secondary-strong data-[state=active]:shadow-neu-flat-sm'
    ),
};

export interface TabsTriggerProps extends React.ComponentProps<typeof RadixTabs.Trigger> {
    icon?: React.ReactNode;
    badge?: number | string;
}

export const TabsTrigger = ({ icon, badge, className, children, ...props }: TabsTriggerProps) => {
    const variant = useContext(TabsVariantContext);
    return (
        <RadixTabs.Trigger
            className={cn(
                'flex items-center justify-center gap-2 rounded-neu-sm text-sm font-semibold whitespace-nowrap select-none',
                'transition-[color,background-color,box-shadow] motion-reduce:transition-none',
                'data-[state=inactive]:hover:text-main-text',
                'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-secondary-strong',
                'disabled:pointer-events-none disabled:opacity-50',
                triggerStyles[variant],
                className
            )}
            {...props}
        >
            {icon && (
                <span className="shrink-0" aria-hidden="true">
                    {icon}
                </span>
            )}
            <span>{children}</span>
            {badge !== undefined && (
                <>
                    {' '}
                    <span className="min-w-5 rounded-full bg-secondary/10 px-1.5 py-0.5 text-center text-xs leading-none font-bold tabular-nums text-secondary-strong">
                        {badge}
                    </span>
                </>
            )}
        </RadixTabs.Trigger>
    );
};

export interface TabsContentProps extends React.ComponentProps<typeof RadixTabs.Content> {
    keepMounted?: boolean;
}

export const TabsContent = ({ keepMounted = false, className, ...props }: TabsContentProps) => (
    <RadixTabs.Content
        forceMount={keepMounted ? true : undefined}
        className={cn(
            'mt-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong',
            keepMounted && 'data-[state=inactive]:hidden',
            className
        )}
        {...props}
    />
);