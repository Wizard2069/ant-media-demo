import {KeycloakProfile} from 'keycloak-js';

declare type User = {
    id?: string;
    name: string;
    email: string;
    avatar?: string;
};

declare type MessagePayload = {
    sender: User,
    msg: string;
    time: Date | string;
    replyTo?: User;
    ip: string;
};

declare type CustomKeycloakProfile = KeycloakProfile & {
    attributes: {
        picture: string[]
    } 
};
