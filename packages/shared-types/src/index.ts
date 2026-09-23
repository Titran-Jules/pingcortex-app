export interface CourseDTO {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface QuizQuestionDTO {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}
