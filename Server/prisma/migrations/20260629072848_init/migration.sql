-- CreateTable
CREATE TABLE `test_conduct_bodies` (
    `testBodyID` INTEGER NOT NULL AUTO_INCREMENT,
    `shortName` VARCHAR(50) NOT NULL,
    `fullName` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`testBodyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `positionID` INTEGER NOT NULL AUTO_INCREMENT,
    `positionTitle` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `department` VARCHAR(200) NULL,
    `bpsLevel` VARCHAR(20) NULL,
    `requirements` TEXT NULL,
    `testBodyID` INTEGER NOT NULL,

    PRIMARY KEY (`positionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_posts` (
    `jobPostID` INTEGER NOT NULL AUTO_INCREMENT,
    `jobTitle` VARCHAR(200) NOT NULL,
    `department` VARCHAR(200) NULL,
    `bpsLevel` VARCHAR(20) NULL,
    `openSeats` INTEGER NULL,
    `description` TEXT NULL,
    `requirements` TEXT NULL,
    `testConductBodyID` INTEGER NOT NULL,
    `positionID` INTEGER NOT NULL,

    PRIMARY KEY (`jobPostID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `papers` (
    `paperID` INTEGER NOT NULL AUTO_INCREMENT,
    `paperTitle` VARCHAR(300) NOT NULL,
    `year` INTEGER NULL,
    `type` VARCHAR(100) NULL,
    `difficulty` VARCHAR(50) NULL,
    `duration` INTEGER NULL,
    `description` TEXT NULL,
    `jobPositionID` INTEGER NOT NULL,

    PRIMARY KEY (`paperID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `subjectID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `bookID` INTEGER NOT NULL,
    `positionID` INTEGER NOT NULL,

    PRIMARY KEY (`subjectID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `books` (
    `bookID` INTEGER NOT NULL AUTO_INCREMENT,
    `bookName` VARCHAR(300) NOT NULL,
    `author` VARCHAR(200) NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`bookID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book_chapters` (
    `chapterID` INTEGER NOT NULL AUTO_INCREMENT,
    `chapterName` VARCHAR(300) NOT NULL,
    `bookID` INTEGER NOT NULL,
    `subjectID` INTEGER NOT NULL,

    PRIMARY KEY (`chapterID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mcqs` (
    `mcqsID` INTEGER NOT NULL AUTO_INCREMENT,
    `question` TEXT NOT NULL,
    `options` JSON NOT NULL,
    `correctAnswer` VARCHAR(10) NOT NULL,
    `difficulty` VARCHAR(50) NULL,
    `topic` VARCHAR(200) NULL,
    `explanation` TEXT NULL,
    `chapterID` INTEGER NOT NULL,

    PRIMARY KEY (`mcqsID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_patterns` (
    `testPatternID` INTEGER NOT NULL AUTO_INCREMENT,
    `totalMcqs` INTEGER NOT NULL,
    `timeLimit` INTEGER NOT NULL,
    `passingMarks` INTEGER NOT NULL,
    `sections` JSON NOT NULL,
    `positionID` INTEGER NOT NULL,

    PRIMARY KEY (`testPatternID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `authID` VARCHAR(255) NULL,

    UNIQUE INDEX `users_userName_key`(`userName`),
    UNIQUE INDEX `users_authID_key`(`authID`),
    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_personalized` (
    `userPersonalizedID` INTEGER NOT NULL AUTO_INCREMENT,
    `educationalBg` TEXT NULL,
    `testConductBody` VARCHAR(200) NULL,
    `city` VARCHAR(100) NULL,
    `yearsOfExperience` INTEGER NULL,
    `userID` INTEGER NOT NULL,

    UNIQUE INDEX `user_personalized_userID_key`(`userID`),
    PRIMARY KEY (`userPersonalizedID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_testBodyID_fkey` FOREIGN KEY (`testBodyID`) REFERENCES `test_conduct_bodies`(`testBodyID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_posts` ADD CONSTRAINT `job_posts_testConductBodyID_fkey` FOREIGN KEY (`testConductBodyID`) REFERENCES `test_conduct_bodies`(`testBodyID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_posts` ADD CONSTRAINT `job_posts_positionID_fkey` FOREIGN KEY (`positionID`) REFERENCES `positions`(`positionID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `papers` ADD CONSTRAINT `papers_jobPositionID_fkey` FOREIGN KEY (`jobPositionID`) REFERENCES `positions`(`positionID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_bookID_fkey` FOREIGN KEY (`bookID`) REFERENCES `books`(`bookID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_positionID_fkey` FOREIGN KEY (`positionID`) REFERENCES `positions`(`positionID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `book_chapters` ADD CONSTRAINT `book_chapters_bookID_fkey` FOREIGN KEY (`bookID`) REFERENCES `books`(`bookID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `book_chapters` ADD CONSTRAINT `book_chapters_subjectID_fkey` FOREIGN KEY (`subjectID`) REFERENCES `subjects`(`subjectID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mcqs` ADD CONSTRAINT `mcqs_chapterID_fkey` FOREIGN KEY (`chapterID`) REFERENCES `book_chapters`(`chapterID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_patterns` ADD CONSTRAINT `test_patterns_positionID_fkey` FOREIGN KEY (`positionID`) REFERENCES `positions`(`positionID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_personalized` ADD CONSTRAINT `user_personalized_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;
