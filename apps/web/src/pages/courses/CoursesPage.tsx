import React, { useState } from 'react';
import { Button, Modal, SoftInput, toast } from '@pingcortex/ui';
import { BookOpen, Plus, RotateCcw, Sparkles, TriangleAlert } from 'lucide-react';
import type { CourseResponse } from '@pingcortex/shared-types';
import { useCourses, useCreateCourse } from '../../hooks/queries/useCourses';
import { getErrorMessage } from '../../errors/getErrorMessage';
import { CourseCard } from './components/CourseCard';

const isAnalysisInProgress = (course: CourseResponse) =>
    course.analysisStatus === 'PENDING' || course.analysisStatus === 'ANALYZING';

const buildSummary = (courses: CourseResponse[]): string => {
    const total = courses.length;
    const activeCount = courses.filter((course) => course.isActive).length;
    const analyzingCount = courses.filter(isAnalysisInProgress).length;
    return [
        `${total} cours`,
        activeCount > 0 ? `${activeCount} actif${activeCount > 1 ? 's' : ''}` : undefined,
        analyzingCount > 0 ? `${analyzingCount} en analyse` : undefined,
    ]
        .filter(Boolean)
        .join(' · ');
};

export const CoursesPage: React.FC = () => {
    const {
        data: courses,
        isPending,
        isError,
        error,
        refetch,
    } = useCourses();

    const createCourse = useCreateCourse();
    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const canCreate = title.trim().length > 0 && description.trim().length > 0 && !createCourse.isPending;

    const handleSubmit = () => {
        if (!canCreate) return;
        createCourse.mutate(
            { title: title.trim(), description: description.trim() },
            {
                onSuccess: () => {
                    setModalOpen(false);
                    setTitle('');
                    setDescription('');
                    toast.success('Cours créé', {
                        description: "L'analyse IA va extraire les concepts : comptez une à deux minutes.",
                    });
                },
                onError: (mutationError) =>
                    toast.error('Création impossible', { description: getErrorMessage(mutationError) }),
            }
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-container-bg text-secondary shadow-neu-flat-sm">
                        <BookOpen size={20} />
                    </div>
                    {courses && courses.length > 0 && (
                        <p className="text-xs text-sub-text">{buildSummary(courses)}</p>
                    )}
                </div>
                <Button
                    variant="generate"
                    leftIcon={<Plus size={16} />}
                    onClick={() => setModalOpen(true)}
                >
                    Ajouter un cours
                </Button>
            </div>

            {isPending && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-48 animate-pulse rounded-neu-md bg-container-bg" />
                    ))}
                </div>
            )}

            {isError && !courses && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-core-bg py-16 text-center shadow-neu-flat">
                    <TriangleAlert className="text-amber-500" size={28} />
                    <p className="text-sm font-bold text-sub-text">{getErrorMessage(error)}</p>
                    <Button variant="secondary" size="sm" leftIcon={<RotateCcw size={14} />} onClick={() => refetch()}>
                        Réessayer
                    </Button>
                </div>
            )}

            {courses && courses.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-core-bg py-16 text-center shadow-neu-flat">
                    <BookOpen size={28} className="text-sub-text" />
                    <p className="text-sm font-bold text-main-text">Aucun cours pour le moment</p>
                    <p className="max-w-md text-sm text-sub-text">
                        Créez votre premier cours : collez la matière du cours et laissez l'IA en extraire les
                        concepts.
                    </p>
                    <Button
                        variant="generate"
                        isGlowing
                        leftIcon={<Sparkles size={16} />}
                        onClick={() => setModalOpen(true)}
                    >
                        Ajouter un cours
                    </Button>
                </div>
            )}

            {courses && courses.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}

            <Modal
                open={modalOpen}
                onOpenChange={setModalOpen}
                title="Ajouter un cours"
                description="L'analyse IA peut prendre une à deux minutes. Une description claire produit des concepts plus fiables."
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={createCourse.isPending}>
                            Annuler
                        </Button>
                        <Button
                            variant="generate"
                            isGlowing
                            loading={createCourse.isPending}
                            disabled={!canCreate}
                            onClick={handleSubmit}
                        >
                            Créer le cours
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-5 pb-2">
                    <SoftInput
                        label="Titre"
                        icon={<BookOpen size={16} />}
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Ex. : Algorithmique — structures de données"
                        maxLength={120}
                        autoFocus
                    />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="course-description" className="ml-1 text-sm font-medium text-sub-text">
                            Description
                        </label>
                        <textarea
                            id="course-description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Collez ou décrivez la matière : notions, chapitres, points clés…"
                            rows={7}
                            disabled={createCourse.isPending}
                            className="w-full min-h-36 resize-none rounded-2xl bg-core-bg px-4 py-3 text-sm text-main-text shadow-neu-pressed placeholder:text-sub-text focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-60"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
