import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';

@Controller()
export class AppController {
  getHello: any;
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getHome() {
    return this.appService.getHome();
  }
}
