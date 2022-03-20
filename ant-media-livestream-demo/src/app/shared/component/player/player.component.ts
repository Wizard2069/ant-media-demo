import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {interval, Subscription, throwError} from 'rxjs';

import {WebRTCAdaptor} from '../../../../assets/js/webrtc_adaptor.js';
import {WebRtcService} from '../../service/web-rtc.service';
import {MessagePayload} from '../../../types';
import {AntMediaService} from '../../../data/service/ant-media.service';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    @Input() streamId = 'stream1';

    public webRTCAdaptor: WebRTCAdaptor;
    
    public data: MessagePayload;
    
    public hasError: boolean;
    
    public errInterval: Subscription;
    
    public checkStreamStatus: Subscription;
    
    public streamEnded = false;

    constructor(
        private webRTCService: WebRtcService,
        private antMediaService: AntMediaService
    ) {
    }

    ngOnInit(): void {
        this.webRTCService.additionalConfig = {
            remoteVideoId: 'remoteVideo',
            isPlayMode: true,
        };
    }

    ngAfterViewInit(): void {
        this.webRTCService.handleData = (data) => {
            this.data = data;
        };
        this.webRTCService.handleInit = () => {
            this.webRTCAdaptor.play(this.streamId, null);
        };
        this.webRTCService.handleError = () => {
            this.hasError = true;
        };
        this.errInterval = interval(4000).subscribe(() => {
            if (this.hasError) {
                console.log('Trying to reconnect...');
                this.webRTCAdaptor.play(this.streamId, null);
                this.hasError = false;
            } 
        });
        this.checkStream();
        this.checkStreamStatus = interval(3000).subscribe(() => {
             this.checkStream();
        });
        this.webRTCService.initWebRTCAdaptor();
        setTimeout(() => {
            this.webRTCAdaptor = this.webRTCService.getWebRTCAdaptor;
        });
    }
    
    checkStream(): void {
        this.antMediaService.getStreamStatus(this.streamId)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 404) {
                        this.streamEnded = true;
                    }

                    return throwError('Error occurred');
                })
            )
            .subscribe((status) => {

            });
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        if (this.streamEnded) {
            this.checkStreamStatus.unsubscribe();
        }
    }

    ngOnDestroy(): void {
        this.errInterval.unsubscribe();
        this.checkStreamStatus.unsubscribe();
        this.streamEnded = false;
        this.webRTCAdaptor.stop(this.streamId);
        this.webRTCAdaptor.closePeerConnection(this.streamId);
        this.webRTCAdaptor.closeWebSocket();
    }
    
    onPlayStream(isPlay): void {
        if (isPlay) {
            this.webRTCAdaptor.play(this.streamId, null);
        } else {
            this.webRTCAdaptor.stop(this.streamId);
        }
    }
}
