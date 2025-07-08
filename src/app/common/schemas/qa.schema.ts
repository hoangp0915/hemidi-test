import { QuestionEnum } from '@models/question.model';
import { array, boolean, mixed, object, string } from 'yup';

export const questionAnswerSchema = object({
    question: object({
        type: string().oneOf([QuestionEnum.CHECKBOX, QuestionEnum.PARAGRAPH]).required(),
        question: string().required(),
        options: array()
            .of(string())
            .when('type', {
                is: QuestionEnum.CHECKBOX,
                then: (schema) => schema.required().min(1),
                otherwise: (schema) => schema.notRequired(),
            }),
        allowOtherAnswer: boolean(),
        required: boolean(),
    }),
    answer: mixed().when(['question.type'], {
        is: (type: string) => type === QuestionEnum.PARAGRAPH,
        then: (schema) =>
            schema.when('question.required', {
                is: true,
                then: () => string().required('Answer is required for paragraph'),
                otherwise: () => string().notRequired(),
            }),
        otherwise: (schema) =>
            schema.when(['question.type', 'question.required'], {
                is: (type: string, required: boolean) =>
                    type === QuestionEnum.CHECKBOX && required === true,
                then: () =>
                    object({
                        other: string().notRequired(),
                        values: array()
                            .of(string())
                            .min(1, 'At least one checkbox must be selected'),
                    }),
                otherwise: () => mixed().nullable(),
            }),
    }),
});
