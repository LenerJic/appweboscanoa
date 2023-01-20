import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.scss']
})
export class DetailsProductComponent implements OnInit {

  respuesta: any;

  constructor(private route: ActivatedRoute,
              private productoService: ProductoService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: any) =>{
      const {params} = paramMap;
      if (params.id !== undefined) {
        this.cargarData(parseInt(params.id));
      }
    });
  }

  cargarData(id: number){
    this.productoService.getProduct(id).subscribe((data:any)=>{
      this.respuesta = data.result
    });
  }
}
