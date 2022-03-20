import {NgModule} from '@angular/core';

import {AuthGuard} from './guard/auth.guard';

@NgModule({
    imports: [],
    providers: [
        AuthGuard
    ]
})
export class CoreModule {
}
