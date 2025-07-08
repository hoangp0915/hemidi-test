import { Question } from './question.model';

export type Answer = string | CheckboxAnswerValue;

export interface CheckboxAnswerValue {
    other: string | null;
    values: string[];
}

export interface CheckBoxAnswer {
    value: string;
    checked: boolean;
}

export interface QuestionAnswers {
    question: Question;
    answer: Answer;
}
