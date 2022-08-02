import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
export enum userRole {
    ADMIN = 'Admin',
    EDITOR = 'Editor',
    CHIEFEDITOR = 'Chiefeditor',
    USER = 'User'
}
@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ type: 'enum', enum: userRole, default: userRole.USER })
    role: userRole

    @Column({nullable:true})
    profileImage:string

    @BeforeInsert()
    emailtolowercase() {
        this.email = this.email.toLowerCase()
    }

}