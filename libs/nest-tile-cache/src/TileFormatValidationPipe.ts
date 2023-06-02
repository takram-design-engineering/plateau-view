import {
  BadRequestException,
  Injectable,
  type ArgumentMetadata,
  type PipeTransform
} from '@nestjs/common'

@Injectable()
export class TileFormatValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): string {
    if (value !== 'png' && value !== 'webp') {
      throw new BadRequestException('Invalid format')
    }
    return value
  }
}
