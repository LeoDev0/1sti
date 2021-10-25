import { 
    ArgumentMetadata, 
    BadRequestException, 
    PipeTransform 
} from "@nestjs/common";

export class ParametersValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(!value) {
            throw new BadRequestException(`The ${metadata.data} field must be informed.`);
        }

        return value;
    }
}