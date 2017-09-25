import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../../environments/environment';

//Observable,delay,of为模拟http请求使用
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';

//模拟数据
const RESULT_MALE = {
  list: [
    {id:'a1',name:'aaa',gender:0,country:'CN',birthday:new Date('1992/1/3'),joinDate:new Date('2003/3/3')},
    {id:'a2',name:'bbb',gender:0,country:'US',birthday:new Date('1985/2/5'),joinDate:new Date('2012/3/5')},
    {id:'a3',name:'ccc',gender:0,country:'UK',birthday:699638400000,joinDate:new Date('2013/4/23')},
    {id:'a4',name:'ddd',gender:0,country:'FR',birthday:699637403000,joinDate:new Date('2013/4/23')},
    {id:'a5',name:'eee',gender:0,country:'OT',birthday:699637403000,joinDate:new Date('2013/4/23')}
  ],
  pager: {
    pageSize: 10,
    pageNo: 1,
    total: 5,
    totalPages: 1
  },
  success: true,
  message: '成功',
  status: 200
}

const RESULT_FEMALE = {
  list: [
    {id:'b1',name:'qqq',gender:1,country:'CN',birthday:new Date('1990/3/6'),joinDate:new Date('2013/4/23')},
    {id:'b2',name:'www',gender:1,country:'US',birthday:699638400000,joinDate:new Date('2013/4/23')},
    {id:'b3',name:'eee',gender:1,country:'UK',birthday:new Date('1990/3/6'),joinDate:new Date('2013/4/23')},
    {id:'b4',name:'rrr',gender:1,country:'FR',birthday:699637403000,joinDate:new Date('2013/4/23')},
    {id:'b5',name:'ttt',gender:1,country:'OT',birthday:new Date('1990/3/6'),joinDate:new Date('2013/4/23')}
  ],
  pager: {
    pageSize: 10,
    pageNo: 1,
    total: 5,
    totalPages: 1
  },
  success: true,
  message: '成功',
  status: 200
}

export class Query {
  id: string;
  name: string;
  birthday: string;
  joinDateStart: string;
  joinDateEnd: string;
  gender: number = 0;//0：男，1：女
  country: string = '';//CN：中国，US：美国，UK：英国，FR：法国，OT：其他
  pageSize: number;
  pageNo: number;
}

export class Hero {
  checked: boolean;
  id: string;
  name: string;
  birthday: Date|number|string;
  joinDate: Date|number|string;
  gender: number;//0：男，1：女
  country: string;//CN：中国，US：美国，UK：英国，FR：法国，OT：其他
}

class EduInfo {
  startDate: Date|number|string;
  endDate: Date|number|string;
  school: string;
  diploma: string;//学位
}

class Relation {
  relation: string;
  name: string;
  age: number;
  tel: string;
  address: string;
}

export class HeroDetail extends Hero {
  age: number;
  tel: string;
  address: string;
  email: string;
  height: number;//身高，cm
  weight: number;//体重，kg
  adminID: string;//审核人id
  eduInfos: EduInfo[];//教育信息
  relations: Relation[];//人际关系
}

@Injectable()
export class HeroListService {

  constructor(private http: Http) {}

  /**获取英雄列表数据*/
  getHeroList(query: Query): Promise<{list: any[], pager: any, success: boolean, message: string}>{
    //请求真实api
    //let {id, name, birthday, joinDateStart, joinDateEnd, gender, country, pageSize, pageNo} = query;
    //return this.http.get(environment.server + 'hero-list', {params: {id, name, birthday, joinDateStart, joinDateEnd, gender, country, pageSize, pageNo}}).toPromise().then(data => data.json());

    //模拟请求数据
    let dataOb = (gender: number) => Observable.of(!gender?RESULT_MALE:RESULT_FEMALE).delay(2000).toPromise();
    return dataOb(query.gender);
  }

  /**获取文件上传接口*/
  getHeroImportApi(): string {
    return environment.server + 'upload-api';
  }

  /**根据英雄id删除英雄*/
  deleteHero(id: string): Promise<{message: string, success: boolean}> {
    //请求真实api
    //return this.http.delete(environment.server + `delete-hero/${id}`).toPromise().then(data => data.json());
    
    //模拟请求返回结果
    return Observable.of({message: '删除成功', success: true, status: 200}).delay(1000).toPromise();
  }

  /**新添加英雄*/
  addHero(hero: Hero): Promise<{message: string, success: boolean}> {
    //请求真实api
    //return this.http.post(environment.server + 'add-hero', hero).toPromise().then(data => data.json());

    //模拟请求返回结果
    return Observable.of({message: '添加成功', success: true, status: 200}).delay(1000).toPromise();
  }

  /**获取英雄详情*/
  getHeroDetail(id: string): Promise<{item: HeroDetail, success: boolean, message: string}> {
    //请求真实api
    //return this.http.get(environment.server + `hero-detail/${id}`).toPromise().then(data => data.json());

    //模拟请求返回结果
    return Observable.of({
      item: <HeroDetail>Object.assign({
        age: 18,
        tel: '13012345621',
        address: '北京中南海',
        email: '123@dc.com',
        height: 180,
        weight: 65,
        eduInfos: [
          {startDate: new Date(1990, 1, 23), endDate: new Date(1994, 8, 21), school: '清华', diploma: '学士'},
          {startDate: new Date(1994, 9 ,1), endDate: new Date(1999, 3, 30), school: '北大', diploma: '硕士'}
        ],
        relations: [
          {relation: '父子', name: '张三', age: 30, tel: '13112345678', address: '西二旗'},
          {relation: '母子', name: '李四', age: 30, tel: '13112345678', address: '上地'}
        ]
      }, <Hero>RESULT_MALE.list[Number(id.charAt(1))-1]),
      success: true,
      message: '成功',
      status: 200
    }).delay(1000).toPromise();
  }
}