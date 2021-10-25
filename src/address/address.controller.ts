import { Controller, Get, Param } from '@nestjs/common';
import { 
    ApiBadRequestResponse, 
    ApiExtraModels, 
    ApiInternalServerErrorResponse, 
    ApiOkResponse, 
    ApiTags,
    getSchemaPath
} from '@nestjs/swagger';

import { ParametersValidationPipe } from '../common/pipes/parameters-validation.pipe';
import { AddressService } from './address.service';
import { Address } from './interfaces/address.interface';

@ApiTags('Address')
@Controller('address')
export class AddressController {

    constructor(
        private addressService: AddressService
    ) {}

    @Get('/:CEP')
    @ApiOkResponse({
        description: 'Retrieve complete address from given CEP'
    })
    @ApiBadRequestResponse({
        description: 'This CEP does not exists'
    })
    @ApiInternalServerErrorResponse({
        description: 'Something went wrong! Try it later.'
    })
    public async getAdressInfoByCEP(@Param('CEP', ParametersValidationPipe) CEP: string): Promise<Address> {
        return await this.addressService.getAdressInfoByCEP(CEP);
    }
}
