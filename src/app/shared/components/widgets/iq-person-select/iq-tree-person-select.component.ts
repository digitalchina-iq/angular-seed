import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person, PersonService } from 'app/shared/services/index';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'iq-tree-person-select',
  templateUrl: './iq-tree-person-select.component.html',
  styleUrls: ['./iq-tree-person-select.component.scss']
})
export class IqTreePersonSelectComponent implements OnInit {
  departmentOpen = {};
  childDepartmentList: any = {};
  personList: any = {};
  subscriber: Subscription = new Subscription();
  subscriber2: Subscription = new Subscription();
  choosed: {[prop: string]: boolean} = {};
  departmentChoosed: {[prop: string]: boolean} = {};

  @Input('departmentCheck') whichCheck: string;
  @Input() departmentList: any = [];

  private _persons: any[] = [];
  @Input('selectedPerson')
  set perons(list: any[]){
    if(!(list instanceof Array)) {
      return;
    }
    this.choosed = {};
    list.forEach(item => {
      if(typeof item === 'string') {
        this.choosed[item] = true;
      } else {
        this.choosed[item.id] = true;
      }
    })
    this._persons = list;
    this.selectedPersonChange.emit(list);
  };
  get perons(){
    return this._persons;
  }

  private _departments: any = [];
  @Input('selectedDepartment')
  set departments(list: any[]){
    if(!(list instanceof Array)) {
      return;
    }
    this.departmentChoosed = {};
    list.forEach(item => {
      if(typeof item === 'string') {
        this.departmentChoosed[item] = true;
      } else {
        this.departmentChoosed[item.id] = true;
      }
    })
    this._departments = list;
    this.selectedDepartmentChange.emit(list);
  };
  get departments(){
    return this._departments;
  }

  @Output('selectedPersonChange') selectedPersonChange: EventEmitter<any[]> = new EventEmitter();
  @Output('selectedDepartmentChange') selectedDepartmentChange: EventEmitter<any[]> = new EventEmitter();

  constructor(private personService: PersonService) {}

  ngOnInit() {
  }

  getChildDepartment(id, sub) {
    if(this.departmentOpen[id]) {
      this.subscriber.unsubscribe();
      this.subscriber2.unsubscribe();
      this.departmentOpen[id] = false;
      return;
    }
    
    this.departmentOpen[id] = true;

    if(sub && !this.childDepartmentList[id]) {
      this.subscriber = this.personService.getDepartment(id).subscribe(v => {
        this.childDepartmentList[id] = v.json().data;
      })
    }

    if(!this.personList[id]) {
      this.subscriber2 = this.personService.getDepartmentPersons(id).subscribe(list => {
        this.personList[id] = list;
        list.forEach(item => {
          this.choosed[item.id] = false;
        })
      })
    }
  }

  toggle(item) {
    if(this.choosed[item.id]) {
      this.choosed[item.id] = false;
      this.perons = this.perons.filter(person => person.id !== item.id);
    } else {
      this.choosed[item.id] = true;
      this.perons.push(item);
    }
    this.selectedPersonChange.emit(this.perons);
  }

  toggleDepartment(item) {
    if(this.departmentChoosed[item.id]) {
      this.departmentChoosed[item.id] = false;
      this.departments = this.departments.filter(department => department.id !== item.id);
    } else {
      this.departmentChoosed[item.id] = true;
      this.departments.push(item);
    }

    this.selectedDepartmentChange.emit(this.departments);
  }
}