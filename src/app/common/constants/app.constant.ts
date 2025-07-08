import { animate, style, transition, trigger } from '@angular/animations';

export const MAXIMUM_ANSWER_OPTIONS = 5;

export const APP_LOCAL_QUESTION_KEY = 'questions';

export const expansionAnimationIf = trigger('expansionAnimationIf', [
    transition(':enter', [
        style({
            height: 0,
            opacity: 0,
            marginTop: 0,
            visibility: 'hidden',
            paddingTop: 0,
        }),
        animate(
            '225ms cubic-bezier(0.4,0.0,0.2,1)',
            style({
                height: '*',
                opacity: '*',
                visibility: '*',
                marginTop: '*',
                paddingTop: '*',
            })
        ),
    ]),
    transition(':leave', [
        animate(
            '225ms cubic-bezier(0.4,0.0,0.2,1)',
            style({
                height: 0,
                opacity: 0,
                marginTop: 0,
                visibility: 'hidden',
                paddingTop: 0,
            })
        ),
    ]),
]);
