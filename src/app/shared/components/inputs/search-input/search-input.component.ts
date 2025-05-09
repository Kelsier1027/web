/** --------------------------------------------------------------------------------
 *-- Description： search input
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit {
  @Input() placeholder = '';
  @Input() inputValue!: string;
  @Output() searchChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  /** close click */
  close(): void {
    this.inputValue = '';
    this.searchChange.emit(this.inputValue);
  }

  /** search change */
  onSearchChange() {
    this.searchChange.emit(this.inputValue?.replace('\b', ''));
  }
}
