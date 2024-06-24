import { Nota as NotaPrisma } from '@prisma/client';

export class Note implements NotaPrisma {
  valor: number;
  id: string;
  materiaId: string;
  alumnoId: string;
}
