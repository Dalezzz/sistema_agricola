import { Module } from '@nestjs/common';
import { CropsService } from './crops.service';

@Module({
	providers: [CropsService],
	exports: [CropsService],
})
export class CropsModule {}
