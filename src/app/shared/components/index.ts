import { UserImageComponent } from './widgets/user-image/user-image.component';
import { UserImageHeadComponent } from './widgets/user-image/user-image-head.component';
import { IqBreadCrumbComponent } from './widgets/iq-breadcrumb.component';
import { IqDepartmentPersonSelectComponent } from './widgets/iq-person-select/iq-person-select.component';
import { IqPopoverDepartmentPersonSelectComponent } from './widgets/iq-person-select/iq-popover-person-select.component';
import { IqDialogDepartmentPersonSelectComponent } from './widgets/iq-person-select/iq-dialog-person-select.component';
import { IqTreePersonSelectComponent } from './widgets/iq-person-select/iq-tree-person-select.component';
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
import { IqTabComponent } from './widgets/iq-tab/iq-tab.component';
import { IqTabIndexComponent } from './widgets/iq-tab/iq-tab-index.component';
import { IqTabContentComponent } from './widgets/iq-tab/iq-tab-content.component';
import { from } from 'rxjs/observable/from';

export let SHARED_ENTRY_COMPONENTS = [IqDialogDepartmentPersonSelectComponent];

export { 
  LoadingComponent, 
  IqBreadCrumbComponent, 
  IqSwitcherComponent,
  IqDepartmentPersonSelectComponent, 
  IqDialogDepartmentPersonSelectComponent, 
  IqPopoverDepartmentPersonSelectComponent,
  IqTreePersonSelectComponent, 
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
  IqSelectComponent,
  IqTabComponent,
  IqTabIndexComponent,
  IqTabContentComponent
};

export let SHARED_COMPONENTS = [
  LoadingComponent, 
  IqBreadCrumbComponent, 
  IqSwitcherComponent,
  IqDepartmentPersonSelectComponent,
  IqPopoverDepartmentPersonSelectComponent,
  IqDialogDepartmentPersonSelectComponent,
  IqTreePersonSelectComponent,
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
  IqSelectComponent,
  IqTabComponent,
  IqTabIndexComponent,
  IqTabContentComponent
];
