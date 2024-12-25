import { Component, EventEmitter, output, Output } from '@angular/core';

@Component({
  selector: 'app-book-button',
  standalone: true,
  templateUrl: './book-button.component.html',
  styleUrls: ['./book-button.component.css']
})
export class BookButtonComponent {
  @Output() bookNow = new EventEmitter<void>();
  handleClick() {
    this.bookNow.emit(); 
  }
}
