import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '@src/database/prisma.service';
import { CsvParser } from 'nest-csv-parser';
import { Readable } from 'stream';

class Entity {
  nombre: string;
  apellido: string;
  materia: string;
  nota: string;
}

@Injectable()
export class UsersService {
  constructor(
    readonly prisma: PrismaService,
    private readonly csvParser: CsvParser,
  ) {}

  findByEmail(email: string) {
    return this.prisma.usuario.findFirst({
      where: {
        email,
      },
    });
  }

  async loadNotesCsv(file: Express.Multer.File) {
    const stream = Readable.from(file.buffer.toString());
    let emptyFields = false;

    const csv = await this.csvParser.parse(stream, Entity, 0, 0, {
      headers: ['nombre', 'apellido', 'materia', 'nota'],
      mapValues: ({ header, value }) => {
        if (!value && header !== 'lot') {
          emptyFields = true;
        } else {
          return value;
        }
      },
    });

    if (emptyFields) {
      throw new UnprocessableEntityException('FILE_INCOMPLETE');
    }

    const alumnos = await this.prisma.alumno.findMany();
    const materias = await this.prisma.materia.findMany();

    const toCommit = [];

    csv.list.forEach((element) => {
      const alumno = alumnos.find(
        (i) => i.apellido === element.apellido && i.nombre === element.nombre,
      );
      const materia = materias.find((i) => i.nombre === element.materia);

      if (alumno && materia) {
        toCommit.push(
          this.prisma.nota.create({
            data: {
              valor: element.nota,
              alumno: {
                connect: {
                  id: alumno.id,
                },
              },
              materia: {
                connect: {
                  id: materia.id,
                },
              },
            },
          }),
        );
      }
    });

    await this.prisma.$transaction(toCommit);

    return 'ok';
  }

  async loadNotesPdf(file: Express.Multer.File) {}
}
