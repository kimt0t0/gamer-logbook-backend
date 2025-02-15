import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname, '..', 'public', 'uploads'));

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"], // Loads resources only from this projects directory
                    scriptSrc: ["'self'", "'unsafe-inline'", process.env.FRONTEND_PATH], // Loads script from project's directory, inline scripts, and frontend
                    styleSrc: ["'self'", "'unsafe-inline'", process.env.FRONTEND_PATH], // Loads styles from project's directory, inline scripts, and frontend
                    imgSrc: ["'self'", 'data:', process.env.FRONTEND_PATH], // Loads images from project's directory, data URI, api and frontend
                    connectSrc: ["'self'", process.env.BACKEND_PATH], // Enables connexsions from project's directory and api
                },
            },
            frameguard: {
                action: 'deny', // Prevents the site from being included in an iframe
            },
            referrerPolicy: { policy: 'no-referrer' }, // Does not include referrer in uploading requests
        }),
    );

    app.enableCors({
        origin: process.env.FRONTEND_PATH,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    });

    app.use((req, res, next) => {
        res.header('Cross-Origin-Resource-Policy', 'cross-origin');
        res.header('Cross-Origin-Opener-Policy', 'cross-origin');
        next();
    });

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(Number(process.env.APP_PORT));
}
bootstrap();
