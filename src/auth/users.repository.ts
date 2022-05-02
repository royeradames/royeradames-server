import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./User.entity";
import * as bcrypt from "bcrypt";
@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    /* hash password 
    
    - when you add a random generate salt (random text) to the password for it to be hashed it appears unique in the database even the password is the same
      - This makes random hash passwords tables attacks obsolete ( index of text and hash values)
        
    */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: hashedPassword });

    await this.save(user);
  }
}
