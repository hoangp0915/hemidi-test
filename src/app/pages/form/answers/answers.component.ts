import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuestionAnswers } from '@models/answer.model';
import { QuestionAnswersService } from '@services/question-answers.service';
import { LinkModule } from 'carbon-components-angular';

@Component({
    selector: 'hmd-answers',
    imports: [CommonModule, LinkModule, RouterModule],
    templateUrl: './answers.component.html',
    styleUrl: `./answers.component.scss`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswersComponent implements OnInit {
    public list: { question: string; answers: string[] }[] = [];

    constructor(private readonly _qaService: QuestionAnswersService) {}

    ngOnInit(): void {
        const qaResult = this._qaService.getAllQuestionAnswers();
        this.list = this._buildResult(qaResult);
    }

    /**
     * Build answer result
     *
     * @private
     * @param {QuestionAnswers[]} answers
     * @return {*}  {{ question: string; answers: string[] }[]}
     * @memberof AnswersComponent
     */
    private _buildResult(answers: QuestionAnswers[]): { question: string; answers: string[] }[] {
        return answers.map((a) => {
            if (typeof a.answer === 'string') {
                return {
                    question: a.question.question,
                    answers: [a.answer],
                };
            }
            const answers: string[] = a.answer?.values || [];
            if (a.answer?.other) answers.push(`Other - ${a.answer.other}`);
            return {
                question: a.question.question,
                answers: answers,
            };
        });
    }
}
