import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { ResultComponent } from './result/result.component';
import { challengeGuard, resultGuard } from './service/state.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'captcha', component: CaptchaComponent, canActivate: [challengeGuard] },
    { path: 'result', component: ResultComponent, canActivate: [resultGuard] },
    { path: '**', redirectTo: '' }
];
