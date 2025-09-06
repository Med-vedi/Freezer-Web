import { Skeleton, Stack, Grid, Card, Group } from '@mantine/core';

interface LoadingStateProps {
    count?: number;
    columns?: number;
}

export function LoadingState({ count = 6, columns = 3 }: LoadingStateProps) {
    return (
        <Grid>
            {Array.from({ length: count }, (_, index) => (
                <Grid.Col span={{ base: 12, sm: 6, md: columns === 2 ? 6 : 4 }} key={index}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="xs">
                            <Skeleton height={20} width="70%" />
                            <Skeleton height={20} width="20%" />
                        </Group>
                        <Skeleton height={16} width="90%" mb="xs" />
                        <Skeleton height={16} width="60%" mb="xs" />
                        <Skeleton height={16} width="80%" />
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
}

export function LoadingFilters() {
    return (
        <Group grow>
            <Skeleton height={36} radius="sm" style={{ flex: 1 }} />
            <Skeleton height={36} radius="sm" width={150} />
            <Skeleton height={36} radius="sm" width={150} />
        </Group>
    );
}
