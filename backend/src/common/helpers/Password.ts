import bcrypt from 'bcryptjs';

export class Password {
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async compare(suppliedPassword: string, storedPassword: string): Promise<boolean> {
        const compareResult = await bcrypt.compare(suppliedPassword, storedPassword);
        return compareResult;
    }
}