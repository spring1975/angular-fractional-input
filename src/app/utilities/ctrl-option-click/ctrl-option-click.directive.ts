import {
    Directive,
    EventEmitter,
    HostListener,
    Output,
} from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[ctrl-option-click]',
})

/**
 * Add custom functionality when Ctrl/Alt/Option is held while clicking an element.
 * Source: https://stackoverflow.com/questions/27178680/angular-ctrl-click
 */
export class CtrlOptionClickDirective {
    @Output('ctrl-option-click') readonly ctrlClickEvent = new EventEmitter();

    @HostListener('click', ['$event']) onClick(event: KeyboardEvent){
        if (event.ctrlKey || event.altKey) {
            event.preventDefault();
            event.stopPropagation();
            // unselect accidentally selected text (browser default behaviour)
            document.getSelection()?.removeAllRanges();

            this.ctrlClickEvent.emit(event);
        }
    }
}
