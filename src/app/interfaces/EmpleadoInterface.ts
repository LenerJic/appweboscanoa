import { Tipo_Doc } from "./Tipo_Doc";

export interface EmpleadoI{
    id?: number;
    nombres?: string;
    apellidoPat?: string;
    apellidoMat?: string;
    tipoDocumento?: Tipo_Doc;
    nroDocumento?: string;
    direccion?: string;
    correo?: string;
    celular?: string;
    fechaNacimiento?: Date;
    estado?: boolean;
    tipoEmpleado?: string;
}