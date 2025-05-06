import * as bcrypt from 'bcryptjs';

export class SecurityUtils{
  static async hasPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Puedes pasar un número como 10 para rounds
    return await bcrypt.hash(password, salt);
  }
}
