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
  ViewChild
} from '@angular/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-plus-minus-input',
  templateUrl: './plus-minus-input.component.html',
  styleUrls: ['./plus-minus-input.component.scss']
})
export class PlusMinusInputComponent implements OnInit {
  @ViewChild(MatInput)
  input!: MatInput;
  @Output()
  numberChange = new EventEmitter<number>();
  @Output()
  isTyping = new EventEmitter<number>();
  @Input()
  type!: string;
  @Input()
  disableCond!: boolean;
  @Input()
  _label!: string;
  @Input()
  set _value(val: number) {
    this._previousValue = this._internalValue;
    this._internalValue = val;
  }
  get _value(): number {
    return this._internalValue;
  }
  private _internalValue = 0;
  private _previousValue = 0;
  @Input()
  _step!: number;
  @Input()
  _min!: number;
  @Input()
  _max!: number;
  @Input()
  _wrap!: boolean;
  @Input()
  color!: string;
  constructor() {}

  ngOnInit(): void {}

  @Input('value')
  set inputValue(_value: number) {
    this._value = this.parseNumber(_value);
  }

  @Input()
  set step(_step: number) {
    this._step = this.parseNumber(_step);
  }

  @Input()
  set min(_min: number) {
    this._min = this.parseNumber(_min);
  }

  @Input()
  set max(_max: number) {
    this._max = this.parseNumber(_max);
  }

  @Input()
  set wrap(_wrap: boolean) {
    this._wrap = this.parseBoolean(_wrap);
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
    this.color = color;
  }

  /** get color */
  getColor(): string {
    return this.color;
  }

  typing(inputValue: any): void{
    this.isTyping.emit(inputValue);
  }
  onKey(inputValue: any): void {
    inputValue = this.parseNumber(inputValue);
    this.numberChange.emit(inputValue);
    if(inputValue % this._step == 0){
      this._value = inputValue;
    }else{
      this._value = this._previousValue;
    }
  }

  fixInputValue(currentValue: number, step: number): number {
    if (currentValue % step == 0)
      return currentValue + step;

    // 依據 step 向上或向下修正到應有的倍數值
    const remainder = currentValue % Math.abs(step);

    // 如果 step 是正數 (小->大)，到下一個倍數的差是 (step - remainder) = currentValue + step - remainder
    // 如果 step 是負數 (大->小)，到上一個倍數的差是 (remainder) = currentValue - remainder

    currentValue -= remainder;

    if (step >= 0)
      currentValue += step;

    return currentValue;
  }

  /** increase value */
  incrementValue(step: number = 1): void {
    let inputValue = this._value;

    inputValue = this.fixInputValue(inputValue, step);

    inputValue = Math.max(this._min, inputValue);
    inputValue = Math.min(inputValue, this._max);

    if (this._wrap) {
      inputValue = this.wrappedValue(inputValue);
    }

    this.numberChange.emit(inputValue);
    this._value = inputValue;
  }

  /** wrapped value */
  private wrappedValue(inputValue: number): number {
    if (inputValue > this._max) {
      return this._min + inputValue - this._max;
    }

    if (inputValue < this._min) {
      if (this._max === Infinity) {
        return 0;
      }

      return this._max + inputValue;
    }

    return inputValue;
  }

  /** disable decrement */
  shouldDisableDecrement(inputValue: number): boolean {
    if (this.disableCond) {
      return true;
    }

    return (
      (!this._wrap && inputValue <= this._min) ||
      (!this._wrap && inputValue - this._step < this._min)
    );
  }

  /** disable increment */
  shouldDisableIncrement(inputValue: number): boolean {
    if (this.disableCond) {
      return true;
    }

    return (
      (!this._wrap && inputValue >= this._max) ||
      (!this._wrap && inputValue + this._step > this._max)
    );
  }

  /** set input focus */
  setInputFocus(): void {
    this.input.focus();
  }
}
