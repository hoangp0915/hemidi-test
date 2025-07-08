/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    input,
    OnChanges,
    Provider,
    SimpleChanges,
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormsModule,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator,
} from '@angular/forms';
import { expansionAnimationIf } from '@constants/app.constant';
import { CheckBoxAnswer, CheckboxAnswerValue } from '@models/answer.model';
import { CheckboxQuestion } from '@models/question.model';
import { CheckboxModule, InputModule } from 'carbon-components-angular';

const ACCESSOR_PROVIDER: Provider = {
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => CheckboxAnswerComponent),
};

const VALIDATORS_PROVIDER: Provider = {
    provide: NG_VALIDATORS,
    multi: true,
    useExisting: forwardRef(() => CheckboxAnswerComponent),
};

type OnTouchedFn = () => void;
type OnChangeFn = (_value: CheckboxAnswerValue) => void;

@Component({
    selector: 'hmd-checkbox-answer',
    imports: [CommonModule, CheckboxModule, InputModule, FormsModule],
    templateUrl: './checkbox-answer.component.html',
    styleUrl: './checkbox-answer.component.scss',
    providers: [ACCESSOR_PROVIDER, VALIDATORS_PROVIDER],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [expansionAnimationIf],
})
export class CheckboxAnswerComponent implements ControlValueAccessor, Validator, OnChanges {
    public question = input.required<CheckboxQuestion>();
    public invalid = input(false, { transform: booleanAttribute });

    public allowOtherAnswer = false;
    public otherAnswer = '';
    public value: string[] = [];
    private _touched = false;
    private _onChange: OnChangeFn = (_value: CheckboxAnswerValue) => {};
    private _onTouched: OnTouchedFn = () => {};

    public answerOptions: CheckBoxAnswer[] = [];

    constructor(private readonly _cd: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        const questionChange = changes['question']?.currentValue as CheckboxQuestion;
        if (questionChange) {
            this.answerOptions = questionChange.options.map((v) => ({
                value: v,
                checked: this.value.includes(v),
            }));
        }
    }

    /**
     * Mark as touched input
     *
     * @private
     * @return {*}  {void}
     * @memberof CheckboxAnswerComponent
     */
    private _markAsTouched(): void {
        if (this._touched) {
            return;
        }
        this._onTouched();
    }

    writeValue(obj: CheckboxAnswerValue | null): void {
        if (!obj) {
            return;
        }
        this._cd.markForCheck();
        this.value = obj.values || [];
        this.answerOptions.forEach((v) => {
            v.checked = this.value.includes(v.value);
        });
        if (obj.other) {
            this.allowOtherAnswer = true;
            this.otherAnswer = obj.other;
        }
    }

    registerOnChange(fn: OnChangeFn): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: OnTouchedFn): void {
        this._onTouched = fn;
    }

    /**
     * Check other answer input when required = false and allowOtherAnswer = true
     *
     * @param {AbstractControl} _control
     * @return {*}  {(ValidationErrors | null)}
     * @memberof CheckboxAnswerComponent
     */
    validate(_control: AbstractControl): ValidationErrors | null {
        const { required } = this.question();
        if (!required && this.allowOtherAnswer && !this.otherAnswer) {
            return { required: true };
        }
        return null;
    }

    /**
     * Handle allow other answer change
     *
     * @param {boolean} event
     * @memberof CheckboxAnswerComponent
     */
    public handleAllowOtherAnswer(event: boolean) {
        this.allowOtherAnswer = event;
        if (!event) {
            this.otherAnswer = '';
        }
        this._assignValue();
        this._markAsTouched();
        this._cd.detectChanges();
    }

    /**
     * Assigne value to control
     *
     * @private
     * @memberof CheckboxAnswerComponent
     */
    private _assignValue() {
        this._onChange({
            values: this.value,
            other: this.allowOtherAnswer ? this.otherAnswer : null,
        });
    }

    /**
     * Change otherAnswer value
     *
     * @param {string} event
     * @memberof CheckboxAnswerComponent
     */
    public handleOtherAnswerChange(event: string) {
        this.otherAnswer = event.trim();
        this._assignValue();
    }

    /**
     * Handle answer input change
     *
     * @memberof CheckboxAnswerComponent
     */
    public handleAnswerChange() {
        const valueChecked = this.answerOptions.filter((v) => v.checked).map((v) => v.value);
        this.value = valueChecked;
        this._assignValue();
        this._markAsTouched();
    }
}
