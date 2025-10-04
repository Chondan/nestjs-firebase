import { Controller, Post, Req } from '@nestjs/common';
import { FileService } from './file.service';
import { Public } from '@src/guards/auth.guard';
import express from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Post('upload')
  async uploadFile(@Req() request: express.Request) {
    return await this.fileService.uploadFile(request);
  }
}
