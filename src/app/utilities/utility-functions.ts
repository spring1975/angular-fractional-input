import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function isNumeric(value: any) {
  return !isEmptyInputValue(value) && !isNaN(value);
}

// The following function is pulled direct from the Angular source code
// It's primarily used inside of input Validator functions
export function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

export const touchControl =
  (control: AbstractControl) => (fn: () => void) => () => {
    fn();
    control.markAllAsTouched();
  };

export function buildArrayFromEnum(enumType: {
  [id: number]: string;
}): string[] {
  return Object.keys(enumType).filter(
    (k) => typeof enumType[k as any] !== 'number'
  );
}
// There's currently no way to get all of the errors from a formgroup.
// This will get the errors of the formgroup as well as each individual
// error of each formcontrol of the group
export function collectErrors(ctrl: AbstractControl): ValidationErrors | null {
  if (isFormGroup(ctrl)) {
    return Object.keys(ctrl.controls).reduce(
      (a, k) => {
        const errors = ctrl.controls[k].errors;
        errors ? errors : a;
        return a;
      },
      ctrl.errors ? [ctrl.errors] : []
    ) as ValidationErrors;
  } else {
    return ctrl.errors;
  }
}

export function isFormGroup(control: AbstractControl): control is FormGroup {
  return (control as FormGroup).controls !== undefined;
}

export function isArray<T>(item: T | T[]): item is T[] {
  return (item as T[])?.length !== undefined;
}

export type FormGroupControlsAccessor<TModel> = {
  [K in keyof TModel]: AbstractControl;
};

export function getFormGroupControlsAccessor<TModel>(formGroup: FormGroup) {
  return new Proxy(
    {},
    {
      get: (_target, prop, _receiver) => {
        return formGroup.get(prop as string);
      },
    }
  ) as FormGroupControlsAccessor<TModel>;
}
