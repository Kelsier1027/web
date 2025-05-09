/** --------------------------------------------------------------------------------
 *-- Description： increment input
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import {
  Output,
  Component,
  Input,
  OnInit,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-increment-input',
  templateUrl: './increment-input.component.html',
  styleUrls: ['./increment-input.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class IncrementInputComponent implements OnInit {
  @ViewChild(MatInput) input!: MatInput;
  @Output()
  numberChange = new EventEmitter<number>();
  @Input()
  disableCond: boolean = false;
  @Input() group!: FormGroup;
  @Input() field!: {
    type: string;
    label: string;
    inputType: string;
    name: string;
    _label: string;
    _value: number;
    _step: number;
    _min: number;
    _max: number;
    _wrap: boolean;
    color: string;
    class?: string;
  };
  @Input() min: number = 0;
  @Input() max: number = 0;

  constructor(private rootformGroup: FormGroupDirective) {}
  ngOnInit(): void {
    this.group = this.rootformGroup.control;
  }

  @Input('value')
  set inputValue(_value: number) {
    this.field._value = this.parseNumber(_value);
  }

  @Input()
  set step(_step: number) {
    this.field._step = this.parseNumber(_step);
  }

  @Input()
  set wrap(_wrap: boolean) {
    this.field._wrap = this.parseBoolean(_wrap);
  }

  @Input()
  set label(_label: string) {
    this.field._label = _label;
  }

  /** parse number */
  private parseNumber(num: any): number {
    return +num;
  }

  /** parse boolean */
  private parseBoolean(bool: any): boolean {
    return !!bool;
  }

  /** set color */
  setColor(color: string): void {
    this.field.color = color;
  }

  /** get color */
  getColor(): string {
    return this.field.color;
  }

  fixInputValue(currentValue: number, step: number): number {
    if (currentValue % step == 0)
      return currentValue + step;

    // 依據 step 向上或向下修正到應有的倍數值
    const remainder = currentValue % Math.abs(step);

    // 如果 step 是正數 (小->大)，到下一個倍數的差是 (step - remainder) = currentValue + step - remainder
    // 如果 step 是負數 (大->小)，到上一個倍數的差是 (remainder) = currentValue - remainder

    currentValue += Math.max(step, 0);
    currentValue -= remainder;

    return currentValue;
  }

  /** increase value */
  incrementValue(step: number = 1): void {
    let inputValue = this.field._value;

    inputValue = this.fixInputValue(inputValue, step);

    if (inputValue > this.max) return;

    if (this.field._wrap) {
      inputValue = this.wrappedValue(inputValue);
    }

    this.field._value = inputValue;
    this.numberChange.emit(this.field._value);
  }

  valueChange() {
    if (this.field._value > this.max) this.field._value = this.max;
    if (this.field._value < this.min) this.field._value = this.min;
    if (isNaN(parseInt(this.field._value?.toString()))) {
      this.field._value = this.min;
    }
    let step = this.field._step ?? 1;
    let groupCount = Math.floor(this.field._value / step);
    let value = groupCount * step;
    this.numberChange.emit(value);
    this.field._value = value;
  }

  /** wrapped value */
  private wrappedValue(inputValue: number): number {
    if (inputValue > this.max) {
      return this.min + inputValue - this.max;
    }

    if (inputValue < this.min) {
      if (this.max === Infinity) {
        return 0;
      }

      return this.max + inputValue;
    }

    return inputValue;
  }

  /** disable decrement */
  shouldDisableDecrement(inputValue: number): boolean {
    return this.disableCond || inputValue <= this.min;
  }

  /** disable increment */
  shouldDisableIncrement(inputValue: number): boolean {
    return this.disableCond || inputValue >= this.max;
  }

  /** set input focus */
  setInputFocus(): void {
    this.input.focus();
  }
}
