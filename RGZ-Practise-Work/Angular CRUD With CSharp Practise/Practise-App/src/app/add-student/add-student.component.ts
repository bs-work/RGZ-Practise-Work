import { Component, OnInit } from '@angular/core';
import { AddressClass } from '../Model/AddressClass/AdressClass';
import { EnrollmentService } from '../enrollment-service.service';
import { StudentClass } from '../Model/StudentClass/StudentClass';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})

export class AddStudentComponent implements OnInit {
  groups=['A+', 'A-', 'B+', 'B-', 'O+', 'O-'];
  addressModel = new AddressClass("", "", "");
  studentModel = new StudentClass(0,"", "", null, "", "", true, "", this.addressModel)
  constructor(private _enrollmentService: EnrollmentService, private route: ActivatedRoute, private router : Router) {
    console.log("constructor calling..");
  }
  
  SubmitDetails(studentData: { id: number; }){
    console.log(studentData);
    if(studentData.id == 0){
        this._enrollmentService.addStudent(studentData)
      .subscribe(
        (data: any) => {
          console.log('success', data);
          this.router.navigate(['/studentList']);
        },
        ( error: any) => console.log('Error', error)
      );
    }else
    {
        this._enrollmentService.editStudent(studentData)
      .subscribe(
        (data: any) => {
          console.log('success', data);
          this.router.navigate(['/studentList']);
        },
        (   error: any) => console.log('Error', error)
      );
    }
  }
  
  ngOnInit() {
    console.log("ngOnInit method calling..");
    var id = parseInt(this.route.snapshot.paramMap.get('id'));
    this._enrollmentService.getStudent(id).subscribe(data => this.studentModel = data);
  }
}