import {NgModule} from '@angular/core';

import {StreamComponent} from './page/stream.component';
import {StreamRoutingModule} from './stream-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {WatchComponent} from './page/watch/watch.component';
import {WatchDetailComponent} from './page/watch/watch-detail/watch-detail.component';

@NgModule({
    declarations: [
        StreamComponent,
        WatchComponent,
        WatchDetailComponent
    ],
    imports: [
        StreamRoutingModule,
        SharedModule
    ]
})
export class StreamModule {
}
