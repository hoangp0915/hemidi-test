import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Answer, CheckboxAnswerValue } from '@models/answer.model';
import { Question, QuestionEnum } from '@models/question.model';
import { DestroyService } from '@services/destroy.service';
import { QuestionAnswersService } from '@services/question-answers.service';
import {
    ButtonModule,
    CheckboxModule,
    IconModule,
    InputModule,
    ModalModule,
    ModalService,
    PlaceholderModule,
} from 'carbon-components-angular';
import { Subject, takeUntil } from 'rxjs';
import { AddQuestionModalComponent } from '../modals/add-question-modal/add-question-modal.component';
import { CheckboxAnswerComponent } from './checkbox-answer/checkbox-answer.component';

@Component({
    selector: 'hmd-builder',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        IconModule,
        ModalModule,
        PlaceholderModule,
        InputModule,
        CheckboxModule,
        CheckboxAnswerComponent,
    ],
    templateUrl: './builder.component.html',
    styleUrls: ['./builder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderComponent implements OnInit {
    protected result = new Subject<Question | undefined>();
    public questionEnum = QuestionEnum;
    public formGroup: FormGroup;

    constructor(
        private readonly _modalService: ModalService,
        private readonly _cd: ChangeDetectorRef,
        private readonly _fb: FormBuilder,
        private readonly _destroy: DestroyService,
        private readonly _qaService: QuestionAnswersService,
        private readonly _router: Router
    ) {
        this.formGroup = this._createForm();
    }

    ngOnInit(): void {
        this._loadQuestionAnswers();

        this.result.pipe(takeUntil(this._destroy)).subscribe((data) => {
            if (!data) {
                return;
            }

            this.answersCtrl.push(this._createAnswer(data as Question));
        });
    }

    /**
     * Load all question and create form array
     *
     * @private
     * @memberof BuilderComponent
     */
    private _loadQuestionAnswers() {
        const result = this._qaService.getAllQuestionAnswers();
        result.forEach((q) => {
            this.answersCtrl.push(this._createAnswer(q.question, q.answer));
        });
    }

    /**
     * Open add question
     *
     * @memberof BuilderComponent
     */
    public openAddQuestion() {
        this._modalService.create({
            component: AddQuestionModalComponent,
            inputs: {
                result: this.result,
            },
        });
    }

    /**
     * Create form group
     *
     * @private
     * @return {*}
     * @memberof BuilderComponent
     */
    private _createForm() {
        return this._fb.group({
            answers: this._fb.array([]),
        });
    }

    /**
     * Create answer
     *
     * @private
     * @param {Question} question
     * @param {(Answer | null)} [answer=null]
     * @return {*}
     * @memberof BuilderComponent
     */
    private _createAnswer(question: Question, answer: Answer | null = null) {
        const answerValidators = this.createAnswerValidator(question);
        return this._fb.group({
            question: [question],
            answer: this._fb.control<Answer | null>(answer, { validators: answerValidators }),
        });
    }

    /**
     * Create answer validator
     *
     * @private
     * @param {Question} question
     * @return {*}  {(ValidatorFn | null)}
     * @memberof BuilderComponent
     */
    private createAnswerValidator(question: Question): ValidatorFn | null {
        if (!question.required) {
            return null;
        }

        if (question.type === QuestionEnum.PARAGRAPH && question.required) {
            return Validators.required;
        }

        return (control: AbstractControl) => {
            const value = control.value as CheckboxAnswerValue;
            console.log('value: ', value);

            if (!value?.values?.length && !value?.other) {
                return { required: true };
            }

            return null;
        };
    }

    /**
     * Answers control
     *
     * @readonly
     * @type {FormArray}
     * @memberof BuilderComponent
     */
    public get answersCtrl(): FormArray {
        return this.formGroup.get('answers') as FormArray;
    }

    /**
     * Handle submit and navigate to answer preview
     *
     * @return {*}
     * @memberof BuilderComponent
     */
    public handleSubmit() {
        if (this.formGroup.invalid) {
            return;
        }
        const qa = this.answersCtrl.value;

        this._qaService.updateQuestionAnswers(qa);
        this._router.navigate(['form', 'answers']);
    }
}
