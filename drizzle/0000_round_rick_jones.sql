CREATE TABLE `Role` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Room` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`scheduleID` text NOT NULL,
	`activeInSchedule` integer DEFAULT false NOT NULL,
	`roomNr` integer NOT NULL,
	`userId` text,
	FOREIGN KEY (`scheduleID`) REFERENCES `Schedule`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `Schedule` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`startingWeek` integer NOT NULL,
	`name` text NOT NULL,
	`isActive` integer DEFAULT false NOT NULL,
	`createdBy` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ScheduleRow` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room` text,
	`scheduleId` text NOT NULL,
	`weekNr` integer DEFAULT 0 NOT NULL,
	`show` integer DEFAULT true,
	FOREIGN KEY (`room`) REFERENCES `Room`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text,
	`email` text
);
