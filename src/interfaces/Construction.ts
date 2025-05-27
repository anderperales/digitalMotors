import { Cargo, Construction, Persona, Trabajador } from "@prisma/client";


export interface TrabajadorPersona extends Trabajador {
  persona: Persona,
  cargo: Cargo
}
export interface ConstructionWithTrabajadores extends Construction {
    trabajadores: TrabajadorPersona[]
  }