/** --------------------------------------------------------------------------------
 *-- Description： custom validators
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidator {
  static match(firstControlName: string, secondControlName: string) {
    return (control: AbstractControl) => {
      const firstControl = control.get(firstControlName);
      const secondControl = control.get(secondControlName);
      if (firstControl?.value !== secondControl?.value) {
        return secondControl?.setErrors({ match: true });
      } else {
        return secondControl?.setErrors(null);;
      }
    };
  }

  static validPassword(control: AbstractControl): ValidationErrors | null {
    const pattern = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/;
    return pattern.test(control.value) ? null : { password: true };
  }
}
export const passwordMatchingValidatior: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('recheckPassword');
  // if the password or confirmation has not been inserted ignore
  if (!password || !confirmPassword) {
    return null;
  }
  // set the error in the confirmation input/control
  if (
    confirmPassword.value !== password.value &&
    confirmPassword.value !== ''
  ) {
    confirmPassword.setErrors({ notmatched: true });
  } else if (confirmPassword.value === '') {
    confirmPassword.setErrors({ required: true });
  } else {
    confirmPassword.setErrors(null);
  }
  // always return null here since as you'd want the error displayed on the confirmation input
  return null;
};
