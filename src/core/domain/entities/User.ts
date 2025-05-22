import { Entity } from '@/core/shared/types/Entity';

export class User implements Entity<string> {
  private _id: string;
  private _email: string;
  private _name: string;
  private _role: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    role: string = 'user',
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._email = email;
    this._name = name;
    this._role = role;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validateUser();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get role(): string {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  updateDetails(name: string, email: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    this._name = name;
    this._email = email;
    this._updatedAt = new Date();
  }

  updateRole(role: string): void {
    if (!role || role.trim().length === 0) {
      throw new Error('Role cannot be empty');
    }
    
    this._role = role;
    this._updatedAt = new Date();
  }

  // Validation logic
  private validateUser(): void {
    if (!this._id) {
      throw new Error('User ID is required');
    }
    
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    
    if (!this.validateEmail(this._email)) {
      throw new Error('Invalid email format');
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Factory method
  static create(
    id: string,
    email: string,
    name: string,
    role: string = 'user'
  ): User {
    return new User(id, email, name, role);
  }

  // Convert to primitives
  toPrimitives(): {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      role: this._role,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString()
    };
  }
}