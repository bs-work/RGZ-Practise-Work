import { Component } from '@angular/core';
import { ChildcompComponent } from '../childcomp/childcomp.component';

@Component({
  selector: 'app-parentcomp',
  standalone: true,
  imports: [ChildcompComponent],
  templateUrl: './parentcomp.component.html',
  styleUrl: './parentcomp.component.css'
})

export class ParentcomptComponent {
  title = 'Parent Comp';
  // myInputMessage ="this is parent component";
  parentcomp='that is parent'
  GetChildData(data: any){
    console.log(data);
  }
}
