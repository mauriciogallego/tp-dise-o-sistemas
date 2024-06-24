import { Prisma, PrismaClient } from '@prisma/client';
import { Model } from '../seed';

const model: Model & {
  data: Prisma.UsuarioCreateInput[];
} = {
  data: [
    {
      username: 'prueba',
      password: '$2a$10$2/Xm9ROhke4hlMxcVJZFMOL6/30vHXPNr/XHqgTznvcK44W2FABg2',
      email: 'mauricio@gmail.com',
    },
  ],
  async run(prisma: PrismaClient) {
    for (const usuario of this.data) {
      await prisma.usuario.create({
        data: usuario,
      });
    }

    return true;
  },
};

export default model;
