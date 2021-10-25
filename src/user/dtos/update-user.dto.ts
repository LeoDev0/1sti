import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
    IsNotEmpty, 
    IsOptional, 
    IsPhoneNumber, 
    IsPostalCode, 
    IsString 
} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @ApiPropertyOptional({ type: String, example: 'Leonardo' })
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsPhoneNumber()
    @ApiPropertyOptional({ type: String, example: '+5524999000444' })
    phone: string;

    @IsOptional()
    @IsNotEmpty()
    @IsPostalCode('BR')
    @ApiPropertyOptional({ type: String, example: '78556-556' })
    CEP: string;
    
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, example: 'Quadra T 20 Rua LO 7' })
    address: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, example: 'Palmas' })
    city: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, example: 'TO' })
    state: string;
}