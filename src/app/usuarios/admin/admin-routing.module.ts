import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { AlmaceneroModule } from '../almacenero/almacenero.module';
import { CategoriasComponent } from '../almacenero/categorias/categorias.component';
import { ProductosComponent } from '../almacenero/productos/productos.component';
import { ClientesComponent } from '../vendedor/clientes/clientes.component';
import { VendedorModule } from '../vendedor/vendedor.module';
import { VentaComponent } from '../vendedor/venta/venta.component';
import { EmpleadosComponent } from './empleados/empleados.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'empleados', component: EmpleadosComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'productos', component: ProductosComponent },
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
  imports: [RouterModule.forChild(routes), AlmaceneroModule, VendedorModule],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
