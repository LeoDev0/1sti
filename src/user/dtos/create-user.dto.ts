import { ApiProperty } from '@nestjs/swagger';
import { 
    IsNotEmpty, 
    IsOptional, 
    IsPhoneNumber, 
    IsPostalCode, 
    IsString 
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, example: 'Leonardo' })
    name: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    @ApiProperty({ type: String, example: '+5524999000444' })
    phone: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, example: '65476477659' })
    CPF: string;

    @IsNotEmpty()
    @IsPostalCode('BR')
    @ApiProperty({ type: String, example: '78556-556' })
    CEP: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    state: string;
}