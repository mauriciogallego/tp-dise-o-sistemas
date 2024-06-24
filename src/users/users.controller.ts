import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('load-notes')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req: any, file: any, cb: any) => {
        if (!file) {
          cb(new BadRequestException('EMPTY FILE'), false);
        }
        console.log(file.mimetype);
        if (file.mimetype.match(/\/(csv|pdf)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Unsupported file type ${extname(file.originalname)}`,
            ),
            false,
          );
        }
      },
    }),
  )
  async loadNotes(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('EMPTY FILE');
    }

    if (file.mimetype === 'pdf') {
      return this.userService.loadNotesPdf(file);
    }

    return this.userService.loadNotesCsv(file);
  }
}
