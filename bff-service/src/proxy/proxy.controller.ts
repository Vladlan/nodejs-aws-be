import {
  All,
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Request } from 'express';

@Controller()
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Get('product/products')
  @UseInterceptors(CacheInterceptor)
  productsProxy(@Req() req: Request) {
    return this.proxyService.request(`${process.env.product}/products`, req);
  }

  @All()
  proxy(@Req() req: Request) {
    const [serviceName, ...restPath] = req.url.split('/').filter(Boolean);
    const serviceUri = process.env[serviceName];
    console.log(`serviceUri: `, serviceUri);
    console.log(`restPath: `, restPath);

    if (serviceUri)
      return this.proxyService.request(
        `${serviceUri}/${restPath.join('/')}`,
        req,
      );

    throw new HttpException(
      'Wrong service has been provided',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
