import {Component, OnInit} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public isLoggedIn: boolean;
    
    constructor(private keycloak: KeycloakService) {
    }

    async ngOnInit(): Promise<void> {
        this.isLoggedIn = await this.keycloak.isLoggedIn();
    }

    onLogin(): void {
        this.keycloak.login();
    }
    
    onLogout(): void {
        this.keycloak.logout();
    }
}
