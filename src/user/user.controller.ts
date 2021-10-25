import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpCode, 
    Param, 
    Post, 
    Put, 
    UsePipes, 
    ValidationPipe 
} from '@nestjs/common';
import { 
    ApiBadRequestResponse,
    ApiCreatedResponse, 
    ApiExtraModels, 
    ApiNoContentResponse, 
    ApiNotFoundResponse, 
    ApiOkResponse, 
    ApiTags,
} from '@nestjs/swagger';
import { ParametersValidationPipe } from '../common/pipes/parameters-validation.pipe';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './interfaces/user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiExtraModels(User)
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) {}
        
    @Get()
    @ApiOkResponse({
        description: 'Retrieve all users'
    })
    public async getAllUsers(): Promise<User[]> {
        return await this.userService.getAllUsers();
    }
    
    @Get('/:CPF')
    @ApiOkResponse({
        description: 'Retrieve a single user by CPF',
    })
    @ApiNotFoundResponse({
        description: 'User not found'
    })
    public async getUserById(@Param('CPF', ParametersValidationPipe) CPF: string): Promise<User> {
        return await this.userService.getUserByCPF(CPF);
    }

    @Post()
    @ApiCreatedResponse({
        description: 'User registration'
    })
    @ApiBadRequestResponse({
        description: 'Bad request'
    })
    @HttpCode(201)
    @UsePipes(ValidationPipe)
    public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.userService.createUser(createUserDto);
    }

    @Put('/:CPF')
    @ApiOkResponse({
        description: 'Update a user'
    })
    @ApiNotFoundResponse({
        description: 'User not found'
    })
    @ApiBadRequestResponse({
        description: 'Bad request'
    })
    @UsePipes(ValidationPipe)
    public async updateUser(
        @Param('CPF', ParametersValidationPipe) CPF: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return await this.userService.updateUser(CPF, updateUserDto);
    }

    @Delete('/:CPF')
    @ApiNoContentResponse({
        description: 'Delete a user'
    })
    @ApiNotFoundResponse({
        description: 'User not found'
    })
    @HttpCode(204)
    public async deleteUser(@Param('CPF', ParametersValidationPipe) CPF: string): Promise<void> {
        return await this.userService.deleteUser(CPF);
    }
}
