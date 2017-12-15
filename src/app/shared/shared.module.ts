import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastyModule } from 'ng2-toasty';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { SHARED_PIPES,SHARED_ENTRY_COMPONENTS,SHARED_DIRECTIVES,SHARED_COMPONENTS,SHARED_PROVIDERS } from './index';

import { XcModalModule } from './modules/';


@NgModule({
  imports: [PopoverModule.forRoot(), XcModalModule, ToastyModule.forRoot(), ModalModule.forRoot(), FileUploadModule, RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  exports: [PopoverModule, XcModalModule, SHARED_PIPES, SHARED_DIRECTIVES, SHARED_COMPONENTS, CommonModule, ReactiveFormsModule, FormsModule, ToastyModule, FileUploadModule, ModalModule],
  declarations: [SHARED_PIPES, SHARED_DIRECTIVES, SHARED_COMPONENTS],
  entryComponents:[SHARED_ENTRY_COMPONENTS],
  providers: [SHARED_PROVIDERS]
})
export class SharedModule { }
