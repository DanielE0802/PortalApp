import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1775941464051 implements MigrationInterface {
  name = 'Migration1775941464051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "content" text NOT NULL, "author_user_id" integer, "reqres_author_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_POST_AUTHOR" ON "posts" ("author_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_POST_CREATED_AT" ON "posts" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "reqres_id" integer NOT NULL, "email" character varying(255) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "avatar" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_449491b6f6edf69940a263b689f" UNIQUE ("reqres_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_USER_REQRES_ID" ON "users" ("reqres_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_USER_EMAIL" ON "users" ("email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_4dd10e577978ddef3ba582f68ad" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_4dd10e577978ddef3ba582f68ad"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_USER_EMAIL"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_USER_REQRES_ID"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_POST_CREATED_AT"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_POST_AUTHOR"`);
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
