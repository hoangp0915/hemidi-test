import { TestBed } from '@angular/core/testing';

import { QuestionAnswersService } from './question-answers.service';

describe('QuestionAnswersService', () => {
    let service: QuestionAnswersService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(QuestionAnswersService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
