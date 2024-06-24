import { Controller, Get, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ListQueryArgsDto } from '@src/common/dto/list-query-args.dto';
import { ListQueryArgsPipe } from '../common/pipes/ListQueryArgsPipe';
import { NoteList } from './entities/note-list.entity';

@Controller({
  path: 'notes',
  version: '1',
})
export class NotesController {
  constructor(private insuranceService: NotesService) {}

  @Get()
  findAll(
    @Query(ListQueryArgsPipe) params: ListQueryArgsDto,
  ): Promise<NoteList> {
    return this.insuranceService.findAll(params);
  }
}
