import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private checkEvent = new Subject<any>();

    emitCheck() {
        this.checkEvent.next();
    }

    checkNotifications() {
        return this.checkEvent;
    }
}
