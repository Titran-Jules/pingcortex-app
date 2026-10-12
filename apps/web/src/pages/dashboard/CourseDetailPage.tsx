import { useParams } from 'react-router-dom';
import { Button } from '@pingcortex/ui';

export const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Détail du cours #{courseId}</h1>
      <p className="text-sub-text">Analyse IA et fiches générées pour ce document.</p>
      <Button isGlowing={false} variant='ghost' loading={false} size='md'>
        Annuler
      </Button>
    </div>
  );
};