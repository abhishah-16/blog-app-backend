import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../models/blog.entity';
import { Blog } from '../models/blog.interface';
import { UserService } from '../../user/services/user.service'
import slugify from 'slugify';

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntryEntity) private readonly blogRepository: Repository<BlogEntryEntity>,
        private authservice: AuthService,
        private userservice: UserService
    ) { }


    create(user: User, blog: Blog): Observable<Blog> {
        blog.author = user
        console.log(typeof(blog.author));
        return this.generateSlug(blog.title).pipe(
            switchMap((slug: string) => {
                blog.slug = slug
                return from(this.blogRepository.save(blog))
            })
        )
    }

    generateSlug(title: string): Observable<string> {
        return of(slugify(title))
    }

    findAll(): Observable<Blog[]> {
        return from(this.blogRepository.find({
            relations: ['author'],
        }))
    }


    findByUser(userid: any): Observable<Blog[]> {
        return from(this.blogRepository.find({
            
            where: {
                   author: userid
            },
            relations: ['author']
        })).pipe(map((blogEntries: Blog[]) => blogEntries))
    }

}
