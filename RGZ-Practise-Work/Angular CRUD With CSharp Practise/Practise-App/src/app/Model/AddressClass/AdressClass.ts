import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})

export class AddressClass implements OnInit {
  constructor(
    public street: string,
    public city: string,
    public state: string,
  ) { }

ngOnInit(): void {}
}
