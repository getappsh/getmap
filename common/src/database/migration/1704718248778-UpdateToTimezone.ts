import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateToTimezone1704718248778 implements MigrationInterface {
    name = 'UpdateToTimezone1704718248778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "lastUpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "lastUpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "lastUpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
