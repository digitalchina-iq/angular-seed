import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WindowService } from 'app/core';

//引入类和服务
import { HeroDetail, HeroListService } from '../../services/hero-list.service';


@Component({
  templateUrl: 'hero-detail.component.html',
  styleUrls:['hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit{

  loading: boolean = true;//加载中效果
  hero: HeroDetail = new HeroDetail();
  showInfo: true;//展示基本信息

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private windowService: WindowService,
    private heroListService: HeroListService){}

  ngOnInit() {
    
    let id = this.activatedRoute.snapshot.params['id'];//获取路由id

    this.loading = true;
    this.heroListService.getHeroDetail(id).then(data => {//根据id获取英雄详细信息
      this.loading = false;

      if(data.success) {
        this.hero = data.item;
      } else {
        this.windowService.alert({message: data.message, type: 'fail'});//失败提示
      }

    })
  }

  /**返回英雄列表页*/
  goBack() {
    this.router.navigate(['hero/list']);//导航回英雄列表
  }

}