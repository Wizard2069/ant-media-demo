import {MessagePayload} from '../../types';

export interface MessageResponse {
    _embedded: {
        messageList: MessagePayload[]
    };
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    };
}
