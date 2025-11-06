import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { ResultComponent } from './result/result.component';
import { StateGuard } from './service/state.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'captcha', component: CaptchaComponent },
    { path: 'result', component: ResultComponent, canActivate: [StateGuard] },
    { path: '**', redirectTo: '' }
];
