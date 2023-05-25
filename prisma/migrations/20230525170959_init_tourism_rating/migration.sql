-- DropIndex
DROP INDEX `users_email_key` ON `users`;

-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `tourism_ratings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tourism_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `review` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tourism_ratings` ADD CONSTRAINT `tourism_ratings_tourism_id_fkey` FOREIGN KEY (`tourism_id`) REFERENCES `tourisms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tourism_ratings` ADD CONSTRAINT `tourism_ratings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
