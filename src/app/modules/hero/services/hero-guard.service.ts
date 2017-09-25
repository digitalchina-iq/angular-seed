import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CanActivate, CanActivateChild } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../../environments/environment';