/** --------------------------------------------------------------------------------
 *-- Description： info notification
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { LayoutService } from 'src/app/shared/services';

@Component({
  selector: 'app-info-notification',
  templateUrl: './info-notification.component.html',
  styleUrls: ['./info-notification.component.scss'],
})
export class InfoNotificationComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<InfoNotificationComponent>,
    public layoutService: LayoutService
  ) {}

  ngOnInit(): void {}
}
