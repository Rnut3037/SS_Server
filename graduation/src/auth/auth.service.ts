import { Injectable } from '@nestjs/common';

interface User {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [];
  
  register(username: string, password: string , adress : string , adress_detail : string): string {
    // Check if user already exists
    const user = this.users.find(user => user.username === username);
    if (user) {
      throw new Error('User already exists');
    }

    // Save new user
    this.users.push({ username, password });
    return 'User registered successfully';
  }

  login(username: string, password: string): string {
    // Find user
    const user = this.users.find(user => user.username === username && user.password === password);
    if (!user) {
      throw new Error('Not a member');
    }
    return 'Login successful';
  }
}
