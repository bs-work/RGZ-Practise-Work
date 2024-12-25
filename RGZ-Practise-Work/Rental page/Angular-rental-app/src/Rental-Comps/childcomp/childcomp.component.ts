import { Component, EventEmitter, Input,OnInit,Output } from '@angular/core';

@Component({
  selector: 'app-childcomp',
  standalone: true,
  imports: [],
  templateUrl: './childcomp.component.html',
  styleUrl: './childcomp.component.css',
})

export class ChildcompComponent implements OnInit{

  // @Input () myinputMsg: string = ""
  @Output() myOutput:EventEmitter<string> = new EventEmitter<string>()
  outputMessage:string = "This is child comp"
  constructor(){}

  ngOnInit(): void {
    console.log(this.myinputMsg);
  }

  @Input()myinputMsg:string =""

  sendvalues(){
    this.myOutput.emit(this.outputMessage)
  }
 
}
