import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFootPrintColToMapEntity1706706554415 implements MigrationInterface {
    name = 'AddFootPrintColToMapEntity1706706554415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" ADD "foot_print" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "map" DROP COLUMN "foot_print"`);
    }

}
