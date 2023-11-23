import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCreateDateCol1700665148259 implements MigrationInterface {
    name = 'UpdateCreateDateCol1700665148259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "lastUpdatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "create_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "create_date" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "create_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "map" ALTER COLUMN "create_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "lastUpdatedDate"`);
    }

}
