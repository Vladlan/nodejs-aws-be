import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  request(
    url: string,
    { method, params, body: data },
  ): Observable<any | never> {
    return this.httpService
      .request({
        url,
        method,
        params,
        ...(Object.keys(data).length ? { data } : {}),
      })
      .pipe(
        map((res) => res.data),
        catchError(() => {
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      );
  }
}
