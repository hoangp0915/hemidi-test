import { Injectable } from '@angular/core';
import { questionAnswerSchema } from '@common/schemas/qa.schema';
import { APP_LOCAL_QUESTION_KEY } from '@constants/app.constant';
import { QuestionAnswers } from '@models/answer.model';

@Injectable({
    providedIn: 'root',
})
export class QuestionAnswersService {
    /**
     * Get all question and answer
     *
     * @return {*}  {QuestionAnswers[]}
     * @memberof QuestionAnswersService
     */
    public getAllQuestionAnswers(): QuestionAnswers[] {
        try {
            const qaLocal = localStorage.getItem(APP_LOCAL_QUESTION_KEY) || '[]';
            const qaResult = JSON.parse(qaLocal) as QuestionAnswers[];
            return qaResult.filter((q) => {
                return questionAnswerSchema.isValidSync(q);
            });
        } catch (error) {
            console.error('GetAllQuestionAnswers: ', error);
            return [];
        }
    }

    /**
     * Update question and answers to localStorage
     *
     * @param {QuestionAnswers[]} qaResult
     * @memberof QuestionAnswersService
     */
    public updateQuestionAnswers(qaResult: QuestionAnswers[]) {
        localStorage.setItem(APP_LOCAL_QUESTION_KEY, JSON.stringify(qaResult));
    }
}
