import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string, adress: string, adress_detail: string): Promise<string> {
    const usernameRegex = /^[a-zA-Z]\w{2,7}$/u;
    if (!usernameRegex.test(username)) {
      throw new BadRequestException('ID regex Error');
    }

    const userExists = await this.userRepository.findOne({ where: { username } });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성 (coins 필드 기본값 포함)
    const user = this.userRepository.create({ 
      username, 
      password: hashedPassword,  // 해싱된 비밀번호 저장
      adress, 
      adress_detail,
      coins: 3,  // 기본값 설정
    });
    await this.userRepository.save(user);
    
    return 'Register success';
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException('Not a member');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return 'Login success';
  }
}
