import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentClass } from '../Model/StudentClass/StudentClass';
@Injectable({
  providedIn: 'root'
})

export class EnrollmentService {
  _url = 'https://localhost:44302/Api/Student/';
  constructor(private _http: HttpClient) { }
  addStudent(student: StudentClass){
    return this._http.post<any>(this._url + 'AddStudent', student)
  }
  editStudent(student: StudentClass){
    return this._http.put<any>(this._url + 'EditStudent', student)
  }
  deleteStudent(id: number){
    return this._http.delete<any>(this._url + 'DeleteStudent?id=' + id);
  }
  getAllStudents(): Observable<any[]> {
    return this._http.get<any[]>(this._url+'AllStudentsDetails');
  }
  getStudent(id: number): Observable<any> {
    return this._http.get<any[]>(this._url+'GetStudent?id=' + id);
  }
}