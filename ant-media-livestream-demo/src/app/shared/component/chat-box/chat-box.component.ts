import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
    Input,
    OnChanges,
    SimpleChanges,
    AfterViewChecked, OnDestroy
} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import * as moment from 'moment';

import {WebRTCAdaptor} from '../../../../assets/js/webrtc_adaptor.js';
import {CustomKeycloakProfile, MessagePayload, User} from '../../../types';
import {MessageHistoryService} from '../../../data/service/message-history.service';
import {IpService} from '../../../data/service/ip.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked, OnDestroy {

    @ViewChild('title') titleView: ElementRef;

    @ViewChild('messageInput') messageInputView: ElementRef;

    @Input() webRTCAdaptor: WebRTCAdaptor;

    @Input() streamId: string;

    @Input() messageData: MessagePayload;

    @Input() host: boolean;

    public showIcons: boolean[] = [];

    public chatBoxHeight: number;

    public submitting = false;

    public message: string;

    public submitted = false;

    public messages: MessagePayload[] = [];

    private ws: WebSocket;
    private wsInterval = null;

    private userProfile: KeycloakProfile | CustomKeycloakProfile | null = null;

    private currentPage = 1;
    private size = 5;
    private totalPages;

    private scrolled = false;

    public replyTo: User;

    private ipAddr;

    constructor(
        private keycloak: KeycloakService,
        private messageHistory: MessageHistoryService,
        private ip: IpService
    ) {
    }

    ngOnInit(): void {
        const token = this.keycloak.getKeycloakInstance().token;
        this.ws = new WebSocket(`${environment.messageServiceWs}/messages`, [
            'access_token', token
        ]);
        this.ws.onopen = () => {
            console.log('ws connected');
            this.wsInterval = setInterval(() => {
                this.ws.send(JSON.stringify({
                    command: 'ping'
                }));
            }, 3000);
        };
        this.ws.onerror = (e) => {
            console.log('Error occurred: ' + JSON.stringify(e));
            clearInterval(this.wsInterval);
        };
        this.ws.onclose = (e) => {
            console.log(e);
            console.log('ws closed');
            clearInterval(this.wsInterval);
        };
        this.keycloak.loadUserProfile()
            .then(profile => this.userProfile = profile);

        this.ip.getIp().subscribe(data => {
            this.ipAddr = data.ip;
        });

        this.messageHistory.getMessageHistory(this.streamId, 1, this.size)
            .subscribe(data => {
                this.messages = data._embedded.messageList;
                this.totalPages = data.page.totalPages;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.streamId) {
            this.messages = [];
        }
        
        if (this.messageData && this.streamId) {
            this.messages.push({
                ...this.messageData,
                time: new Date(this.messageData.time)
            });
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.handleResize();
        });
    }

    ngAfterViewChecked(): void {
        if (!this.scrolled) {
            const chatBox = document.querySelector('.chat-box');
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    ngOnDestroy(): void {
        this.ws.close();
        clearInterval(this.wsInterval);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: DocumentEvent): void {
        this.handleResize();
    }

    handleResize(): void {
        if (window.innerWidth <= 1200 && window.innerWidth > 992 || window.innerWidth > 1200) {
            const wrapperHeight = document.querySelector('.chat-box-wrapper').getBoundingClientRect().height;

            const titleHeight = this.titleView.nativeElement.offsetHeight;
            const messageInputHeight = this.messageInputView.nativeElement.offsetHeight;
            this.chatBoxHeight = wrapperHeight - titleHeight - messageInputHeight;
        } else {
            this.chatBoxHeight = 300;
        }
    }

    onScrollDown(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    onScrollUp(): void {
        this.scrolled = true;
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.messageHistory.getMessageHistory(this.streamId, this.currentPage, this.size)
                .subscribe(data => {
                    this.messages = [
                        ...data._embedded.messageList,
                        ...this.messages
                    ];
                });
        }
    }

    toTimeDiff(time: string): string {
        if (moment(new Date()).diff(time, 'days') > 0) {
            return moment(time).fromNow();
        }

        return moment(time).format('HH:mm');
    }

    onReply(message: MessagePayload): void {
        const inputElement = document.querySelector('#msg');
        inputElement.innerHTML = message.sender.name;
        this.replyTo = message.sender;
    }

    onChange(e: Event): void {
        this.handleResize();
        this.submitted = false;
        // @ts-ignore
        this.message = e.target.outerText.trim();
        this.submitting = this.message.length !== 0;
    }

    onSubmit(): void {
        this.submitting = true;
        if (this.message?.length !== 0) {
            this.submitted = true;
            this.messageInputView.nativeElement.querySelector('.input').textContent = '';

            const sendData: MessagePayload = {
                sender: {
                    id: this.keycloak.getKeycloakInstance().subject,
                    name: this.userProfile.firstName + ' ' + this.userProfile.lastName,
                    email: this.userProfile.email,
                    // @ts-ignore
                    avatar: this.userProfile.attributes.picture ? this.userProfile.attributes.picture[0] : 'https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg'
                },
                msg: this.message,
                time: new Date(),
                replyTo: this.replyTo,
                ip: this.ipAddr
            };

            this.webRTCAdaptor.sendData(this.streamId, JSON.stringify(sendData));
            this.messages.push(sendData);

            this.ws.send(JSON.stringify({
                streamId: this.streamId,
                ...sendData
            }));
        }
        this.submitting = false;
        this.handleResize();
    }
}
