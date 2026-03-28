import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePromocodesAndActivationsTables1774673497838
  implements MigrationInterface
{
  name = 'CreatePromocodesAndActivationsTables1774673497838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "promocodes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "discount" integer NOT NULL, "activation_limit" integer NOT NULL, "expiration_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_387db72002ac376137fb359564e" UNIQUE ("code"), CONSTRAINT "PK_cfd49e54a2ddfbc02636f8f2904" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "promocode_id" uuid NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_287e28a22354bfe09cace14920e" UNIQUE ("promocode_id", "email"), CONSTRAINT "PK_db9ffdd659f4ac699248030b596" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "activations" ADD CONSTRAINT "FK_bfddee581fbe9a278eb69b906ef" FOREIGN KEY ("promocode_id") REFERENCES "promocodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activations" DROP CONSTRAINT "FK_bfddee581fbe9a278eb69b906ef"`,
    );
    await queryRunner.query(`DROP TABLE "activations"`);
    await queryRunner.query(`DROP TABLE "promocodes"`);
  }
}
