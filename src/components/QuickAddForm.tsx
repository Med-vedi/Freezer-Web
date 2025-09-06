import { useState } from 'react';
import { useForm } from '@mantine/form';
import {
    Modal,
    NumberInput,
    Select,
    Textarea,
    Button,
    Stack,
    Title,
    Group,
    Text,
    Alert,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
    IconCalendar,
    IconPackage,
    IconTag,
    IconNotes,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { supabase } from '../supabase/supabaseClient';
import { LocalizedProductCatalog, CreateProductData } from '../types/product';
import { Shelf, Freezer } from '../types/freezer';

interface QuickAddFormProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
    catalogItem: LocalizedProductCatalog | null;
    shelf: Shelf | null;
    freezer: Freezer | null;
}

export default function QuickAddForm({
    opened,
    onClose,
    onSuccess,
    catalogItem,
    shelf,
    freezer
}: QuickAddFormProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            quantity: 1,
            unit: 'pcs',
            expiry_date: null as Date | null,
            notes: '',
        },
        validate: {
            quantity: (value) => (value < 1 ? t('product.validation.quantityMin') : null),
        },
    });

    // Устанавливаем значения по умолчанию при открытии
    useState(() => {
        if (opened && catalogItem) {
            form.setValues({
                quantity: 1,
                unit: catalogItem.default_unit || 'pcs',
                expiry_date: null,
                notes: '',
            });
        }
    });

    const handleSubmit = async (values: typeof form.values) => {
        if (!catalogItem || !shelf || !freezer) return;

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const productData: CreateProductData = {
                catalog_id: catalogItem.id,
                name: catalogItem.name,
                quantity: values.quantity,
                unit: values.unit,
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

    if (!catalogItem || !shelf || !freezer) return null;

    const unitOptions = [
        { value: 'pcs', label: t('product.units.pcs') },
        { value: 'kg', label: t('product.units.kg') },
        { value: 'g', label: t('product.units.g') },
        { value: 'l', label: t('product.units.l') },
        { value: 'ml', label: t('product.units.ml') },
        { value: 'pack', label: t('product.units.pack') },
        { value: 'box', label: t('product.units.box') },
    ];

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Title order={3}>{t('product.quickAdd')}</Title>}
            size="md"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    {/* Информация о продукте */}
                    <Alert color="blue" variant="light">
                        <Group gap="xs">
                            <Text size="xl">{catalogItem.emoji}</Text>
                            <div>
                                <Text fw={500}>{catalogItem.name}</Text>
                                <Text size="sm" c="dimmed">
                                    {t('product.addingToShelf', {
                                        shelfName: shelf.name || t('shelf.shelfNumber', { number: shelf.index_in_freezer })
                                    })}
                                </Text>
                            </div>
                        </Group>
                    </Alert>

                    {/* Форма */}
                    <Stack gap="sm">
                        <NumberInput
                            label={t('product.quantity')}
                            placeholder={t('product.quantity')}
                            leftSection={<IconPackage size={16} />}
                            min={1}
                            max={999}
                            {...form.getInputProps('quantity')}
                        />

                        <Select
                            label={t('product.unit')}
                            placeholder={t('product.unit')}
                            leftSection={<IconTag size={16} />}
                            data={unitOptions}
                            {...form.getInputProps('unit')}
                        />

                        <DateInput
                            label={t('product.expiryDate')}
                            placeholder={t('product.expiryDate')}
                            leftSection={<IconCalendar size={16} />}
                            minDate={new Date()}
                            {...form.getInputProps('expiry_date')}
                        />

                        <Textarea
                            label={t('product.notes')}
                            placeholder={t('product.notesPlaceholder')}
                            leftSection={<IconNotes size={16} />}
                            minRows={2}
                            maxRows={4}
                            {...form.getInputProps('notes')}
                        />
                    </Stack>

                    {/* Кнопки */}
                    <Group justify="flex-end" gap="sm">
                        <Button variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" loading={loading}>
                            {t('product.addToShelf')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
