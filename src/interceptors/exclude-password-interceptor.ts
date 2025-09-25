import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

import { SENSETIVE_FIELDS } from "./constraints";

@Injectable() //здесь мы удаляем поля email и password из тела ответа
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.excludePasswordField(data)));
  }

  private excludePasswordField(data: unknown): unknown {
    if (data instanceof Object) {
      for (const key of Object.keys(data)) {
        if (key in SENSETIVE_FIELDS) {
          delete data[key];
        } else if (data[key] instanceof Object) {
          data[key] = this.excludePasswordField(data[key]);
        }
      }
    }
    return data;
  }
}
