import {Injectable} from '@angular/core';

import {WebRTCAdaptor} from '../../../assets/js/webrtc_adaptor.js';
import {MessagePayload} from '../../types';
import {environment} from '../../../environments/environment';

@Injectable()
export class WebRtcService {

    public pcConfig = null;

    public sdpConstraints = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    };

    public mediaConstraints = {
        video: false,
        audio: false
    };

    public additionalConfig = {};

    private webRTCAdaptor: WebRTCAdaptor;

    public handleError: () => void = () => {};

    public handleInit: () => void = () => {};
    
    public handleData: (data: MessagePayload) => void = () => {};

    get getWebRTCAdaptor(): WebRTCAdaptor {
        return this.webRTCAdaptor;
    }

    set setWebRTCAdaptor(adaptor: WebRTCAdaptor) {
        this.webRTCAdaptor = adaptor;
    }

    initWebRTCAdaptor(): void {
        this.webRTCAdaptor = new WebRTCAdaptor({
            websocket_url: `${environment.antMediaWs}/${environment.antMediaApp}/websocket`,
            mediaConstraints: this.mediaConstraints,
            peerconnection_config: this.pcConfig,
            sdp_constraints: this.sdpConstraints,
            ...this.additionalConfig,
            callback: (info, obj) => {
                if (info === 'initialized') {
                    console.log('initialized');
                    this.handleInit();
                } else if (info === 'publish_started') {
                    console.log('publish started');
                } else if (info === 'publish_finished') {
                    console.log('publish finished');
                } else if (info === 'screen_share_extension_available') {
                    console.log('screen share extension available');
                } else if (info === 'screen_share_stopped') {
                    console.log('screen share stopped');
                } else if (info === 'data_channel_opened') {
                    console.log('data channel is open');
                } else if (info === 'data_received') {
                    console.log('Message received ');
                    this.handleData(JSON.parse(obj.event.data));
                } else if (info === 'data_channel_error') {
                    
                } else if (info === 'data_channel_closed') {
                    console.log('Data channel closed ');
                }
            },
            callbackError: (error) => {
                console.log('error callback: ' + JSON.stringify(error));
                // alert(JSON.stringify(error));
                this.handleError();
            }
        });
    }
}
