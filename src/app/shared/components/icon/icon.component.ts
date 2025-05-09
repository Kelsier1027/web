/** --------------------------------------------------------------------------------
 *-- Description： icon
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import { IconService } from '../../services';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input()
  iconName: string = '';

  @Input()
  matTooltipString: string = '';

  constructor(private iconService: IconService) {
    this.iconService.registerIcons();
  }

  ngOnInit(): void {}
}
