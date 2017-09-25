import { Component, OnInit} from '@angular/core';

import { HeaderService } from 'app/core/services/header.service'
import { PersonService } from 'app/shared/services/person.service';

@Component({
  selector: 'iq-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loginUser;
  config;
  constructor(private headerService: HeaderService,private personService:PersonService) {
    this.config = headerService.config;
  }
  goto(href){
    window.open(href);
  }
  html = `<ul>
    <li>个人中心</li>
    <li>设&emsp;&emsp;置</li>
    <li>注&emsp;&emsp;销</li>
  </ul>`;
  title = "标题";
  rnav= true;
  ngOnInit() {
    this.personService.loginUser.subscribe((user)=>{
        this.loginUser = user;
    });
  }
}
