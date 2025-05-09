/** --------------------------------------------------------------------------------
 *-- Description： tag
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import { Mapper } from './tag.config';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent implements OnInit {
  @Input()
  label!:
    | 'Valid'
    | 'New'
    | 'Invalid'
    | 'Trade'
    | 'Search'
    | 'ValidCustomer'
    | 'InvalidCustomer';
  labelMapper = Mapper;
  constructor() {}

  ngOnInit(): void {}
}
