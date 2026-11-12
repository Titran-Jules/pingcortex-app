import type React from 'react';
import { Badge } from '@pingcortex/ui';
import { CalendarClock, Edit3, HelpCircle } from 'lucide-react';
import type { ActivityType } from '@pingcortex/shared-types';

export const ActivityBadge: React.FC<{ activity?: ActivityType }> = ({ activity }) => {
    if (!activity) {
        return (
            <Badge variant="neutral" size="sm" leftIcon={<CalendarClock size={13} />}>
                À réviser
            </Badge>
        );
    }
    if (activity === 'QUIZ') {
        return (
            <Badge variant="primary" size="sm" leftIcon={<HelpCircle size={13} />}>
                Quiz
            </Badge>
        );
    }
    return (
        <Badge variant="secondary" size="sm" leftIcon={<Edit3 size={13} />}>
            Feynman
        </Badge>
    );
};
