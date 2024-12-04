import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("articles")
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column("text")
  content!: string;

  @Column("datetime")
  publishDate!: Date;

  @Column({ unique: true })
  sourceUrl!: string;

  @Column("simple-array")
  topics!: string[];

  @Column("simple-json")
  entities!: {
    people: string[];
    locations: string[];
    organizations: string[];
  };

  @CreateDateColumn()
  createdAt!: Date;
}
