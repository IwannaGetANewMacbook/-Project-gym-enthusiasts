import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesModel } from './entity/messages.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { createMessagesDto } from './dto/create-messages.dto';
import { PaginateMassagesDto } from './dto/pagenate-messages.dto';

@Injectable()
export class ChatsMessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepository: Repository<MessagesModel>,
    private readonly commonService: CommonService,
  ) {}

  async createMessage(dto: createMessagesDto, authorId: number) {
    const message = await this.messagesRepository.save({
      chat: { id: dto.chatId },
      author: { id: authorId },
      message: dto.message,
    });
    return this.messagesRepository.findOne({
      where: { id: message.id },
      relations: { chat: true },
    });
  }

  paginateMessages(
    dto: PaginateMassagesDto,
    overrideFindOptions: FindManyOptions<MessagesModel>,
  ) {
    return this.commonService.paginate(
      dto,
      this.messagesRepository,
      overrideFindOptions,
      'messages',
    );
  }
}