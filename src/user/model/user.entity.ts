import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    username: string

    @Column()
    email:string

    @Column()
    password:string

    @BeforeInsert()
    emailtolowercase(){
        this.email = this.email.toLowerCase()
    }
}