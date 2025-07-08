import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    NgZone,
    OnInit,
    Optional,
} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { expansionAnimationIf, MAXIMUM_ANSWER_OPTIONS } from '@constants/app.constant';
import { Question, QuestionEnum } from '@models/question.model';
import { DestroyService } from '@services/destroy.service';
import {
    BaseModal,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    IconModule,
    InputModule,
    ListItem,
    ModalModule,
} from 'carbon-components-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'hmd-add-question-modal',
    imports: [
        CommonModule,
        ModalModule,
        ButtonModule,
        IconModule,
        InputModule,
        DropdownModule,
        CheckboxModule,
        ReactiveFormsModule,
    ],
    templateUrl: './add-question-modal.component.html',
    styleUrl: './add-question-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [expansionAnimationIf],
})
export class AddQuestionModalComponent extends BaseModal implements OnInit, AfterViewInit {
    public questionTypeOptions: ListItem[] = [
        {
            content: 'Paragraph',
            value: QuestionEnum.PARAGRAPH,
            selected: true,
        },
        {
            content: 'Checkbox List',
            value: QuestionEnum.CHECKBOX,
            selected: false,
        },
    ];
    public formGroup: FormGroup;
    public questionTypeEnum = QuestionEnum;

    constructor(
        @Optional() @Inject('result') public result: Subject<Question>,
        private readonly _fb: FormBuilder,
        private readonly _destroy: DestroyService,
        public readonly _cd: ChangeDetectorRef,
        private readonly zone: NgZone
    ) {
        super();
        this.formGroup = this._createForm();
    }

    ngAfterViewInit(): void {
        // force update view when open = true
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                this._cd.detectChanges();
            });
        });
    }

    ngOnInit(): void {
        this.typeCtrl.valueChanges.pipe(takeUntil(this._destroy)).subscribe((value) => {
            if (value === QuestionEnum.CHECKBOX) {
                this.optionsCtrl.push(this._createAnswerOption());
                this.optionsCtrl.push(this._createAnswerOption());
                return;
            }
            this.optionsCtrl.clear();
        });
    }

    /**
     * Create question form group
     *
     * @private
     * @return {*}
     * @memberof AddQuestionModalComponent
     */
    private _createForm() {
        return this._fb.group({
            type: this._fb.control<QuestionEnum>(QuestionEnum.PARAGRAPH),
            question: this._fb.control<string>('', Validators.required),
            options: this._fb.array([]),
            allowOtherAnswer: this._fb.control<boolean>(false),
            required: this._fb.control<boolean>(false),
        });
    }

    /**
     * Create answer option control
     *
     * @private
     * @return {*}
     * @memberof AddQuestionModalComponent
     */
    private _createAnswerOption() {
        return this._fb.control<string>('', Validators.required);
    }

    /**
     * Get type control
     *
     * @readonly
     * @type {AbstractControl}
     * @memberof AddQuestionModalComponent
     */
    public get typeCtrl(): AbstractControl {
        return this.formGroup.get('type') as AbstractControl;
    }

    /**
     * Get question control
     *
     * @readonly
     * @type {AbstractControl}
     * @memberof AddQuestionModalComponent
     */
    public get questionCtrl(): AbstractControl {
        return this.formGroup.get('question') as AbstractControl;
    }

    /**
     * Get option control
     *
     * @readonly
     * @type {FormArray}
     * @memberof AddQuestionModalComponent
     */
    public get optionsCtrl(): FormArray {
        return this.formGroup.get('options') as FormArray;
    }

    /**
     * Check the condition to enable the 'Add Answer Option' button.
     *
     * @readonly
     * @type {boolean}
     * @memberof AddQuestionModalComponent
     */
    public get isEnableAddOption(): boolean {
        return this.optionsCtrl.length < MAXIMUM_ANSWER_OPTIONS;
    }

    /**
     * Handle type change
     *
     * @param {{ item: ListItem }} event
     * @memberof AddQuestionModalComponent
     */
    public handleTypeChange(event: { item: ListItem }) {
        if (event.item['value']) this.typeCtrl.setValue(event.item['value']);
    }

    /**
     * Add answer option
     *
     * @memberof AddQuestionModalComponent
     */
    public addAnswerOption() {
        if (this.isEnableAddOption) {
            this.optionsCtrl.push(this._createAnswerOption());
        }
    }

    /**
     * Handle submit and close modal
     *
     * @return {*}
     * @memberof AddQuestionModalComponent
     */
    public handleSubmit() {
        if (this.formGroup.invalid) {
            return;
        }

        this.result.next(this.formGroup.value);
        this.closeModal();
    }
}
