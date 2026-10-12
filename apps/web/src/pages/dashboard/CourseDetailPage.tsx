import { useParams } from 'react-router-dom';
import { GlowButton } from '@pingcortex/ui';

export const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Détail du cours #{courseId}</h1>
      <p className="text-sub-text">Analyse IA et fiches générées pour ce document.</p>
      <GlowButton isGlowing={true} variant='generate'>
        Générer
      </GlowButton>
    </div>
  );
};