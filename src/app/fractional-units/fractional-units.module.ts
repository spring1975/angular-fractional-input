import { CommonModule } from '@angular/common';
import { FractionalUnitsComponent } from './fractional-units.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [FractionalUnitsComponent],
    imports: [CommonModule, MatTooltipModule],
    exports: [FractionalUnitsComponent]
})
export class FractionalUnitsModule {}
