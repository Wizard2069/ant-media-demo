import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {v4 as uuidv4} from 'uuid';

import {WebRtcService} from '../../service/web-rtc.service';
import {WebRTCAdaptor} from '../../../../assets/js/webrtc_adaptor.js';
import {MessagePayload} from '../../../types';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {
    
    public webRTCAdaptor: WebRTCAdaptor;

    public startStream = false;
    
    public streamId;
    
    public data: MessagePayload;

    constructor(private webRTCService: WebRtcService) {
    }
    
    ngOnInit(): void {
        this.webRTCService.additionalConfig = {
            localVideoId: 'localVideo'
        };
    }
    
    ngAfterViewInit(): void {
        this.webRTCService.handleData = (data) => {
            this.data = data;
        };
        this.webRTCService.handleError = () => {
            this.startStream = false;  
        };
        this.webRTCService.initWebRTCAdaptor();
        setTimeout(() => {
            this.webRTCAdaptor = this.webRTCService.getWebRTCAdaptor;
        });
    }

    ngOnDestroy(): void {
        this.webRTCAdaptor.closeStream();
        this.webRTCAdaptor.closeWebSocket();
    }
    
    onStartStream(): void {
        if (!this.streamId || this.streamId === '') {
            alert('Stream name must be fill in');
        } else {
            this.streamId += '-' + uuidv4();
            this.webRTCAdaptor.publish(this.streamId, null);
            this.startStream = true;
        }
    }
    
    onChangeMode(): void {
        this.webRTCAdaptor.switchDesktopCapture(this.streamId);
    }
    
    onStopStream(): void {
        this.webRTCAdaptor.stop(this.streamId);
        this.webRTCAdaptor.closePeerConnection(this.streamId);
        this.streamId = null;
        this.startStream = false;
        history.go(0);
    }
    
    onMute(mute): void {
        if (mute) {
            this.webRTCAdaptor.muteLocalMic();
        } else {
            this.webRTCAdaptor.unmuteLocalMic();
        }
    }
}
