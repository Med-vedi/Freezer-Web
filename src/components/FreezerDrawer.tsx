import { useEffect, useState } from 'react';
import {
    Drawer,
    Title,
    Stack,
    Grid,
    Group,
    Button,
    Text,
    NumberInput,
    Skeleton,
    Alert,
} from '@mantine/core';
import {
    IconSettings,
    IconAlertCircle,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useFreezerStore } from '../store/freezerStore';
import { notifications } from '@mantine/notifications';
import ShelfCard from './ShelfCard';
import ShelfDrawer from './ShelfDrawer';
import { Freezer, Shelf } from '../types/freezer';

interface FreezerDrawerProps {
    opened: boolean;
    onClose: () => void;
    freezer: Freezer | null;
}

export default function FreezerDrawer({ opened, onClose, freezer }: FreezerDrawerProps) {
    const { t } = useTranslation();
    const { shelves, loading, error, fetchShelves, updateShelfCount } = useFreezerStore();
    const [shelfCount, setShelfCount] = useState(7);
    const [updatingCount, setUpdatingCount] = useState(false);
    const [shelfDrawerOpened, setShelfDrawerOpened] = useState(false);
    const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);


    useEffect(() => {
        if (opened && freezer) {
            fetchShelves(freezer.id);
            setShelfCount(shelves.length || 7);
        }
    }, [opened, freezer, fetchShelves, shelves.length]);

    const handleUpdateShelfCount = async () => {
        if (!freezer) return;

        setUpdatingCount(true);
        const { error } = await updateShelfCount(freezer.id, shelfCount);

        if (error) {
            notifications.show({
                title: t('common.error'),
                message: error,
                color: 'red',
            });
        } else {
            notifications.show({
                title: t('notifications.shelfUpdated'),
                message: '',
                color: 'green',
            });
        }
        setUpdatingCount(false);
    };

    const handleShelfCountChange = (value: string | number) => {
        const newCount = typeof value === 'string' ? parseInt(value) || 0 : value;
        if (newCount >= 1 && newCount <= 20) {
            setShelfCount(newCount);
        }
    };

    const handleShelfClick = (shelf: Shelf) => {
        setSelectedShelf(shelf);
        setShelfDrawerOpened(true);
    };

    const handleShelfDrawerClose = () => {
        setShelfDrawerOpened(false);
        setSelectedShelf(null);
    };

    const handleBackToFreezer = () => {
        setShelfDrawerOpened(false);
        setSelectedShelf(null);
    };

    if (!freezer) return null;

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={<Title order={3}>{freezer.name}</Title>}
            size="xl"
            position="right"
        >
            <Stack gap="md">
                <Group justify="space-between" align="flex-end">
                    <Stack gap="xs">
                        <Text size="sm" fw={500}>
                            {t('shelf.shelfCount')}
                        </Text>
                        <NumberInput
                            value={shelfCount}
                            onChange={handleShelfCountChange}
                            min={1}
                            max={20}
                            size="sm"
                            style={{ width: 120 }}
                        />
                    </Stack>
                    <Button
                        leftSection={<IconSettings size={16} />}
                        onClick={handleUpdateShelfCount}
                        loading={updatingCount}
                        disabled={shelfCount === shelves.length}
                    >
                        {t('shelf.updateShelfCount')}
                    </Button>
                </Group>

                {error && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red">
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Grid>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
                                <Skeleton height={120} />
                            </Grid.Col>
                        ))}
                    </Grid>
                ) : (
                    <Grid>
                        {shelves.map((shelf) => (
                            <Grid.Col key={shelf.id} span={{ base: 12, sm: 6, md: 4 }}>
                                <ShelfCard
                                    shelf={shelf}
                                    onShelfClick={handleShelfClick}
                                />
                            </Grid.Col>
                        ))}
                    </Grid>
                )}

                {!loading && shelves.length === 0 && (
                    <Text ta="center" c="dimmed" py="xl">
                        {t('shelf.emptyShelf')}
                    </Text>
                )}
            </Stack>

            <ShelfDrawer
                opened={shelfDrawerOpened}
                onClose={handleShelfDrawerClose}
                onBack={handleBackToFreezer}
                shelf={selectedShelf}
                freezer={freezer}
            />
        </Drawer>
    );
}
