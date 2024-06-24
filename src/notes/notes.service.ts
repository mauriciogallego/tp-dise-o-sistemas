import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';
import { Service } from '@src/common/classes/service.class';
import { IPaginationArgs } from '@src/interfaces/types';

@Injectable()
export class NotesService extends Service {
  constructor(readonly prisma: PrismaService) {
    super(prisma);
  }

  async findAll(params: IPaginationArgs<Prisma.NotaFindManyArgs>) {
    const { includeCount, skip, take, ...findAllParams } = params;

    return this.paginate(
      'nota',
      {
        ...findAllParams,
      },
      { includeCount, skip, take },
    );
  }
}
