import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'hmd-form',
    imports: [RouterOutlet],
    template: `
        <router-outlet />
    `,
    styles: ``,
})
export class FormComponent {}
