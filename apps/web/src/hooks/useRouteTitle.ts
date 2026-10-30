import { useMatches } from 'react-router-dom';
import { useCourse } from './queries/useCourse';
import { isUuid } from '../lib/uuid';

export interface RouteTitleHandle {
    title: string;
    /** Le titre du cours réel prime sur le titre de la route (détail) */
    courseTitle?: true;
}

const FALLBACK_TITLE = "Espace d'apprentissage";

export const useRouteTitle = () => {
    const matches = useMatches();

    const courseMatch = matches.find(
        (match) => (match.handle as RouteTitleHandle | undefined)?.courseTitle
    );
    const courseId = courseMatch?.params['courseId'];
    const { data: course } = useCourse(isUuid(courseId) ? courseId : undefined);

    let title = FALLBACK_TITLE;
    for (const match of matches) {
        const handle = match.handle as RouteTitleHandle | undefined;
        if (handle?.title) {
            title = handle.title;
        }
    }

    return course?.title ?? title;
};
