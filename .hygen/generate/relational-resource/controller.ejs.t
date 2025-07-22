---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
---
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { <%= h.inflection.transform(name, ['camelize']) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { Create<%= h.inflection.transform(name, ['camelize']) %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Update<%= h.inflection.transform(name, ['camelize']) %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { <%= h.inflection.transform(name, ['camelize']) %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { AuthGuard } from '@nestjs/passport';
import {
  PaginationResponse,
  PaginationResponseDto,
} from '../utils/dto/pagination-response.dto';
import { pagination } from '../utils/pagination';
import { Query<%= h.inflection.transform(name, ['camelize']) %>Dto } from './dto/query-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';

@ApiTags('<%= h.inflection.transform(name, ['pluralize', 'humanize']) %>')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: '<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>',
  version: '1',
})
export class <%= h.inflection.transform(name, ['camelize']) %>Controller {
  constructor(private readonly <%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service: <%= h.inflection.transform(name, ['camelize']) %>Service) {}

  @Post()
  @ApiCreatedResponse({
    type: <%= h.inflection.transform(name, ['camelize']) %>,
  })
  create(@Body() create<%= h.inflection.transform(name, ['camelize']) %>Dto: Create<%= h.inflection.transform(name, ['camelize']) %>Dto) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.create(create<%= h.inflection.transform(name, ['camelize']) %>Dto);
  }

  @Get()
  @ApiOkResponse({
    type: PaginationResponse(<%= h.inflection.transform(name, ['camelize']) %>),
  })
  async findAll(
    @Query() query: Query<%= h.inflection.transform(name, ['camelize']) %>Dto,
  ): Promise<PaginationResponseDto<<%= h.inflection.transform(name, ['camelize']) %>>> {
    const current = query?.current ?? 1;
    let size = query?.size ?? 10;
    if (size > 50) {
      size = 50;
    }

    const [data, total] =await this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findAllWithPagination({
        paginationOptions: {
          current,
          size,
        },
      }),

    return pagination(
      data,
      { current, size },
      total,
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: <%= h.inflection.transform(name, ['camelize']) %>,
  })
  findById(@Param('id') id: number) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findById(id);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: <%= h.inflection.transform(name, ['camelize']) %>,
  })
  update(
    @Param('id') id: number,
    @Body() update<%= h.inflection.transform(name, ['camelize']) %>Dto: Update<%= h.inflection.transform(name, ['camelize']) %>Dto,
  ) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.update(id, update<%= h.inflection.transform(name, ['camelize']) %>Dto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.remove(id);
  }
}
