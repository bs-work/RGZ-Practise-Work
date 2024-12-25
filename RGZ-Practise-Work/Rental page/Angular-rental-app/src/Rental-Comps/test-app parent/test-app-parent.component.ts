import { Component } from '@angular/core';
import { TestAppComponentChild } from '../test-app child/test-app-child.component';

@Component({
  selector: 'app-test-app',
  standalone: true,
  imports: [TestAppComponentChild],
  templateUrl: './test-app-parent.component.html',
  styleUrl: './test-app.component.css'
})
export class TestAppComponent {
title = 'test-app-child';
myInputMessage:string = "this is parent component";
}
