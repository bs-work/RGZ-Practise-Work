import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})

export class ContactUsComponent implements OnInit {
  contactusForm!: FormGroup;
  submitted = false;

  constructor() {}

  ngOnInit(): void {
    this.contactusForm = new FormGroup({
      fullName: new FormControl('', [Validators.required, this.noNumbersValidator]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]),
      cityCountry: new FormControl('', [Validators.required, this.noNumbersValidator]),
      message: new FormControl('', [Validators.required])
    });
  }

  noNumbersValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && /\d/.test(value)) {
      return { 'containsNumber': true };
    }
    return null;
  }

  onSubmit(): void {
    this.submitted = true; 
    if (this.contactusForm.valid) {
      console.log(this.contactusForm.value);
    }
  }
}