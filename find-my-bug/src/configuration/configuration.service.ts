import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  public getStringEnv(env: string): string {
    return this.configService.get<string>(env);
  }
}
