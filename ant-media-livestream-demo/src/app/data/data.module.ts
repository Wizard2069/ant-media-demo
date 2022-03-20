import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {MessageHistoryService} from './service/message-history.service';
import {IpService} from './service/ip.service';
import {AntMediaService} from './service/ant-media.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    exports: [],
    providers: [
        MessageHistoryService,
        IpService,
        AntMediaService
    ]
})
export class DataModule {
}
