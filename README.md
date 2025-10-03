<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


## Project Summary

This project is a boilerplate for building scalable server-side applications using NestJS and Firebase. It provides:

- A NestJS API integrated with Firebase Admin SDK for backend operations (Firestore, Auth, Storage).
- Local development support using Firebase Emulators for Firestore, Auth, and Storage.
- Example endpoints for testing Firestore writes and other Firebase features.
- Modular structure for easy extension and testing.

## Features

- NestJS REST API
- Firebase Admin integration (backend)
- Firestore, Auth, Storage support
- Local emulators for safe development
- Example controller for Firestore writes

## How to Connect Client (React) to Backend via Emulator

1. **Start Firebase Emulators**
  ```bash
  firebase emulators:start
  ```

2. **Configure Client (React) to Use Emulators**
  In your React app, after initializing Firebase:
  ```js
  import { initializeApp } from 'firebase/app';
  import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
  import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from 'firebase/auth';


  const firebaseApp = initializeApp({
    apiKey: '', // Even with local env this apiKey still needed
  });
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(db, 'http://localhost:8080');
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
  ```

3. **Connect to Backend API**
  - Make HTTP requests from your client to the NestJS backend (e.g., `http://localhost:5001/<project-id>/asia-southeast1/api` if using Firebase Functions emulator).
  - Ensure CORS is enabled in your NestJS app for local development.

## Usage

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run dev
or
$ yarn dev 
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Deployment

To deploy your NestJS + Firebase Functions project, use the provided npm scripts:

- **Staging:**
  ```bash
  yarn deploy:staging
  # or
  npm run deploy:staging
  ```
  This will switch to your staging Firebase project and deploy your code.

- **Production:**
  ```bash
  yarn deploy:prod
  # or
  npm run deploy:prod
  ```
  This will switch to your production Firebase project and deploy your code.

Make sure you have configured your Firebase project aliases (staging, prod) using:
```bash
firebase use --add
```

For more details, see the [NestJS deployment documentation](https://docs.nestjs.com/deployment) and [Firebase CLI documentation](https://firebase.google.com/docs/cli).

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
