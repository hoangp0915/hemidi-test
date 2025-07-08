import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'hmd-pages',
    imports: [RouterOutlet],
    template: `
        <router-outlet />
    `,
    styles: ``,
})
export class PagesComponent {}
