import { NotificationService } from './../../services/notification.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../components/shared.module';
import { NotificationHistoryComponent } from './notification-history.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotificationHistoryComponent
      }
    ])
  ],
  declarations: [NotificationHistoryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NotificationService]
})
export class NotificationHistoryModule { }
