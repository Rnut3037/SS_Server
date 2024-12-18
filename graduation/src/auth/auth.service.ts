import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    private readonly jwtService: JwtService, // JwtService 주입
  ) {}

  async register(username: string, password: string, adress: string, adress_detail: string): Promise<string> {
    const usernameRegex = /^[a-zA-Z]\w{2,7}$/u;
    const passwordRegex = /^[A-Za-z\d@$!%*?&]{1,8}$/;
    if (!usernameRegex.test(username)) {
      throw new BadRequestException('ID regex Error');
    }
    if (!passwordRegex.test(password)) {
      throw new BadRequestException('password regex Error');
    }

    const userExists = await this.userRepository.findOne({ where: { username } });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({ 
      username, 
      password: hashedPassword,  
      adress, 
      adress_detail,
      coins: 3,
      admin: 0
    });
    await this.userRepository.save(user);
    return 'Register success';
  }

  async login(username: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException('Not a member');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log(isPasswordValid);
    console.log(password,user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async deductCoins(token: string): Promise<number> {
    let username: string;
    const decoded = this.jwtService.verify(token);
    username = decoded.username; // JWT에서 username 추출
    const user: User = await this.userRepository.findOne({ where: { username } });
    if (!user) {
        throw new NotFoundException('User not found');
    }
  
    user.coins -= 1;
    await this.userRepository.save(user);
    return user.coins;
}

async insertCoins(token: string): Promise<number> {
  let username: string;
  const decoded = this.jwtService.verify(token);
  username = decoded.username; // JWT에서 username 추출
  const user: User = await this.userRepository.findOne({ where: { username } });
  if (!user) {
      throw new NotFoundException('User not found');
  }

  user.coins += 1;
  await this.userRepository.save(user);
  return user.coins;
}

async getCoins(token:string): Promise<number>{
  let username: string;
  const decoded = this.jwtService.verify(token);
  username = decoded.username; // JWT에서 username 추출

  const user: User = await this.userRepository.findOne({ where: { username } });
    if (!user) {
        throw new NotFoundException('User not found');
    }
    else{
     return user.coins;
    }

  }
}
