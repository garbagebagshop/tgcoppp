import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './database';

export interface User {
  id: string;
  email: string;
  subscription_status: 'free' | 'paid';
  subscription_expires_at?: number;
}

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET!;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '30d' });
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, this.jwtSecret) as { userId: string };
    } catch {
      return null;
    }
  }

  async createUser(email: string, password: string): Promise<User> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = await this.hashPassword(password);

    try {
      await db.execute({
        sql: 'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
        args: [id, email, passwordHash]
      });

      return {
        id,
        email,
        subscription_status: 'free'
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('UNIQUE constraint failed')) {
        throw new Error('Email already registered');
      }
      throw new Error('Failed to create user');
    }
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const result = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
      });

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      const isValid = await this.comparePassword(password, user.password_hash as string);

      if (!isValid) {
        return null;
      }

      return {
        id: user.id as string,
        email: user.email as string,
        subscription_status: user.subscription_status as 'free' | 'paid',
        subscription_expires_at: user.subscription_expires_at as number
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const result = await db.execute({
        sql: 'SELECT * FROM users WHERE id = ?',
        args: [id]
      });

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      return {
        id: user.id as string,
        email: user.email as string,
        subscription_status: user.subscription_status as 'free' | 'paid',
        subscription_expires_at: user.subscription_expires_at as number
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async updateSubscription(userId: string, status: 'paid', expiresAt: number): Promise<boolean> {
    try {
      await db.execute({
        sql: 'UPDATE users SET subscription_status = ?, subscription_expires_at = ?, updated_at = strftime("%s", "now") WHERE id = ?',
        args: [status, expiresAt, userId]
      });
      return true;
    } catch (error) {
      console.error('Update subscription error:', error);
      return false;
    }
  }

  isSubscriptionActive(user: User): boolean {
    if (user.subscription_status === 'free') return false;
    if (!user.subscription_expires_at) return false;
    return user.subscription_expires_at > Date.now() / 1000;
  }
}

export const authService = new AuthService();