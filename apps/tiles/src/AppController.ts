import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { type Response } from 'express'

@Controller()
export class AppController {
  @Get('')
  get(@Res() res: Response): void {
    res.sendStatus(HttpStatus.OK)
  }
}
