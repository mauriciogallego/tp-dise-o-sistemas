import { Prisma, PrismaClient } from '@prisma/client';
import { Model } from '../seed';

const model: Model & {
  data: Prisma.MateriaCreateInput[];
} = {
  data: [
    {
      nombre: 'ingles',
    },
    {
      nombre: 'matematicas',
    },
    {
      nombre: 'sociales',
    },
  ],
  async run(prisma: PrismaClient) {
    for (const materia of this.data) {
      await prisma.materia.create({
        data: materia,
      });
    }

    return true;
  },
};

export default model;
