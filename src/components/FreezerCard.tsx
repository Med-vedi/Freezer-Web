import {
    Card,
    Text,
    Group,
    ActionIcon,
    Menu,
    Badge,
    Stack,
    ThemeIcon,
} from '@mantine/core';
import {
    IconDots,
    IconEdit,
    IconTrash,
    IconSettings,
    IconFreezeRow,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Freezer } from '../types/freezer';

interface FreezerCardProps {
    freezer: Freezer;
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function FreezerCard({ freezer, onClick, onEdit, onDelete }: FreezerCardProps) {
    const { t } = useTranslation();

    const totalProducts = freezer.shelves?.reduce((total, shelf) => {
        return total + (shelf.products?.length || 0);
    }, 0) || 0;

    const totalQuantity = freezer.shelves?.reduce((total, shelf) => {
        return total + (shelf.products?.reduce((shelfTotal, product) => {
            return shelfTotal + product.quantity;
        }, 0) || 0);
    }, 0) || 0;

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={onClick}
        >
            <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                    <Group gap="xs">
                        <ThemeIcon color="blue" variant="light">
                            <IconFreezeRow size={16} />
                        </ThemeIcon>
                        <Text fw={500} size="lg">
                            {freezer.name}
                        </Text>
                    </Group>

                    <Menu>
                        <Menu.Target>
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <IconDots size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEdit size={14} />} onClick={onEdit}>
                                {t('freezer.editFreezer')}
                            </Menu.Item>
                            <Menu.Item leftSection={<IconSettings size={14} />}>
                                {t('common.settings')}
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                leftSection={<IconTrash size={14} />}
                                color="red"
                                onClick={onDelete}
                            >
                                {t('freezer.deleteFreezer')}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Card.Section>

            <Stack gap="xs" mt="md">
                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        {t('freezer.shelvesCount', { count: freezer.shelves?.length || 0 })}
                    </Text>
                    <Badge color="blue" variant="light">
                        {t('freezer.totalProducts', { count: totalProducts })}
                    </Badge>
                </Group>

                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        Total Quantity
                    </Text>
                    <Text size="sm" fw={500}>
                        {totalQuantity}
                    </Text>
                </Group>

                <Text size="xs" c="dimmed" mt="xs">
                    Created {new Date(freezer.created_at).toLocaleDateString()}
                </Text>
            </Stack>
        </Card>
    );
}
