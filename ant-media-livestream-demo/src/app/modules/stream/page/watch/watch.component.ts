import {Component, OnDestroy, OnInit} from '@angular/core';
import {AntMediaService} from '../../../../data/service/ant-media.service';

import {StreamsResponse} from '../../../../data/schema/stream-response.interface';

@Component({
    selector: 'app-watch',
    templateUrl: './watch.component.html',
    styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit, OnDestroy {

    public activeStreams: StreamsResponse[];
    public totalStreams: number;
    
    private interval = null;
    
    constructor(private antMedia: AntMediaService) {
    }

    ngOnInit(): void {
        this.getStreams();
        this.callTimer();
    }
    
    ngOnDestroy(): void {
        this.clearTimer();
    }

    getStreams(): void {
        this.antMedia.countActiveStreams().subscribe(data => {
            this.totalStreams = data.number;
        });
        this.antMedia.getActiveStreams(1, 10).subscribe(data => {
            this.activeStreams = data;
        });
    }
    
    callTimer(): void {
        this.clearTimer();
        this.interval = setInterval(() => {
            this.getStreams();
        }, 5000);
    }
    
    clearTimer(): void {
        clearInterval(this.interval);
        this.interval = null;
    }
}
