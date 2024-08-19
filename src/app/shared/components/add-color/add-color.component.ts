import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragdropDirective } from '../../directives/dragdrop.directive';

@Component({
  selector: 'app-add-color',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragdropDirective],
  templateUrl: './add-color.component.html',
  styleUrl: './add-color.component.scss',
})
export class AddColorComponent {
  @Output() onFileUpload: EventEmitter<File> = new EventEmitter<File>();
  @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
  @Output() onNameChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() isOnlyOne: boolean;
  @Input() isDuplicated: boolean;

  @Input() file: string;
  @Input() name: string = '';

  @Input() isLast: boolean = false;
  @Input() index: number = 0;

  fileUploaded(event: any): void {
    const file = event?.target?.files?.[0];

    if (file) {
      this.convertForSrc(event);
      this.onFileUpload.next(file);
    }
  }

  convertForSrc(event: any): void {
    var reader = new FileReader();

    reader.onload = (event: any) => {
      this.file = event.target.result;
    };

    reader.onerror = (event: any) => {
      console.log('File could not be read: ' + event.target.error.code);
    };

    reader.readAsDataURL(event?.target?.files?.[0]);
  }
}
