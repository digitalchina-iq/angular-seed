import { UserImageComponent } from './widgets/user-image/user-image.component';
import { UserImageHeadComponent } from './widgets/user-image/user-image-head.component';
import { IqBreadCrumbComponent } from './widgets/iq-breadcrumb.component';
import { IqDialogPersonSelectComponent } from './widgets/input-select/iq-dialog-person-select.component';
import { IqPersonSelectComponent } from './widgets/input-select/iq-person-select.component';
import { IqPopoverPersonSelectComponent } from './widgets/input-select/iq-popover-person-select.component';
import { PagerPageComponent, Pager } from './widgets/iq-pager/iq-pager.component';

import { HeaderComponent } from './frame-components/header.component';
import { IqTlrFrameComponent } from './frame-components/iq-tlr-frame.component';
import { IqTbFrameComponent } from './frame-components/iq-tb-frame.component';

import { PageErrorComponent } from "./page-components/page-error.component";
import { PageNotFoundComponent } from "./page-components/page-not-found.component";

import { LoadingComponent } from './widgets/loading/loading.component';
import { IqSwitcherComponent } from "./widgets/iq-switcher/iq-switcher.component";
import { IqDatePickerComponent } from './widgets/iq-datepicker/iq-datepicker.component';
import { IqFileUploadComponent } from './widgets/iq-file-upload/iq-file-upload.component';
import { IqSelectComponent } from './widgets/iq-select/iq-select.component';

export let SHARED_ENTRY_COMPONENTS = [IqDialogPersonSelectComponent];

export { 
  LoadingComponent, 
  IqBreadCrumbComponent, 
  IqDialogPersonSelectComponent, 
  IqSwitcherComponent,
  IqPersonSelectComponent, 
  IqPopoverPersonSelectComponent, 
  UserImageComponent, 
  UserImageHeadComponent, 
  HeaderComponent, 
  IqTlrFrameComponent,
  IqTbFrameComponent, 
  PageErrorComponent, 
  PageNotFoundComponent,
  PagerPageComponent, 
  Pager, 
  IqDatePickerComponent,
  IqFileUploadComponent,
  IqSelectComponent
};

export let SHARED_COMPONENTS = [
  LoadingComponent, 
  IqBreadCrumbComponent, 
  IqDialogPersonSelectComponent, 
  IqSwitcherComponent,
  IqPersonSelectComponent, 
  IqPopoverPersonSelectComponent, 
  UserImageComponent, 
  UserImageHeadComponent, 
  HeaderComponent, 
  IqTlrFrameComponent,
  IqTbFrameComponent, 
  PageErrorComponent, 
  PageNotFoundComponent,
  PagerPageComponent, 
  IqDatePickerComponent,
  IqFileUploadComponent,
  IqSelectComponent
];
