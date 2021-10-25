import { 
    BadRequestException, 
    Injectable, 
    Logger, 
    NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cpf } from 'cpf-cnpj-validator';
import { Repository } from 'typeorm';
import { User } from './interfaces/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AddressService } from '../address/address.service';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly addressService: AddressService
    ) {}

    private readonly logger = new Logger(UserService.name);

    public async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async getUserByCPF(CPF: string): Promise<User> {
        const user = await this.userRepository.findOne({ CPF });

        if (!user) {
            this.logger.log(`user: ${JSON.stringify(user)}`);

            throw new NotFoundException(`User not found`);
        }

        return user;
    }

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { CPF, CEP, phone } = createUserDto;

        const phoneNumberExists = await this.userRepository.findOne({ phone });

        if (phoneNumberExists) {
            this.logger.log(`phoneNumberExists: ${JSON.stringify(phoneNumberExists)}`);

            throw new BadRequestException(`Phone number ${phone} already registered`);
        }

        const cpfExists = await this.userRepository.findOne({ CPF });

        if (cpfExists) {
            this.logger.log(`cpfExists: ${JSON.stringify(cpfExists)}`);

            throw new BadRequestException(`CPF ${CPF} already registered`);
        }

        if (!cpf.isValid(CPF)) {
            this.logger.log(`cpfIsInvalid: ${CPF}`);

            throw new BadRequestException(`This CPF is not valid.`);
        }

        const { logradouro, localidade, uf } = await this.addressService.getAdressInfoByCEP(CEP);

        createUserDto.address = logradouro;
        createUserDto.city = localidade;
        createUserDto.state = uf;

        return await this.userRepository.save(createUserDto);
    }

    public async updateUser(CPF: string, updateUserDto: UpdateUserDto): Promise<void> {
        const { phone, CEP } = updateUserDto;
        const userExists = await this.userRepository.findOne({ CPF });

        if (!userExists) {
            throw new NotFoundException(`User of CPF ${CPF} does not exists.`);
        }

        if (!!phone && phone !== userExists.phone) {
            const phoneNumberExists = await this.userRepository.findOne({ phone });

            if (phoneNumberExists) {
                throw new BadRequestException(`This phone number is already in use`);
            }
        }

        if (!!CEP) {
            const { logradouro, localidade, uf } = await this.addressService.getAdressInfoByCEP(CEP);

            updateUserDto.address = logradouro;
            updateUserDto.city = localidade;
            updateUserDto.state = uf;
        }

        await this.userRepository.update(CPF, updateUserDto);
    }
    
    public async deleteUser(CPF: string): Promise<void> {
        const userExists = await this.userRepository.findOne({ CPF });

        if (!userExists) {
            this.logger.log(`userExists: ${JSON.stringify(userExists)}`);

            throw new NotFoundException(`User not found`);
        }

        await this.userRepository.delete(CPF);
    }
}
