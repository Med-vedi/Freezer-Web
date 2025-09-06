import {
    Card,
    Text,
    Group,
    Badge,
    Stack,
    ThemeIcon,
    ActionIcon,
    Alert,
} from '@mantine/core';
import {
    IconPackage,
    IconEye,
    IconAlertTriangle,
    IconClock,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Shelf } from '../types/freezer';
import { getExpiryStatus, getDaysUntilExpiry } from '../utils/date';

interface ShelfCardProps {
    shelf: Shelf;
    onShelfClick: (shelf: Shelf) => void;
}

export default function ShelfCard({ shelf, onShelfClick }: ShelfCardProps) {
    const { t } = useTranslation();

    const products = shelf.products || [];
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);

    const expiringSoon = products.filter(product => {
        const status = getExpiryStatus(product.expiry_date);
        return status === 'warning' || status === 'danger';
    }).length;

    const expired = products.filter(product => {
        const status = getExpiryStatus(product.expiry_date);
        return status === 'danger' && getDaysUntilExpiry(product.expiry_date) < 0;
    }).length;

    const handleShelfClick = () => {
        onShelfClick(shelf);
    };

    // const getExpiryColor = (status: string) => {
    //     switch (status) {
    //         case 'good': return 'green';
    //         case 'warning': return 'yellow';
    //         case 'danger': return 'red';
    //         default: return 'gray';
    //     }
    // };

    return (
        <>
            <Card
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={handleShelfClick}
            >
                <Stack gap="sm">
                    <Group justify="space-between">
                        <Group gap="xs">
                            <ThemeIcon color="blue" variant="light">
                                <IconPackage size={16} />
                            </ThemeIcon>
                            <Text fw={500}>
                                {shelf.name || t('shelf.shelfNumber', { number: shelf.index_in_freezer })}
                            </Text>
                        </Group>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShelfClick();
                            }}
                        >
                            <IconEye size={16} />
                        </ActionIcon>
                    </Group>

                    <Group justify="space-between">
                        <Badge color="blue" variant="light">
                            {t('shelf.shelfStats.totalProducts', { count: totalProducts })}
                        </Badge>
                        <Text size="sm" c="dimmed">
                            {t('shelf.shelfStats.totalQuantity', { count: totalQuantity })}
                        </Text>
                    </Group>

                    {expiringSoon > 0 && (
                        <Alert
                            icon={<IconAlertTriangle size={16} />}
                            color="yellow"
                            variant="light"
                        >
                            {t('shelf.shelfStats.expiringSoon', { count: expiringSoon })}
                        </Alert>
                    )}

                    {expired > 0 && (
                        <Alert
                            icon={<IconClock size={16} />}
                            color="red"
                            variant="light"
                        >
                            {t('shelf.shelfStats.expired', { count: expired })}
                        </Alert>
                    )}

                    {totalProducts === 0 && (
                        <Text size="sm" c="dimmed" ta="center" py="sm">
                            {t('shelf.emptyShelf')}
                        </Text>
                    )}
                </Stack>
            </Card>
        </>
    );
}
