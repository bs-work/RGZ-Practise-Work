import { Component,Input,Output,EventEmitter, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-app-child',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-app-child.component.html',
  styleUrl: './test-app.component.css'
})

// @Input-it can accept data from the parent component. 
// @Output-it can accept data from the parent component
//The parent component binds to a component property via property binding.
//Angular updates the value in the child component whenever the value in the parent component changes.

export class TestAppComponentChild implements OnInit {
  data:any;
  title= 'Hello World'
  id:number= 1
  height:number=30
  num1:number = 10;
  num2:number =20;
  result:number = this.num1+this.num2

//ngOnInit: Runs after a component has been initialized.Input bindings are ready.
// ngOnInit(): void {
//   throw new Error('Method not implemented.');
// }

add(){
  this.result = this.num1+this.num2;
}
//transmitting data from the child to the parent
// @Input() imageUrl!:string;
//tells Angular to create a new event emitter and that the data it emits to parent 
// @Output() uploaded = new EventEmitter<string>()
//Every time the child component has to submit data to the parent,it raises the event using EventEmitter. Using event binding, the parent keeps an eye on the output property.

//  @Input() myinputMsg!: string;
//  constructor() {}

ngOnInit(): void {
  this.data=this.getData()
}

getData(){}

// uploadimage (value:string){
//   this.uploaded.emit(value)
//   //Data will be emitted via the .emit method and sent to the parent
// }
}
