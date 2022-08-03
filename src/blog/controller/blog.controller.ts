import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
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
}
