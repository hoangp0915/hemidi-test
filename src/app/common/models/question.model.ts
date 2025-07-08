export enum QuestionEnum {
    PARAGRAPH = 'paragraph',
    CHECKBOX = 'checkbox',
}

export interface QuestionBase {
    question: string;
    required: boolean;
}

export interface ParagraphQuestion extends QuestionBase {
    type: 'paragraph';
}

export interface CheckboxQuestion extends QuestionBase {
    type: 'checkbox';
    allowOtherAnswer: boolean;
    options: string[];
}

export type Question = ParagraphQuestion | CheckboxQuestion;
