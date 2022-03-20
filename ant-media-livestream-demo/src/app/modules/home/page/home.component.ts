import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';

import {CustomKeycloakProfile} from '../../../types';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    
    public loggedIn: boolean;
    
    public userProfile: KeycloakProfile | CustomKeycloakProfile | null = null;
    
    constructor(private keycloak: KeycloakService) {
    }

    async ngOnInit(): Promise<void> {
        this.loggedIn = await this.keycloak.isLoggedIn();
        if (this.loggedIn) {
            this.userProfile = await this.keycloak.loadUserProfile();
        }
    }

}
