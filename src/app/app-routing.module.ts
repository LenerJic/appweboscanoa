import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { UserFormComponent } from './auth/user-form/user-form.component';
import { AdminGuard } from './guards/admin.guard';
import { AlmaceneroGuard } from './guards/almacenero.guard';
import { VendedorGuard } from './guards/vendedor.guard';
import { NotAllowedComponent } from './pages/not-allowed/not-allowed.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path:'', component:LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'changePassword', component: UserFormComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'not-allowed', component: NotAllowedComponent },
  {
    path:'admin',
    loadChildren: () => import('./usuarios/admin/admin.module').then(a=>a.AdminModule),
    canActivate:[AdminGuard]
  },
  {
    path: 'vendedor',
    loadChildren: () => import('./usuarios/vendedor/vendedor.module').then(v=>v.VendedorModule),
    canActivate:[VendedorGuard]
  },
  {
    path: 'almacenero',
    loadChildren: () => import('./usuarios/almacenero/almacenero.module').then(m=>m.AlmaceneroModule),
    canActivate:[AlmaceneroGuard]
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
