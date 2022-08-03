import { UserEntity } from "src/user/model/user.entity";
import { BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('blog')
export class BlogEntryEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    slug: string

    @Column({ default: '' })
    description: string

    @Column({ default: '' })
    body: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

    
    @BeforeUpdate()
    updatetimestamp() {
        this.updatedAt = new Date
    }

    @Column({ default: 0 })
    likes: number

    @Column({ nullable: true })
    headerImage: string

    @Column({ nullable: true })
    publishedDate: Date

    @Column({ default: false })
    isPublished: boolean

    @ManyToOne(() => UserEntity, (author) => author.blog)
    authorid: UserEntity


}