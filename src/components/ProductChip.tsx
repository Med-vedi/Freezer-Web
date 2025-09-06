import { useState } from 'react';
import {
    Card,
    Text,
    Group,
    Badge,
    ActionIcon,
    Menu,
    NumberInput,
    Stack,
    ThemeIcon,
} from '@mantine/core';
import {
    IconDots,
    IconEdit,
    IconTrash,
    IconArrowRight,
    IconMinus,
    IconPlus,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useModals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Product } from '../types/product';
import { getExpiryStatus, getDaysUntilExpiry, getExpiryText } from '../utils/date';
import { supabase } from '../supabase/supabaseClient';

interface ProductChipProps {
    product: Product;
    onClick: () => void;
    onEdit: () => void;
}

export default function ProductChip({ product, onClick, onEdit }: ProductChipProps) {
    const { t } = useTranslation();
    const modals = useModals();
    const [updating, setUpdating] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity);

    const expiryStatus = getExpiryStatus(product.expiry_date);
    const daysUntilExpiry = getDaysUntilExpiry(product.expiry_date);
    const expiryText = getExpiryText(product.expiry_date);

    const getExpiryColor = (status: string) => {
        switch (status) {
            case 'good': return 'green';
            case 'warning': return 'yellow';
            case 'danger': return 'red';
            default: return 'gray';
        }
    };

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 0) return;

        setUpdating(true);
        try {
            if (newQuantity === 0) {
                // Delete product if quantity is 0
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', product.id);

                if (error) throw error;

                notifications.show({
                    title: t('notifications.productRemoved'),
                    message: '',
                    color: 'green',
                });
            } else {
                // Update quantity
                const { error } = await supabase
                    .from('products')
                    .update({ quantity: newQuantity })
                    .eq('id', product.id);

                if (error) throw error;

                setQuantity(newQuantity);
                notifications.show({
                    title: t('notifications.productUpdated'),
                    message: '',
                    color: 'green',
                });
            }
        } catch (error) {
            notifications.show({
                title: t('common.error'),
                message: error.message,
                color: 'red',
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = () => {
        modals.openConfirmModal({
            title: t('shelf.confirmRemoveProduct'),
            children: (
                <Text size="sm">
                    {t('product.remove')} "{product.name}"?
                </Text>
            ),
            labels: { confirm: t('common.delete'), cancel: t('common.cancel') },
            confirmProps: { color: 'red' },
            onConfirm: () => handleQuantityChange(0),
        });
    };

    const handleMove = () => {
        // TODO: Implement move functionality
        notifications.show({
            title: 'Coming Soon',
            message: 'Move functionality will be implemented soon',
            color: 'blue',
        });
    };

    return (
        <Card
            shadow="sm"
            padding="sm"
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={onClick}
        >
            <Stack gap="xs">
                <Group justify="space-between">
                    <Text fw={500} size="sm" lineClamp={1}>
                        {product.name}
                    </Text>
                    <Menu>
                        <Menu.Target>
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <IconDots size={14} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item leftSection={<IconEdit size={14} />} onClick={onEdit}>
                                {t('common.edit')}
                            </Menu.Item>
                            <Menu.Item leftSection={<IconArrowRight size={14} />} onClick={handleMove}>
                                {t('shelf.moveProduct')}
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                leftSection={<IconTrash size={14} />}
                                color="red"
                                onClick={handleDelete}
                            >
                                {t('common.delete')}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>

                <Group justify="space-between">
                    <Badge
                        color={getExpiryColor(expiryStatus)}
                        variant="light"
                        size="sm"
                    >
                        {expiryText}
                    </Badge>
                    <Text size="xs" c="dimmed">
                        {quantity} {product.unit}
                    </Text>
                </Group>

                <Group justify="space-between" gap="xs">
                    <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(quantity - 1);
                        }}
                        disabled={updating || quantity <= 0}
                    >
                        <IconMinus size={12} />
                    </ActionIcon>

                    <NumberInput
                        value={quantity}
                        onChange={(value) => {
                            const newQuantity = typeof value === 'string' ? parseInt(value) || 0 : value;
                            if (newQuantity !== quantity) {
                                handleQuantityChange(newQuantity);
                            }
                        }}
                        min={0}
                        max={999}
                        size="xs"
                        style={{ width: 60 }}
                        onClick={(e) => e.stopPropagation()}
                    />

                    <ActionIcon
                        variant="subtle"
                        color="green"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(quantity + 1);
                        }}
                        disabled={updating}
                    >
                        <IconPlus size={12} />
                    </ActionIcon>
                </Group>

                {product.notes && (
                    <Text size="xs" c="dimmed" lineClamp={1}>
                        {product.notes}
                    </Text>
                )}
            </Stack>
        </Card>
    );
}
