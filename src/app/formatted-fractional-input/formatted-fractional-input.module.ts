import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { CtrlOptionClickModule } from '../utilities/ctrl-option-click/ctrl-option-click.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormattedFractionalInputComponent } from './formatted-fractional-input.component';
import { FractionalInputComponent } from './fractional-input/fractional-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { FractionalUnitsModule } from '../fractional-units/fractional-units.module';

@NgModule({
    declarations: [FormattedFractionalInputComponent, FractionalInputComponent],
    imports: [
        CommonModule,
        CtrlOptionClickModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        FractionalUnitsModule
    ],
    exports: [FormattedFractionalInputComponent, FractionalInputComponent]
})
export class FormattedFractionalInputModule { }
