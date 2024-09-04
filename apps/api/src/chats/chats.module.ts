import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chat.entity';
import { MessagesModel } from './messages/entity/messages.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesController } from './messages/messages.controller';
import { ChatsGateway } from './chat.gateway';
import { ChatsMessagesService } from './messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatsModel, MessagesModel]),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsService, ChatsGateway, ChatsMessagesService],
})
export class ChatsModule {}
