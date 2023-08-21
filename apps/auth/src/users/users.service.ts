import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Role, User, UserOutbidEvent } from '@app/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import { KafkaService } from '@app/common/kafka';
import { In } from 'typeorm';
import { UserOutbidEnrichedEvent } from '@app/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly kafkaService: KafkaService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);
    const user = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10), // 10 salt rounds when hashing password
      roles: createUserDto.roles?.map((roleDto) => new Role(roleDto)),
    });
    return await this.usersRepository.create(user);
  }

  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }

  private async validateCreateUser(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists');
  }

  async handleUsersOutbid(data: UserOutbidEvent) {
    // we want to get emails for all of the outbid users
    const ids = data.previousBidders;
    const users: User[] = await this.usersRepository.find({
      id: In(ids),
    });

    // send kafka event to notifications service with emails
    this.kafkaService.emit('notify_outbid', new UserOutbidEnrichedEvent(users));
  }
}
