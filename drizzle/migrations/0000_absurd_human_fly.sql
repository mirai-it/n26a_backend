CREATE TABLE `admin` (
	`id` text PRIMARY KEY NOT NULL,
	`passwordSalt` text NOT NULL,
	`passwordHash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `locate` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `count_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`count` integer NOT NULL,
	`timestamp` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`locate_id` integer NOT NULL,
	`src_type` integer NOT NULL,
	FOREIGN KEY (`locate_id`) REFERENCES `locate`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`src_type`) REFERENCES `src_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `src_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(100) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `locate_name_unique` ON `locate` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `src_type_name_unique` ON `src_type` (`name`);