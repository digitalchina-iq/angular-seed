import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './routing/app-routing.module';

import { CoreModule } from './core/core.module';

import { AppComponent } from 'app/core/components/index';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule
  ],
  providers:[
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
