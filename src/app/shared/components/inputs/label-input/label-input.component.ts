/** --------------------------------------------------------------------------------
 *-- Description： label input
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormGroupDirective,
  ControlContainer,
  FormGroup,
} from '@angular/forms';
import { pairwise, shareReplay, tap } from 'rxjs';
import { STRING_UTIL } from 'src/app/shared/utils/stringUtilities';

@Component({
  selector: 'app-label-input',
  templateUrl: './label-input.component.html',
  styleUrls: ['./label-input.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class LabelInputComponent implements OnInit {
  @Input() group!: FormGroup;
  @Output() addrLength = new EventEmitter<number>();;
  @Input() field!: {
    count?: number;
    showCount?: boolean;
    type: string;
    label: string;
    labelPosition?: string;
    inputType: string;
    name: string;
    placeholder: string;
    hint: string;
    isaddr?: boolean;
    validations: {
      hasErrorMessage: boolean;
      errorMessage: any;
    };
    class?: string;
    stylePadding?: string;
    styleMargin?: string;
  };

  addr = "";
  constructor(private rootformGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.group = this.rootformGroup.control;

    if (this.field.isaddr && this.field.count)
      this.group.get(this.field.name)?.valueChanges
        .pipe(tap((next) => this.fixAddrLength(next)))
        .subscribe();
  }

  getAddrLength($event: string){
    this.addr = $event;
    if(this.field.isaddr){
      this.addrLength.emit(this.getLength($event));
    }
  }

  getLength(str: string | null = null): number {
    if (!this.field.isaddr)
      return (str ?? this.group.value[this.field.name])?.length ?? 0;

    return STRING_UTIL.utf8LengthForView(str ?? this.addr);
  }

  fixAddrLength(next: string): void {
    if (!this.field.isaddr || !this.field.count)
      return;

    if (STRING_UTIL.utf8LengthForView(next) <= this.field.count)
      return;

    this.group.get(this.field.name)?.patchValue(STRING_UTIL.spliceUntilUtf8Length(next, this.field.count));
  }
}
