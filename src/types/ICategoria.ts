export interface ICategoria {
    id?:number,
    nombre:string,
    descripcion:string
}
export interface ICategoriaReturn {
    id?:number
    nombre:string,
    descripcion:string
}
export interface ICategoriaCreate {
    nombre: string;
    descripcion: string;
}
