import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { PromocodesService } from '../domain';
import { ActivatePromocodeBody, CreatePromocodeBody } from './bodies';
import { GetPromocodeIdParams } from './params';
import { PromocodeResource } from './resources';

@ApiTags('Promocodes')
@Controller('/v1/promocodes')
export class PromocodesController {
  constructor(
    private readonly promocodesService: PromocodesService,
    private readonly promocodeResource: PromocodeResource,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all promocodes' })
  @ApiOkResponse({ description: 'Promocodes list' })
  async getAllPromocodes() {
    const promocodes = await this.promocodesService.getAllPromocodes();

    return {
      data: promocodes.map((promocode) =>
        this.promocodeResource.convert(promocode),
      ),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promocode by id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Promocode id' })
  @ApiOkResponse({ description: 'Promocode details' })
  @ApiNotFoundResponse({ description: 'Promocode not found' })
  async getPromocodeById(@Param() param: GetPromocodeIdParams) {
    const promocode = await this.promocodesService.getPromocodeById(param.id);

    return {
      data: this.promocodeResource.convert(promocode),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create promocode' })
  @ApiCreatedResponse({ description: 'Promocode created' })
  @ApiConflictResponse({ description: 'Promocode already exists' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async createPromocode(@Body() body: CreatePromocodeBody) {
    const promocode = await this.promocodesService.createPromocode({
      code: body.code,
      discount: body.discount,
      activationLimit: body.activation_limit,
      expirationDate: body.expiration_date
        ? new Date(body.expiration_date)
        : undefined,
    });

    return {
      data: this.promocodeResource.convert(promocode),
    };
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate promocode by email' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Promocode id' })
  @ApiOkResponse({ description: 'Promocode activated' })
  @ApiNotFoundResponse({ description: 'Promocode not found' })
  @ApiConflictResponse({
    description: 'Email already activated this promocode',
  })
  @ApiBadRequestResponse({
    description:
      'Validation error, promocode expired, or activation limit reached',
  })
  async activatePromocode(
    @Param() param: GetPromocodeIdParams,
    @Body() body: ActivatePromocodeBody,
  ) {
    const promocode = await this.promocodesService.activatePromocode(
      param.id,
      body.email,
    );

    return {
      data: {
        promocode: this.promocodeResource.convert(promocode),
        email: body.email.trim().toLowerCase(),
      },
    };
  }
}
