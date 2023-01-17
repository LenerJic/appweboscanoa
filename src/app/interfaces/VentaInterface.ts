import { ClienteI } from "./ClienteInterface";
import { EmpleadoI } from "./EmpleadoInterface";
import { ProductI } from "./ProductInterface";

export interface VentaI {
    id ?: number;
    idCliente ?: ClienteI;
    idEmpleado ?: EmpleadoI;
    numeroBoleta ?: number;
    montopago ?: number;
    fecha ?: Date;
}

export interface DetalleVentaI {
    id ?: number;
    idVenta ?: VentaI;
    idMueble ?: ProductI;
    cantidad ?: number;
    subtotal ?: number;
}