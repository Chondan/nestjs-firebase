import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

export const FIREBASE_ADMIN = Symbol('FIREBASE_ADMIN');

@Global()
@Module({
  providers: [
    {
      provide: FIREBASE_ADMIN,
      useFactory: (configService: ConfigService) => {
        if (configService.getOrThrow('common.NODE_ENV') === 'dev') {
          return admin.initializeApp();
        }

        const serviceAccountJson = configService.getOrThrow<string>(
          'firebase.FIREBASE_SERVICE_ACCOUNT_JSON',
          { infer: true },
        );
        let serviceAccount: ServiceAccount;
        try {
          serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
        } catch (error) {
          throw new Error(
            'FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON.',
            { cause: error },
          );
        }

        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: configService.get<string>(
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
