import type { CourseResponse } from "@pingcortex/shared-types";
import { useUpdateCourseActivity } from "../../../hooks/queries/useCourses";
import { AnalysisStatusBadge, NeumorphicCard, toast } from "@pingcortex/ui";
import { getErrorMessage } from "../../../errors/getErrorMessage";
import { NavLink } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ActiveToggle } from "./ActiveToggle";

export const CourseCard: React.FC<{ course: CourseResponse }> = ({ course }) => {
    const toggleActivity = useUpdateCourseActivity();

    const open = () =>
        toggleActivity.mutate(
            { courseId: course.id, isActive: !course.isActive },
            {
                onSuccess: (updated) =>
                    updated.isActive
                        ? toast.success('Cours activé', {
                              description: "Les révisions du jour s'appuient désormais sur ce cours.",
                          })
                        : toast.info('Cours mis en veille', {
                              description: 'Il reste consultable mais sort de la rotation des révisions.',
                          }),
                onError: (mutationError) =>
                    toast.error('Activation impossible', { description: getErrorMessage(mutationError) }),
            }
        );

    return (
        <NeumorphicCard variant="flat" className="flex h-full flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-main-text">{course.title}</h3>
                <AnalysisStatusBadge status={course.analysisStatus} size="sm" />
            </div>

            <p className="line-clamp-2 text-sm text-sub-text">{course.description}</p>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-main-text/10 pt-4">
                <NavLink
                    to={`/courses/${course.id}`}
                    className="inline-flex items-center gap-1.5 rounded-neu-sm text-sm font-semibold text-secondary-strong transition-colors hover:text-main-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-strong"
                >
                    Ouvrir le cours
                    <ArrowUpRight size={14} aria-hidden="true" />
                </NavLink>
                <ActiveToggle course={course} isBusy={toggleActivity.isPending} onToggle={open} />
            </div>
        </NeumorphicCard>
    );
};