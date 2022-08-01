import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '../model/user.interface';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
    constructor(
        private userservice: UserService
    ) { }

    @Post()
    create(@Body() user: User) {
        return this.userservice.create(user)
    }

    @Get(':id')
    findOne(@Param() param) {
        return this.userservice.findOne(param.id)
    }

    @Get()
    findall() {
        return this.userservice.findAll()
    }

    @Delete(':id')
    deleteone(@Param('id')id:string) {
        return this.userservice.deleteOne(+id)
    }

    @Put(':id')
    updateone(@Param('id')id:string,@Body() user: User) {
        return this.userservice.updateOne(+id,user)
    }
}
