import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { DetailsProductComponent } from './details-product/details-product.component';
import { ProductosComponent } from './productos/productos.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'productos/detail/:id', component: DetailsProductComponent },
      { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmaceneroRoutingModule { }
