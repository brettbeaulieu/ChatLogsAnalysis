import { Button, Popover } from "@mantine/core";
import { DatePicker, type DateValue } from "@mantine/dates";
import type React from "react";
import { toIsoDateString } from "@/api/apiHelpers";
import styles from "./DateMenu.module.css";

export interface DataStruct {
	title: string;
	value: number;
	diff: number;
}

export interface DateMenuProps {
	dateRange: [DateValue, DateValue];
	dateChange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
}

export function DateMenu({ dateRange, dateChange }: Readonly<DateMenuProps>) {
	return (
		<div className={styles.root}>
			<Popover withArrow>
				<Popover.Target>
					<Button
						classNames={{ root: styles.button, label: styles.textLabel }}
					>{`${toIsoDateString(dateRange[0])} - ${toIsoDateString(dateRange[1])}`}</Button>
				</Popover.Target>
				<Popover.Dropdown className={styles.dropdown}>
					<DatePicker
						type="range"
						value={dateRange}
						onChange={dateChange}
						allowSingleDateInRange={false}
					/>
				</Popover.Dropdown>
			</Popover>
		</div>
	);
}
