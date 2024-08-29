import { getData } from "@/api/apiHelpers";
import { Paper, Table, Image, Skeleton, Text } from "@mantine/core";
import { ReactElement, useCallback, useEffect, useState } from "react";
import styles from './EmoteList.module.css';

const api_string = "https://cdn.7tv.app/emote/";

interface Element {
    id: string;
    name: string;
    value: number;
}

interface EmoteListProps {
    channel: string;
    dateRange: [Date | null, Date | null];
}

const formatDate = (date: Date | null): string | null => {
    return date ? date.toISOString().split('T')[0] : null;
};

export function EmoteList({ channel, dateRange }: EmoteListProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [rows, setRows] = useState<ReactElement[]>([]);

    const buildItem = useCallback((element: Element, idx: number): ReactElement => {
        const image_link = api_string + element.id + "/4x.webp";
        return (
            <Table.Tr key={element.name}>
                <Table.Td>{<Text fw={400} ta={"center"} size={"xl"}>{idx + 1}</Text>}</Table.Td>
                <Table.Td align={"center"}>{<Image alt={element.name} src={image_link} h={48} w={48} radius={"md"} />}</Table.Td>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>{element.value}</Table.Td>
            </Table.Tr>
        )
    }, []);

    const buildItems = useCallback((elements: Element[]): ReactElement[] => {
        return elements.map(buildItem);
    }, [buildItem]);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const startDate = formatDate(dateRange[0]);
            const endDate = formatDate(dateRange[1]);

            if (!startDate || !endDate) {
                console.error('Both start date and end date must be selected.');
                setIsLoading(false);
                return;
            }
            const response = await getData('chat/messages/popular_emotes', { channel: channel, start_date: startDate, end_date: endDate });
            const data: Element[] = await response.json();
            console.log(data);
            const temp_rows: ReactElement[] = buildItems(data);
            setRows(temp_rows);
            setIsLoading(false);
        }
        fetchData();
    }, [dateRange, buildItems, channel])

    return (
        <Paper withBorder className={styles.rootPaper}>
            <Skeleton visible={isLoading} className={styles.skeleton}>
                <Table.ScrollContainer minWidth={200} type="scrollarea" className={styles.scrollContainer}>
                    <Table classNames={{ tbody: styles.table }}>
                        <Table.Tr>
                            <Table.Th ta={"center"}>Rank</Table.Th>
                            <Table.Th ta={"center"}>Image</Table.Th>
                            <Table.Th>Emote Name</Table.Th>
                            <Table.Th>Count</Table.Th>
                        </Table.Tr>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Skeleton>
        </Paper>
    )
};