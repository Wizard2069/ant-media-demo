import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {StreamsResponse} from '../schema/stream-response.interface';

@Injectable()
export class AntMediaService {
    
    constructor(private http: HttpClient) {
    }
    
    getActiveStreams(page: number, limit: number): Observable<StreamsResponse[]> {
        return this.http.get<StreamsResponse[]>(
            `${environment.antMediaBaseUrl}/${environment.antMediaApp}/rest/v2/broadcasts/list/${page - 1}/${limit}`
        );
    }
    
    countActiveStreams(): Observable<{number: number}> {
        return this.http.get<{number: number}>(
            `${environment.antMediaBaseUrl}/${environment.antMediaApp}/rest/v2/broadcasts/count`
        );
    }
    
    getStreamStatus(streamId: string): Observable<{status: string}> {
        return this.http.get<{status: string}>(
            `${environment.antMediaBaseUrl}/${environment.antMediaApp}/rest/v2/broadcasts/${streamId}`
        );
    }
}
