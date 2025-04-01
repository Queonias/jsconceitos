import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('recados')
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  texto: string;

  // Muitos recados podem ser enviados por uma única pessoa (emissor)
  @ManyToOne(() => Pessoa)
  // Especifica a coluna "de" que armazena o ID da pessoa que enviou o recado
  @JoinColumn({ name: 'de' })
  de: string;

  // Muitos recados podem ser enviados para uma única pessoa (destinatário)
  @ManyToOne(() => Pessoa)
  // Especifica a coluna "para" que armazena o ID da pessoa que recebeu o recado
  @JoinColumn({ name: 'para' })
  para: string;

  @Column({ default: false })
  lido: boolean;

  @CreateDateColumn()
  data: Date; // createdAt

  @UpdateDateColumn()
  updateAt?: Date; // updatedAt
}
