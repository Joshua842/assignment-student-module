import { BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "students"})
export class Student {
// Primary key, auto-generated
  @PrimaryGeneratedColumn()
  id: number;

  // First name (required)
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  // Last name (required)
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  // Email (required, unique)
  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  // Enrollment date (required)
  @Column({ type: 'date' })
  enrollmentDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
