import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }

    const passwordMatches = await this.comparePassword(pass, user.password);
    if (!passwordMatches) {
      return null;
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async login(user: { id: string; email: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUserFromToken(token: string | undefined) {
    if (!token) {
      return null;
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      if (!payload?.sub) {
        return null;
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      });

      return user ?? null;
    } catch {
      return null;
    }
  }

  private async comparePassword(rawPassword: string, storedPassword: string) {
    if (!storedPassword) {
      return false;
    }

    if (storedPassword.startsWith('$2')) {
      return bcrypt.compare(rawPassword, storedPassword);
    }

    return rawPassword === storedPassword;
  }
}
