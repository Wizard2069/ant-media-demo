import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {AuthGuard} from './core/guard/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: ContentLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./modules/home/home.module').then(m => m.HomeModule)
            },
            {
                path: 'stream',
                loadChildren: () =>
                    import('./modules/stream/stream.module').then(m => m.StreamModule),
                canLoad: [AuthGuard],
                canActivateChild: [AuthGuard]
            }
        ]
    },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
