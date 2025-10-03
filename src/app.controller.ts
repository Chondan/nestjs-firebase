import * as admin from 'firebase-admin';
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { FIREBASE_ADMIN } from './modules/firebase/firebase.module';

@Controller()
export class AppController {
  @Inject(FIREBASE_ADMIN)
  private readonly firebaseAdmin: typeof admin;
  @Inject()
  private readonly configService: ConfigService;
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
