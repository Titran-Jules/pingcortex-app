import { useParams } from 'react-router-dom';
import { Button, Badge, AnalysisStatusBadge } from '@pingcortex/ui';
import { Brain } from 'lucide-react';

export const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Détail du cours #{courseId}</h1>
      <p className="text-sub-text">Analyse IA et fiches générées pour ce document.</p>
      <div className='flex gap-10 items-center'>
        <Button isGlowing={false} variant='ghost' loading={false} size='md'>
          Annuler
        </Button>
        <Badge variant='primary' size='md' leftIcon={<Brain size={14}/>}>
          primary
        </Badge>
        <Badge variant='secondary' dot={true} size='md'>secondary</Badge>
        <Badge variant='neutral' size='md'>
          neutral
        </Badge>
        <Badge variant='success' size='sm'>
          success
        </Badge>
        <Badge variant='warning' size='md'>
          warning
        </Badge>
        <Badge variant='danger' size='lg'>
          danger
        </Badge>
        <Badge variant='primary' size='sm' leftIcon={<Brain size={14}/>}></Badge>

      </div>
      <div className='flex gap-4 items-center'>
        <Badge variant='primary' size='md' dot={true} ping={true}>Analyse en cours...</Badge>
        <AnalysisStatusBadge status='PENDING'/>
        <AnalysisStatusBadge status='ANALYZING'/>
        <AnalysisStatusBadge status='READY'/>
        <AnalysisStatusBadge status='FAILED'/>
      </div>
    </div>
  );
};