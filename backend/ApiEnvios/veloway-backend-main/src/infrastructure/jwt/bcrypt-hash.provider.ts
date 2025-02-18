import bcrypt from 'bcrypt';

export class BcryptHashProvider {
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);
    return hashedpass;
  }

  public async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
