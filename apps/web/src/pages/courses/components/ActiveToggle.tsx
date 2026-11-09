import type { CourseResponse } from "@pingcortex/shared-types";

export const ActiveToggle: React.FC<{
    course: CourseResponse;
    isBusy: boolean;
    onToggle: () => void;
}> = ({ course, isBusy, onToggle }) => (
    <button
        type="button"
        role="switch"
        aria-checked={course.isActive}
        aria-label={course.isActive ? 'Mettre le cours en veille' : 'Activer le cours'}
        title={course.isActive ? 'Mettre en veille' : 'Activer'}
        onClick={onToggle}
        disabled={isBusy}
        className={
            'inline-flex items-center gap-1.5 rounded-neu-sm px-3 py-2 text-xs font-bold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 ' +
            (course.isActive
                ? 'bg-success text-on-success shadow-glow-success'
                : 'bg-container-bg text-sub-text shadow-neu-flat-sm hover:text-main-text')
        }
    >
        <span
            className={
                'h-2 w-2 rounded-full ' + (course.isActive ? 'bg-on-success' : 'bg-main-text/40')
            }
            aria-hidden="true"
        />
        {course.isActive ? 'Actif' : 'En veille'}
    </button>
);
