// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { ItemsService } from './items.service';
// import { CreateItemDto } from './dto/create-item.dto';
// import { UpdateItemDto } from './dto/update-item.dto';
// import { MetricsService } from '../metrics/metrics.service';
// import { Counter, Histogram } from 'prom-client';
// import { InjectMetric } from '@willsoto/nestjs-prometheus';

// @Controller('items')
// export class ItemsController {
//   constructor(
//     private readonly itemsService: ItemsService,
//     private readonly metricsService: MetricsService
//   ) {}

//   @Post()
//   // create(@Body() createItemDto: CreateItemDto) {
//   create(@Body() req: any) {
//     const end = this.metricsService.startTimer(); 
//     this.metricsService.incrementRequestCounter(); 
//     const result = this.itemsService.create(req);
//     // end();
//     return result;
//   }

//   @Get()

//   findAll() {
//     const end = this.metricsService.startTimer();
//     this.metricsService.incrementRequestCounter();
//     // this.metricsService.incrementRequestCounter();
//     // return this.itemsService.findAll();
//     const result = this.itemsService.findAll();
//     end();
//     return result;
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     const end = this.metricsService.startTimer();
//     this.metricsService.incrementRequestCounter();
//     const result = this.itemsService.findOne(+id);
//     end();
//     return result;
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
//     const end = this.metricsService.startTimer();
//     this.metricsService.incrementRequestCounter();
//     const result = this.itemsService.update(+id, updateItemDto);
//     end();
//     return result;
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     const end = this.metricsService.startTimer();
//     this.metricsService.incrementRequestCounter();
//     const result = this.itemsService.remove(+id);
//     end();
//     return result;
//   }
// }

// import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
// import { ItemsService } from './items.service';
// import { MetricsService } from '../metrics/metrics.service';
// import { CreateItemDto } from './dto/create-item.dto';
// import { UpdateItemDto } from './dto/update-item.dto';
// import { Response } from 'express'; // Import Response for better type handling

// @Controller('items')
// export class ItemsController {
//   constructor(
//     private readonly itemsService: ItemsService,
//     private readonly metricsService: MetricsService,
//   ) { }

//   @Post()
//   async create(@Body() createItemDto: CreateItemDto, @Res() res: Response) { // Add @Res() here
//     const end = this.metricsService.startRequestTimer('POST', 'items'); 
//     this.metricsService.incrementRequestCounter('POST'); 

//     try {
//       const result = await this.itemsService.create(createItemDto);
//       end(); // End the timer
//       return res.status(201).json(result); // Respond with 201 Created
//     } catch (error) {
//       end(); // End the timer even if there's an error
//       return res.status(500).json({ error: error.message }); // Log error
//     }
//   }

//   @Get()
//   async findAll(@Res() res: Response) {
//     const end = this.metricsService.startRequestTimer('GET', 'items');
//     this.metricsService.incrementRequestCounter('GET');

//     try {
//       const result = await this.itemsService.findAll();
//       end();
//       return res.status(200).json(result); // Respond with 200 OK
//     } catch (error) {
//       end();
//       return res.status(500).json({ error: error.message });
//     }
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string, @Res() res: Response) {
//     const end = this.metricsService.startRequestTimer('GET', `items/${id}`);
//     this.metricsService.incrementRequestCounter('GET');

//     try {
//       const result = await this.itemsService.findOne(+id);
//       end();
//       return res.status(200).json(result); // Respond with 200 OK
//     } catch (error) {
//       end();
//       return res.status(404).json({ error: 'Item not found' }); // Log not found
//     }
//   }

//   @Patch(':id')
//   async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto, @Res() res: Response) {
//     const end = this.metricsService.startRequestTimer('PATCH', `items/${id}`);
//     this.metricsService.incrementRequestCounter('PATCH');

//     try {
//       const result = await this.itemsService.update(+id, updateItemDto);
//       end();
//       return res.status(200).json(result); // Respond with 200 OK
//     } catch (error) {
//       end();
//       return res.status(404).json({ error: 'Item not found' }); // Log not found
//     }
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: string, @Res() res: Response) {
//     const end = this.metricsService.startRequestTimer('DELETE', `items/${id}`);
//     this.metricsService.incrementRequestCounter('DELETE');

//     try {
//       const result = await this.itemsService.remove(+id);
//       end();
//       return res.status(204).json(); // Respond with 204 No Content
//     } catch (error) {
//       end();
//       return res.status(404).json({ error: 'Item not found' }); // Log not found
//     }
//   }
// }

import { Controller, Get, Post, Patch, Body, Param, Delete, Inject, Res, HttpStatus, Req } from '@nestjs/common';
import { Response } from 'express';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { MetricsService } from '../metrics/metrics.service';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    // @Inject(MetricsService) private readonly metricsService: MetricsService,
    private readonly metricsService: MetricsService
  ) { }

  @Get()
  async findAll(@Req() req, @Res() res: Response) {
    const track = this.metricsService.trackRequest(req.method, req.route.path);
    try {
      const result = await this.itemsService.findAll();
      track(HttpStatus.OK);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      track(HttpStatus.INTERNAL_SERVER_ERROR, error);
      throw error;
    }
  }

  @Post()
  async create(@Req() req, @Body() createItemDto: CreateItemDto, @Res() res: Response) {
    const track = this.metricsService.trackRequest(req.method, req.route.path);
    try {
      const result = await this.itemsService.create(createItemDto);
      track(HttpStatus.OK);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      track(HttpStatus.INTERNAL_SERVER_ERROR, error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string, @Res() res: Response) {
    const track = this.metricsService.trackRequest(req.method, `${req.route.path}/${id}`);
    try {
      const result = await this.itemsService.findOne(+id);
      track(HttpStatus.OK);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      track(HttpStatus.INTERNAL_SERVER_ERROR, error);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateItemDto: UpdateItemDto, @Res() res: Response) {
    const track = this.metricsService.trackRequest(req.method, `${req.route.path}/${id}`);

    try {
      const result = await this.itemsService.update(+id, updateItemDto);
      track(HttpStatus.OK);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      track(HttpStatus.INTERNAL_SERVER_ERROR, error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @Res() res: Response) {
    const track = this.metricsService.trackRequest(req.method, `${req.route.path}/${id}`);

    try {
      const result = await this.itemsService.remove(+id);
      track(HttpStatus.OK);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      track(HttpStatus.INTERNAL_SERVER_ERROR, error);
      throw error;
    }
  }
}
