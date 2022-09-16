import { FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export enum UnitOfMeasure {
    Inches = 'inches',
    Feet = 'feet',
    None = 'none',
}

export const DEFAULT_FRACTION_MAX_VALUE = 999.99999; // Maximum allowable size in the database

@Component({
    selector: 'formatted-fractional-input[unitOfMeasure]',
    templateUrl: './formatted-fractional-input.component.html',
    styleUrls: ['./formatted-fractional-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormattedFractionalInputComponent),
            multi: true
        }
    ],
    // tslint:disable-next-line:use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None
})
export class FormattedFractionalInputComponent {
    readonly formControl = new FormControl<number|null>(null, Validators.max(DEFAULT_FRACTION_MAX_VALUE));
    subs: Subscription;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() unitOfMeasure: UnitOfMeasure;

    @Input()
    get required(): boolean {
        return this._required;
    }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
    }
    private _required = false;

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.formControl.disable() : this.formControl.enable();
    }
    private _disabled = false;

    @Input()
    get noLabel(): boolean {
        return this._noLabel;
    }
    set noLabel(value: boolean) {
        this._noLabel = coerceBooleanProperty(value);
    }
    private _noLabel = false;

    @Input()
    get readonly(): boolean {
        return this._readonly;
    }
    set readonly(value: boolean) {
        this._readonly = coerceBooleanProperty(value);
    }
    private _readonly = false;

    // model --> view
    writeValue(value: number): void {
        if (value || value === 0) {
            this.formControl.reset(value, { emitEvent: false });
        }
    }

    // view --> model
    registerOnChange(fn: (value: number | null) => void) {
        this.subs = this.formControl.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    onTouched: () => void = () => { };

    onDesroy() {
        this.subs.unsubscribe();
    }
}
