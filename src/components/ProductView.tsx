import { useState } from 'react';
import { useForm } from '@mantine/form';
import {
    Modal,
    Stack,
    Title,
    Text,
    Group,
    Badge,
    Divider,
    Button,
    ActionIcon,
    Card,
    Grid,
    Alert,
    NumberInput,
    Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
    IconPlus,
    IconArrowLeft,
    IconCalendar,
    IconPackage,
    IconTag,
    IconInfoCircle,
    IconNotes,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { supabase } from '../supabase/supabaseClient';
import { LocalizedProductCatalog, CreateProductData } from '../types/product';
import { Shelf, Freezer } from '../types/freezer';

interface ProductViewProps {
    opened: boolean;
    onClose: () => void;
    onBack: () => void;
    onSuccess: () => void;
    catalogItem: LocalizedProductCatalog | null;
    shelf: Shelf | null;
    freezer: Freezer | null;
}

export default function ProductView({
    opened,
    onClose,
    onBack,
    onSuccess,
    catalogItem,
    shelf,
    freezer
}: ProductViewProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    // Устанавливаем дату по умолчанию на +1 месяц
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setMonth(defaultExpiryDate.getMonth() + 1);

    const form = useForm({
        initialValues: {
            quantity: 1,
            expiry_date: defaultExpiryDate,
            notes: '',
        },
        validate: {
            quantity: (value) => (value < 1 ? t('product.validation.quantityMin') : null),
        },
    });

    if (!catalogItem || !shelf || !freezer) return null;

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const productData: CreateProductData = {
                catalog_id: catalogItem.id,
                name: catalogItem.name,
                quantity: values.quantity,
                unit: catalogItem.default_unit || 'pcs',
                shelf_id: shelf.id,
                freezer_id: freezer.id,
                expiry_date: values.expiry_date ? values.expiry_date.toISOString().split('T')[0] : undefined,
                notes: values.notes || undefined,
                added_by_user_id: user.id,
                added_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('products')
                .insert([productData]);

            if (error) throw error;

            notifications.show({
                title: t('notifications.productAdded'),
                message: t('product.addedToShelfSuccess', {
                    productName: catalogItem.name,
                    shelfName: shelf.name || t('shelf.shelfNumber', { number: shelf.index_in_freezer })
                }),
                color: 'green',
            });

            onSuccess();
            onClose();
        } catch (error: unknown) {
            console.error('Error adding product:', error);
            notifications.show({
                title: t('common.error'),
                message: error instanceof Error ? error.message : 'Unknown error',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <ActionIcon variant="subtle" onClick={onBack}>
                        <IconArrowLeft size={16} />
                    </ActionIcon>
                    <Title order={3}>{catalogItem.name}</Title>
                </Group>
            }
            size="lg"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    {/* Информация о продукте */}
                    <Card withBorder p="md" radius="md" shadow="sm">
                        <Stack gap="sm">
                            <Group justify="space-between" align="flex-start">
                                <Group gap="xs">
                                    <Text size="xl">{catalogItem.emoji}</Text>
                                    <div>
                                        <Text fw={600} size="lg">
                                            {catalogItem.name}
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            {catalogItem.description}
                                        </Text>
                                    </div>
                                </Group>
                                <Badge color="blue" variant="light" size="sm">
                                    {catalogItem.category}
                                </Badge>
                            </Group>

                            <Divider />

                            <Grid>
                                <Grid.Col span={6}>
                                    <Group gap="xs" mb="xs">
                                        <IconPackage size={16} />
                                        <Text size="sm" fw={500}>
                                            {t('product.defaultUnit')}
                                        </Text>
                                    </Group>
                                    <Text size="sm" c="dimmed" ml="xl">
                                        {catalogItem.default_unit}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Group gap="xs" mb="xs">
                                        <IconTag size={16} />
                                        <Text size="sm" fw={500}>
                                            {t('product.category')}
                                        </Text>
                                    </Group>
                                    <Text size="sm" c="dimmed" ml="xl">
                                        {catalogItem.category}
                                    </Text>
                                </Grid.Col>
                            </Grid>

                            {catalogItem.is_popular && (
                                <Alert
                                    icon={<IconInfoCircle size={16} />}
                                    color="green"
                                    variant="light"
                                >
                                    {t('product.popularProduct')}
                                </Alert>
                            )}

                            {catalogItem.is_seasonal && (
                                <Alert
                                    icon={<IconCalendar size={16} />}
                                    color="orange"
                                    variant="light"
                                >
                                    {t('product.seasonalProduct')}
                                </Alert>
                            )}
                        </Stack>
                    </Card>

                    {/* Форма добавления на полку */}
                    <Card withBorder p="md" radius="md" shadow="sm">
                        <Stack gap="md">
                            <div>
                                <Text fw={600} size="md" mb="xs">
                                    {t('product.addToShelf')}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {t('product.addToShelfDescription', {
                                        shelfName: shelf.name || t('shelf.shelfNumber', { number: shelf.index_in_freezer }),
                                        freezerName: freezer.name
                                    })}
                                </Text>
                            </div>

                            <Grid>
                                <Grid.Col span={6}>
                                    <NumberInput
                                        label={t('product.quantity')}
                                        placeholder="1"
                                        leftSection={<IconPackage size={16} />}
                                        min={1}
                                        max={999}
                                        {...form.getInputProps('quantity')}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <DateInput
                                        label={t('product.expiryDate')}
                                        placeholder={t('product.expiryDate')}
                                        leftSection={<IconCalendar size={16} />}
                                        minDate={new Date()}
                                        {...form.getInputProps('expiry_date')}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Textarea
                                label={t('product.notes')}
                                placeholder={t('product.notesPlaceholder')}
                                leftSection={<IconNotes size={16} />}
                                minRows={2}
                                maxRows={4}
                                {...form.getInputProps('notes')}
                            />
                        </Stack>
                    </Card>

                    {/* Кнопки действий */}
                    <Group justify="space-between" mt="md">
                        <Button variant="outline" onClick={onBack} size="md">
                            {t('common.back')}
                        </Button>
                        <Button
                            type="submit"
                            leftSection={<IconPlus size={16} />}
                            loading={loading}
                            size="md"
                        >
                            {t('product.addToShelf')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
