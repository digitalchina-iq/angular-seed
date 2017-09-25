import { FactoryProvider } from "@angular/core";
import { Http } from '@angular/http';

import { AllCheckService } from "./allcheck.service";
import { BreadcrumbService } from "./breadcrumb.service";
import { PersonService,PersonConfig, Person } from "./person.service";
import { ModulePermissionService } from "./module-permission.service";
export { BreadcrumbService, PersonService, Person, ModulePermissionService };


export let SHARED_PROVIDERS = [
  AllCheckService,
  BreadcrumbService,
  PersonService,
  PersonConfig,
  ModulePermissionService
];
