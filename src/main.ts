import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

const {
  CORS_METHODS,
  FALLBACK_VALUES_CLIENT_PORT,
  FALLBACK_VALUES_SERVER_PORT,
  LOCALHOST_URL,
} = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  app.enableCors({
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
    methods: CORS_METHODS,
    origin: `${LOCALHOST_URL}:${FALLBACK_VALUES_CLIENT_PORT}`,
  });
  if (FALLBACK_VALUES_SERVER_PORT) {
    await app.listen(FALLBACK_VALUES_SERVER_PORT);
  } else {
    throw new Error("Не задано значение прослушиваемого порта");
  }
}

void bootstrap();
