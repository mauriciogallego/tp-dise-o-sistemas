import { PaginatedResult } from '@src/common/entities/paginated-result.entity';
import { Note } from './note.entity';

export class NoteList extends PaginatedResult<Note> {
  results: Note[];
}
