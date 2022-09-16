import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
    IFractionalUnit,
    calculateFraction,
    isDivisibleByAnyFractionOf,
} from '../utilities/utility-decimal-to-from-fractions';

import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
    selector: 'fractional-units',
    templateUrl: './fractional-units.component.html',
    styleUrls: ['./fractional-units.components.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FractionalUnitsComponent {
    @Input() value: number | null;
    @Input() displayedIncrements = [64];

    get result(): IFractionalUnit {
        return !this.value
            ? ({ wholeUnits: 0, hasFraction: () => false } as IFractionalUnit)
            : calculateFraction(this.value);
    }

    constructor() {}

    @Input()
    get showAsDecimal() {
        return this._showAsDecimal
            || !isDivisibleByAnyFractionOf(this.value ?? "", ...this.displayedIncrements);
    }
    set showAsDecimal(value) {
        this._showAsDecimal = coerceBooleanProperty(value);
    }
    private _showAsDecimal: boolean;
}
