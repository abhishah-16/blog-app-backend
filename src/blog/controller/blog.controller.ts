import { Body, Controller, Post, UseGuards, Request, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { jwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Blog } from '../models/blog.interface';
import { BlogService } from '../services/blog.service';

@Controller('blogs')
export class BlogController {
    constructor(
        private blogservice: BlogService
    ) { }

    @UseGuards(jwtAuthGuard)
    @Post()
    create(@Body() blog: Blog, @Request() req): Observable<Blog> {
        const user = req.user.user
        return this.blogservice.create(user, blog)
    }

    @UseGuards(jwtAuthGuard)
    @Get()
    findAll(@Query('userid') userid: any): Observable<Blog[]> {
        if (userid === null) {
            return this.blogservice.findAll()
        } else {
            return this.blogservice.findByUser(userid)
        }
    }

}
