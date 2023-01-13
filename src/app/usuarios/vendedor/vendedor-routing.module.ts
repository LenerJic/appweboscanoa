import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { ClientesComponent } from './clientes/clientes.component';
import { VentaComponent } from './venta/venta.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'venta', component: VentaComponent },
      { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
      /* {
        path: 'almacen',
        children: [
          { path: 'categorias', component: CategoriasComponent },
          { path: 'productos', component: ProductosComponent },
          { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
        ]
      }, */
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendedorRoutingModule { }