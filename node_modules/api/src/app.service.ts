import { Injectable } from '@nestjs/common';
import { data } from './database/userdata';

@Injectable()
export class AppService {
  getHome() {
    return data;
  }
}
