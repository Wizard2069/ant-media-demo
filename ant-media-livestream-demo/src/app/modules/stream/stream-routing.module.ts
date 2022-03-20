import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {StreamComponent} from './page/stream.component';
import {WatchComponent} from './page/watch/watch.component';
import {WatchDetailComponent} from './page/watch/watch-detail/watch-detail.component';

const routes: Routes = [
    {
        path: '',
        component: StreamComponent
    },
    {
        path: 'watch',
        children: [
            {
                path: '',
                component: WatchComponent
            },
            {
                path: ':id',
                component: WatchDetailComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class StreamRoutingModule {
}
