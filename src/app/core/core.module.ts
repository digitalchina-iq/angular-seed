import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { CORE_PROVIDERS, CORE_COMPONENTS } from './index'
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    HttpModule,
    SharedModule
  ],
  exports: [
    CORE_COMPONENTS,
    SharedModule
  ],
  declarations: [
    CORE_COMPONENTS
  ],
  providers: [
    CORE_PROVIDERS
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
