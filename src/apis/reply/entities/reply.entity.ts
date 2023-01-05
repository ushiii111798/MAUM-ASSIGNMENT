import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { Member } from 'src/apis/member/entities/member.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum REPLY_TYPE {
  MASTER = 'MASTER',
  SLAVE = 'SLAVE',
}

registerEnumType(REPLY_TYPE, {
  name: 'REPLY_TYPE',
});

@Entity()
@ObjectType()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'enum', enum: REPLY_TYPE, default: REPLY_TYPE.MASTER })
  @Field(() => REPLY_TYPE, { defaultValue: REPLY_TYPE.MASTER })
  type: REPLY_TYPE;

  @ManyToOne(() => Reply)
  @JoinColumn()
  @Field(() => Reply, { nullable: true })
  masterReply: Reply;

  @ManyToOne(() => Board)
  @JoinColumn()
  board: Board;

  @ManyToOne(() => Member)
  @JoinColumn()
  @Field(() => Member)
  member: Member;

  @Column()
  @Field(() => String)
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt: Date;
}
