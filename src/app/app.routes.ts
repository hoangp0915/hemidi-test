import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@pages/pages.component').then((c) => c.PagesComponent),
        children: [
            {
                path: 'form',
                loadComponent: () =>
                    import('@pages/form/form.component').then((c) => c.FormComponent),
                children: [
                    {
                        path: 'builder',
                        loadComponent: () =>
                            import('@pages/form/builder/builder.component').then(
                                (c) => c.BuilderComponent
                            ),
                        title: 'Forms Builder',
                    },
                    {
                        path: 'answers',
                        loadComponent: () =>
                            import('@pages/form/answers/answers.component').then(
                                (c) => c.AnswersComponent
                            ),
                        title: 'Review my answers',
                    },
                    { path: '**', redirectTo: '/form/builder' },
                    { path: '', redirectTo: '/', pathMatch: 'full' },
                ],
            },
            { path: '**', redirectTo: '/form/builder' },
            { path: '', redirectTo: '/', pathMatch: 'full' },
        ],
    },
];
