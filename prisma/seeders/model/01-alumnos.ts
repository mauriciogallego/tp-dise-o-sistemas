import { Prisma, PrismaClient } from '@prisma/client';
import { Model } from '../seed';

const model: Model & {
  data: Prisma.AlumnoCreateInput[];
} = {
  data: [
    {
      nombre: 'camilo',
      apellido: 'gallego',
    },
    {
      nombre: 'mauricio',
      apellido: 'gallego',
    },
  ],
  async run(prisma: PrismaClient) {
    for (const alumno of this.data) {
      await prisma.alumno.create({
        data: alumno,
      });
    }

    return true;
  },
};

export default model;
