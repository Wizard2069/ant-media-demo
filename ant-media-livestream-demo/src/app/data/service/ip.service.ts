import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class IpService {
    
    constructor(private http: HttpClient) {
    }
    
    getIp(): Observable<{ip: string}> {
        return this.http.get<{ip: string}>('https://api.ipify.org/?format=json');
    }
}
