import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector: 'app-watch-detail',
    templateUrl: './watch-detail.component.html',
    styleUrls: ['./watch-detail.component.scss']
})
export class WatchDetailComponent implements OnInit, OnDestroy {
    
    public streamId: string;
    
    constructor(private route: ActivatedRoute) {
    }
    
    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
             this.streamId = params.get('id');
        });
    }
    
    ngOnDestroy(): void {
        
    }
    
}
