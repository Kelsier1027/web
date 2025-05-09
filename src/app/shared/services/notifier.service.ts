/** --------------------------------------------------------------------------------
 *-- Description： notifier service
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import {
  InfoNotificationComponent,
  NotificationComponent,
} from '../components/snackbar';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(private snackBar: MatSnackBar) {}

  showInfoNotification(text: string): void {
    this.snackBar.openFromComponent(InfoNotificationComponent, {
      data: {
        message: text,
        button: 'close',
      },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'info',
    });
  }

  showErrorNotification(text: string): void {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: {
        message: text,
        button: 'close',
      },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'error',
    });
  }

  showNotification(
    template: any,
    config: {
      displayMessage: string;
      buttonText: string;
      messageType: 'error' | 'info' | 'success';
      duration: number;
    }
  ): void {
    this.snackBar.openFromComponent(template, {
      data: {
        message: config.displayMessage,
        button: config.buttonText,
      },
      duration: config.duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: config.messageType,
    });
  }
}
