import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XcContainerComponent,XcModalContainerComponent,XcHostDirective,XcModalService,XcComponentsLoaderService} from "./index";

@NgModule({
  imports: [CommonModule],
  exports: [XcContainerComponent],
  declarations: [XcContainerComponent,XcModalContainerComponent,XcHostDirective],
  providers: [XcModalService,XcComponentsLoaderService]
})
export class XcModalModule { }
