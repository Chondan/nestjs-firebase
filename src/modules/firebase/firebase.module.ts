import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import serviceAccountJson from './serviceAccountKey.json';

export const FIREBASE_ADMIN = Symbol('FIREBASE_ADMIN');

@Module({
  providers: [
    {
      provide: FIREBASE_ADMIN,
      useFactory: (configService: ConfigService) => {
        if (configService.getOrThrow('common.NODE_ENV') === 'dev') {
          return admin.initializeApp();
        }

        const serviceAccount = serviceAccountJson as ServiceAccount;

        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: configService.getOrThrow(
            'firebase.FIREBASE_DATABASE_URL',
          ),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [FIREBASE_ADMIN],
})
export class FirebaseModule {}
