/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject } from '@nestjs/common';
import { FIREBASE_ADMIN } from '../firebase/firebase.module';
import * as admin from 'firebase-admin';
import { Request } from 'express';
import Busboy from 'busboy';
import path from 'path';
import os from 'os';
import fs from 'fs';

export interface IHandleFileUpload {
  fieldname: string;
  fields: any[];
  file: any;
  filename: {
    filename: string;
    encoding: string;
    mimeType: string;
  };
  randomFilename: string;
  reject: any;
  resolve: any;
  saveTo: string;
}

interface IOptions {
  onFile: (
    params: Omit<
      IHandleFileUpload,
      'saveTo' | 'randomFilename' | 'resolve' | 'fields'
    >,
  ) => Promise<void>;
  onFinish: (params: IHandleFileUpload) => Promise<void>;
}

@Injectable()
export class FileService {
  @Inject(FIREBASE_ADMIN)
  private readonly firebaseAdmin: typeof admin;

  async uploadFile(request: Request) {
    return await this.parseUploadRequest(request, {
      onFile: async () => {},
      onFinish: async ({ filename, saveTo, randomFilename, resolve }) => {
        const storage = this.firebaseAdmin.storage();
        const uploadResult = await storage.bucket('test').upload(saveTo, {
          destination: `folder/${randomFilename}.${filename.filename.split('.')[1]}`,
        });
        const unsignedUrl = (uploadResult as any)[1].mediaLink;
        resolve({ url: unsignedUrl });
      },
    });
  }

  async parseUploadRequest(request: Request, options: IOptions) {
    const { onFile, onFinish } = options;
    let fieldname, file, filename, saveTo, randomFilename;
    const fields: { fieldname: any; value: any }[] = [];

    return await new Promise((resolve, reject) => {
      try {
        const busboy = Busboy({ headers: request.headers });

        // An operation before saving to temporary directory
        busboy.on(
          'file',
          async (_fieldname, _file, _filename, _encoding, _mimetype) => {
            fieldname = _fieldname;
            file = _file;
            filename = _filename;

            try {
              await onFile({
                fieldname,
                file,
                filename,
                reject,
              });

              // Save file to temp dir
              randomFilename = `${Date.now()}-${Math.round(
                Math.random() * 100000,
              )}`;
              saveTo = path.join(
                os.tmpdir(),
                path.basename(randomFilename as string),
              );
              console.log('Saving file to...', saveTo);
              file.pipe(fs.createWriteStream(saveTo as string));
            } catch (err) {
              reject(err as Error);
            }
          },
        );

        busboy.on('field', (_fieldname, value) => {
          fields.push({ fieldname: _fieldname, value });
        });

        // An operation after saving to temporary directory
        busboy.on('finish', async () => {
          console.log({
            fieldname,
            fields,
            file,
            filename,
            randomFilename,
            saveTo,
          });
          await onFinish({
            fieldname,
            fields,
            file,
            filename,
            randomFilename,
            saveTo,
            resolve,
            reject,
          });
        });

        busboy.end((request as any).rawBody);
      } catch (err) {
        reject(err as Error);
      }
    });
  }
}
