import { useState } from 'react';
import {
    Drawer,
    Title,
    Stack,
    Grid,
    Group,
    Button,
    Text,
    ActionIcon,
    Alert,
    TextInput,
    Card,
    Center,
    ThemeIcon,
    Divider,
} from '@mantine/core';
import {
    IconPlus,
    IconArrowLeft,
    IconAlertTriangle,
    IconClock,
    IconEdit,
    IconCheck,
    IconX,
    IconBox,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { supabase } from '../supabase/supabaseClient';
import { Shelf, Freezer } from '../types/freezer';
import { Product } from '../types/product';
import { getExpiryStatus, getDaysUntilExpiry } from '../utils/date';
import ProductChip from './ProductChip';
import ProductForm from './ProductForm';

interface ShelfDrawerProps {
    opened: boolean;
    onClose: () => void;
    onBack: () => void;
    shelf: Shelf | null;
    freezer: Freezer | null;
}

export default function ShelfDrawer({ opened, onClose, onBack, shelf, freezer }: ShelfDrawerProps) {
    const { t } = useTranslation();
    const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [shelfName, setShelfName] = useState('');
    const [saving, setSaving] = useState(false);

    if (!shelf || !freezer) return null;

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

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        openForm();
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        openForm();
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        openForm();
    };

    const handleEditName = () => {
        setShelfName(shelf.name || '');
        setIsEditingName(true);
    };

    const handleSaveName = async () => {
        if (!shelf) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('shelves')
                .update({ name: shelfName.trim() || null })
                .eq('id', shelf.id);

            if (error) throw error;

            notifications.show({
                title: t('notifications.shelfUpdated'),
                message: t('shelf.nameUpdated'),
                color: 'green',
            });

            setIsEditingName(false);
            // Обновляем shelf объект локально
            shelf.name = shelfName.trim() || undefined;
        } catch (error: unknown) {
            console.error('Error updating shelf name:', error);
            notifications.show({
                title: t('common.error'),
                message: error instanceof Error ? error.message : 'Unknown error',
                color: 'red',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setShelfName('');
        setIsEditingName(false);
    };

    return (
        <>
            <Drawer
                opened={opened}
                onClose={onClose}
                title={
                    <Group gap="xs" w="100%">
                        <ActionIcon variant="subtle" onClick={onBack}>
                            <IconArrowLeft size={16} />
                        </ActionIcon>
                        {isEditingName ? (
                            <Group gap="xs" style={{ flex: 1 }}>
                                <TextInput
                                    value={shelfName}
                                    onChange={(e) => setShelfName(e.currentTarget.value)}
                                    placeholder={t('shelf.shelfName')}
                                    size="sm"
                                    style={{ flex: 1 }}
                                    autoFocus
                                />
                                <ActionIcon
                                    variant="subtle"
                                    color="green"
                                    onClick={handleSaveName}
                                    loading={saving}
                                >
                                    <IconCheck size={16} />
                                </ActionIcon>
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    onClick={handleCancelEdit}
                                >
                                    <IconX size={16} />
                                </ActionIcon>
                            </Group>
                        ) : (
                            <Group gap="xs" style={{ flex: 1 }}>
                                <Title order={3} style={{ flex: 1 }}>
                                    {shelf.name || t('shelf.shelfNumber', { number: shelf.index_in_freezer })}
                                </Title>
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    onClick={handleEditName}
                                >
                                    <IconEdit size={16} />
                                </ActionIcon>
                            </Group>
                        )}
                    </Group>
                }
                size="xl"
                position="right"
            >
                <Stack gap="md">
                    <Group justify="space-between">
                        <Stack gap="xs">
                            <Text size="sm" c="dimmed">
                                {t('shelf.shelfStats.totalProducts', { count: totalProducts })}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {t('shelf.shelfStats.totalQuantity', { count: totalQuantity })}
                            </Text>
                        </Stack>
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={handleAddProduct}
                            size="sm"
                        >
                            {t('shelf.addProduct')}
                        </Button>
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

                    {totalProducts === 0 ? (
                        <Card withBorder p="xl" radius="md" shadow="sm">
                            <Center>
                                <Stack gap="md" align="center">
                                    <ThemeIcon size={80} radius="xl" variant="light" color="gray">
                                        <IconBox size={40} />
                                    </ThemeIcon>

                                    <Stack gap="xs" align="center">
                                        <Text size="xl" fw={600} c="dimmed">
                                            {t('shelf.emptyShelf')}
                                        </Text>
                                        <Text size="sm" c="dimmed" ta="center" maw={300}>
                                            {t('shelf.emptyShelfDescription')}
                                        </Text>
                                    </Stack>

                                    <Divider w={200} />

                                    <Stack gap="xs" align="center">
                                        <Text size="sm" fw={500} c="dimmed">
                                            {t('shelf.getStarted')}
                                        </Text>
                                        <Button
                                            leftSection={<IconPlus size={16} />}
                                            onClick={handleAddProduct}
                                            size="md"
                                            variant="light"
                                        >
                                            {t('shelf.addFirstProduct')}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Center>
                        </Card>
                    ) : (
                        <Grid>
                            {products.map((product) => (
                                <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
                                    <ProductChip
                                        product={product}
                                        onClick={() => handleProductClick(product)}
                                        onEdit={() => handleEditProduct(product)}
                                    />
                                </Grid.Col>
                            ))}
                        </Grid>
                    )}
                </Stack>
            </Drawer>

            <ProductForm
                opened={formOpened}
                onClose={closeForm}
                shelf={shelf}
                freezer={freezer}
                product={selectedProduct}
            />
        </>
    );
}
