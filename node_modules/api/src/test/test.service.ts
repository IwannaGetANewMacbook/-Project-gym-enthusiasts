import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  testInit() {
    return { username: '김수현', age: 27, city: 'Busan' };
  }
}
