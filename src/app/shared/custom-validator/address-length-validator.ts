import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { STRING_UTIL } from '../utils/stringUtilities';
import { maxBy } from 'ramda';

/**
 * 取得一個針對特殊算法中文輸入欄位的 Form Validator。
 * 參照 STRING_UTIL.utf8Length()
 * @param maxBytesLength 最大中文字長度。e.g. 限制 n 個中文字，則此欄位輸入 15。
 * @returns Validator
 */
export function createAddressLengthValidator(maxBytesLength: number): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const length = STRING_UTIL.utf8Length(value);
        const isWrong = length > maxBytesLength * 3; // 中文字 = 3 bytes

        if (isWrong)
            return { tooLong: true};

        return null;
    }
}