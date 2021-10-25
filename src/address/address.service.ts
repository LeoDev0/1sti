import axios from 'axios';
import Redis from 'ioredis';
import { 
    BadRequestException, 
    Injectable, 
    InternalServerErrorException, 
    Logger 
} from '@nestjs/common';
import { Address } from './interfaces/address.interface';
import Utils from '../common/utils/utils';

@Injectable()
export class AddressService {

    private readonly logger = new Logger(AddressService.name);
    private redis = new Redis({
        port: Number(process.env.REDIS_PORT)
    });

    public async getAdressInfoByCEP(CEP: string): Promise<Address> {
        this.logger.log(`CEP: ${CEP}`);
        
        let address;

        // Check if there is cached data before retrieving from external source
        await this.redis.hgetall(`${CEP}`, (error, result) => {
            if (result && !Utils.isEmptyObject(result)) {
                address = result;
                this.logger.log(`Redis cached data: ${JSON.stringify(result)}`);
            }
        });

        if (!address) {
            this.logger.log(
                `No cached data. Retrieving address from external source: https://viacep.com.br/ws/${CEP}/json/`
            );

            address = this.retrieveAddressFromExternalSourceAndCacheIt(CEP);
        }

        return address;
    }

    private async retrieveAddressFromExternalSourceAndCacheIt(CEP: string): Promise<Address> {
        try {
            const { data } = await axios.get<Address>(
                `https://viacep.com.br/ws/${CEP}/json/`
            );

            if (!!data.erro && data.erro === true) {
                throw new BadRequestException();
            }

            // Caching data to redis server in case of successful retrieval
            await this.redis.hset(`${CEP}`, {
                cep: data.cep,
                logradouro: data.logradouro,
                complemento: data.complemento,
                bairro: data.bairro,
                localidade: data.localidade, 
                uf: data.uf,
                ibge: data.ibge,
                gia: data.gia,
                ddd: data.ddd,
                siafi: data.siafi,
            });
            
            return data;
        } catch (error) {
            this.logger.log(`Error: ${JSON.stringify(error)}`);

            if (error instanceof BadRequestException) {
                throw new BadRequestException(`This CEP does not exists`);
            } else {
                throw new InternalServerErrorException('Something went wrong! Try it later.');
            }
        }
    }
}
