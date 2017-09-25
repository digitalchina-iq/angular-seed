//导入组件
import { HeroMenuComponent } from './hero-menu/hero-menu.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

//导入动态加载组件
import { EditHeroComponent } from './edit-hero/edit-hero.component';

export {
  HeroMenuComponent,
  HeroListComponent,
  HeroDetailComponent
}

export let HERO_ENTRY_COMPONENTS = [
  EditHeroComponent
];

export let HERO_COMPONENTS = [
  HeroMenuComponent,
  HeroListComponent,
  HeroDetailComponent,
  
  EditHeroComponent
];