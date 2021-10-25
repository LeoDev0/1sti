import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    PrimaryColumn, 
    UpdateDateColumn 
} from "typeorm";

@Entity('users')
export class User {

    @Column()
    @ApiPropertyOptional({ type: String })
    name: string;

    @Column({ unique: true })
    @ApiPropertyOptional({ type: String })
    phone: string;

    @PrimaryColumn({ unique: true })
    @ApiPropertyOptional({ type: String })
    CPF: string;

    @Column()
    @ApiPropertyOptional({ type: String })
    CEP: string;

    @Column()
    @ApiPropertyOptional({ type: String })
    address: string;

    @Column()
    @ApiPropertyOptional({ type: String })
    city: string;

    @Column()
    @ApiPropertyOptional({ type: String })
    state: string;

    @CreateDateColumn()
    @ApiPropertyOptional({ type: Date })
    created_at: Date;

    @UpdateDateColumn()
    @ApiPropertyOptional({ type: Date })
    updated_at: Date;
}