import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragdrop]',
  standalone: true,
})
export class DragdropDirective {
  @HostBinding('class.fileover') fileOver: boolean;

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(event) {
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event) {
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) public onDrop(event) {
    this.fileOver = false;
  }
}
