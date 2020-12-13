import {
  All,
  Controller,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Request } from 'express';

@Controller()
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @All()
  proxy(@Req() request: Request) {
    const [serviceName, ...restPath] = request.url.split('/').filter(Boolean);
    console.log(`serviceName: `, serviceName);
    console.log(`restPath: `, restPath);
    const isServiceAvailable = process.env[serviceName];

    if (isServiceAvailable)
      return this.proxyService.request(
        `http://${serviceName}/${restPath.join('/')}`,
        request as any,
      );

    throw new HttpException(
      'Wrong service has been provided',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
