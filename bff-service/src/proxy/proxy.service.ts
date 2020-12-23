import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  request(
    url: string,
    { method, params, body: data },
  ): Observable<AxiosResponse | AxiosError> {
    return this.httpService
      .request({
        url,
        method,
        params,
        ...(Object.keys(data).length ? { data } : {}),
      })
      .pipe(
        map(({ data }) => data),
        catchError(({ response }) => {
          if (response) {
            throw new HttpException(response.statusText, response.status);
          }
          throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      );
  }
}
