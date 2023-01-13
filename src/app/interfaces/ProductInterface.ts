import { CategoryI } from "./CategoryInterface";

export interface ProductImgI {
    id?: number;
    nombre?: string;
    descripcion?: string;
    stock?: number;
    categoria?: CategoryI;
    precioCompra?: number;
    precioVenta?: number;
    estado?: boolean;
    fecha?: Date;
    imagenUrl?: Array<string>;
}

export interface ProductI {
    id?: number;
    nombre?: string;
    descripcion?: string;
    stock?: number;
    categoria?: CategoryI;
    precioCompra?: number;
    precioVenta?: number;
    estado?: boolean;
    fecha?: Date;
}