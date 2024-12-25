import { Component, OnInit } from '@angular/core';
import { AddressClass } from '../AddressClass/AdressClass';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})

export class StudentClass implements OnInit{
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public phone: number,
        public gender: string,
        public course: string,
        public sendUpdates: boolean,
        public bloodGroup: string,
        public address: AddressClass
    ) { }
    ngOnInit(): void {}
}