import { BadRequestException, Injectable } from '@nestjs/common';

interface User {
  username: string;
  password: string;
  adress: string;
  adress_detail: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [];
  
  register(username: string, password: string , adress : string , adress_detail : string) {
    const usernameRegex =  /^[a-zA-Z]\w{2,7}$/u;
    if (!usernameRegex.test(username)) {
      throw new BadRequestException('ID regex Error');
    }
    const user = this.users.find(user => user.username === username);
    
    if (user) {
      throw new BadRequestException('User already exists');
    }
    this.users.push({ username, password, adress, adress_detail });
    
    return "Resister success";
  }

  login(username: string, password: string): string {

    const user = this.users.find(user => user.username === username && user.password === password);
    if (!user) {
      throw new Error('Not a member');
    }
    return 'Login success';
  }
}
