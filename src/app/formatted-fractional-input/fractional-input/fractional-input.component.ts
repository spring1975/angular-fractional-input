import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  Optional,
  Self,
  DoCheck,
} from '@angular/core';
import { FormControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  isNumeric,
  isEmptyInputValue,
} from '../../utilities/utility-functions';
import {
  calculateFraction,
  fractionAsDecimal,
  isDivisibleByAnyFractionOf,
} from '../../utilities/utility-decimal-to-from-fractions';
import { Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'fractional-input',
  templateUrl: './fractional-input.component.html',
  styleUrls: ['./fractional-input.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: FractionalInputComponent,
    },
  ],
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '(blur)': 'onTouched()',
  },
})
export class FractionalInputComponent
  implements
    MatFormFieldControl<number | null>,
    OnDestroy,
    DoCheck,
    ControlValueAccessor
{
  static nextId = 0;
  stateChanges = new Subject<void>();
  focused = false;
  controlType = 'fractional-input';
  id = `fractional-input-${FractionalInputComponent.nextId++}`;
  describedBy = '';
  formControl = new FormControl<string | number | null>(null, {
    updateOn: 'blur',
  });

  @Input() displayedIncrements = [64];

  // tslint:disable-next-line:prefer-inline-decorator
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  // tslint:disable-next-line:prefer-inline-decorator
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  // tslint:disable-next-line:prefer-inline-decorator
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.formControl.disable() : this.formControl.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  // tslint:disable-next-line:prefer-inline-decorator
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _readonly = false;

  // tslint:disable-next-line:prefer-inline-decorator
  @Input()
  get value(): string | number | null {
    return this.formControl.value;
  }
  set value(value: string | number | null) {
    this.formControl.setValue(value, { emitEvent: false });
    this.stateChanges.next();
  }

  get empty() {
    return isEmptyInputValue(this.formControl.value);
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get errorState(): boolean {
    return (this.ngControl.invalid && this.ngControl.touched) ?? false;
  }
  showDecimal = false;

  constructor(
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef, true).subscribe((origin) => {
      this.focused = !!origin;

      if (!origin) {
        this.onTouched();
      }

      this.stateChanges.next();
    });
  }

  keyPress(event: KeyboardEvent) {
    const digitOrDecimalPoint = /[\d\./ ]/;

    if (!digitOrDecimalPoint.test(event.key)) {
      event.preventDefault();
    }
  }

  ngDoCheck() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
  }

  setDisabledState(isDisabled: boolean) {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      // tslint:disable-next-line:no-non-null-assertion
      this.elRef.nativeElement.querySelector('input')!.focus();
    }
    this.stateChanges.next();
  }

  // model --> view
  writeValue(value: string | number): void {
    this.formControl.setValue(
      this.showDecimal && typeof value === 'string'
        ? fractionAsDecimal(value)
        : this.formatValue(value),
      {
        emitEvent: false,
      }
    );
  }

  formatValue(value: string | number): string | null {
    if (
      value &&
      isNumeric(value) &&
      isDivisibleByAnyFractionOf(value, ...this.displayedIncrements)
    ) {
      const fractionalUnit = calculateFraction(value);
      return fractionalUnit && fractionalUnit.hasFraction()
        ? `${fractionalUnit.isNegative ? '-' : ''}${
            fractionalUnit.wholeUnits
          }-${fractionalUnit.remainder}/${fractionalUnit.denominator}`
        : `${fractionalUnit.isNegative ? '-' : ''}${fractionalUnit.wholeUnits}`;
    }
    return value;
  }
  // view --> model
  registerOnChange(fn: (value: number) => void) {
    this.formControl.valueChanges
      .pipe(
        tap((value) => this.writeValue(value)),
        map((value) => (this.showDecimal ? value : fractionAsDecimal(value)))
      )
      .subscribe(fn);
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  onTouched: () => void = () => {};

  toggleAsDecimal(): void {
    this.showDecimal = !this.showDecimal;
    /* NOTE: Blur to trigger value changes before updateValueAndValidity.
     * This handles the scenario of changing the number and Ctrl-click
     * before the value has been blurred, thus updated.
     */
    // tslint:disable-next-line: no-non-null-assertion
    this.elRef.nativeElement.querySelector('input')!.blur();
    this.formControl.updateValueAndValidity();
    this.stateChanges.next();
  }
}
