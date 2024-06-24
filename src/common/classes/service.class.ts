/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '@src/database/prisma.service';
import { IPaginatedResult, IPaginationArgs } from '@src/interfaces/types';
import { head } from 'lodash';

// it's necessary to modify this prototype model. it lets JSON.stringify works correctly.
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export abstract class Service {
  constructor(readonly prisma: PrismaService) {}

  initial = {
    results: [],
    pagination: {
      total: 0,
      size: 0,
      skip: 0,
      take: 0,
      hasMore: false,
    },
  };

  async paginate(
    model: string,
    query,
    pagination: IPaginationArgs<any>,
  ): Promise<IPaginatedResult<any>> {
    const { skip = 0, take = 100, includeCount = true } = pagination;

    const transactions = [
      this.prisma[model].findMany({ ...query, skip, take }),
    ];
    if (includeCount) {
      transactions.push(this.prisma[model].count({ where: query.where }));
    }

    const [results, count] = await Promise.all(transactions);

    const paginateResult = {
      results,
      pagination: {
        total: includeCount ? count : undefined,
        size: results.length,
        skip,
        take,
        hasMore: includeCount ? skip + take < count : undefined,
      },
    };

    return paginateResult;
  }

  async paginateQuery(
    query: {
      select: string;
      from: string;
      where?: string;
      groupBy?: string;
      orderBy?: string;
    },
    pagination: IPaginationArgs<any>,
  ): Promise<IPaginatedResult<any>> {
    const { select, from, groupBy = '', where = '', orderBy = '' } = query;
    const { skip = 0, take = 100, includeCount = true } = pagination;

    const transactions = [
      this.prisma.$queryRawUnsafe(
        `${select} ${from} ${where} ${groupBy} ${orderBy} LIMIT ${take} OFFSET ${skip}`,
      ),
    ];
    if (includeCount) {
      transactions.push(
        this.prisma.$queryRawUnsafe(
          `SELECT COUNT(*) as count ${from} ${where}`,
        ),
      );
    }

    const promise = await Promise.all(transactions);
    const results = promise[0] as any[];

    const { count } = head(promise[1] as any[]);

    const paginateResult = {
      results,
      pagination: {
        total: includeCount ? parseInt(count) : undefined,
        size: results.length,
        skip,
        take,
        hasMore: includeCount ? skip + take < parseInt(count) : undefined,
      },
    };

    return paginateResult;
  }

  async get<T>(model: string, findArgs): Promise<Awaited<T>> {
    try {
      const result = await this.prisma[model].findUnique(findArgs);
      return result;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `There was an error retrieving ${model}`,
      );
    }
  }

  async getFirst(model: string, findArgs) {
    try {
      const result = await this.prisma[model].findFirst(findArgs);
      return result;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `There was an error retrieving ${model}`,
      );
    }
  }
}
