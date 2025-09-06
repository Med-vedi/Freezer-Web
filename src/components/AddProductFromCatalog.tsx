import { useState } from 'react';
import { useForm } from '@mantine/form';
import {
    Modal,
    NumberInput,
    Select,
    Textarea,
    Button,
    Stack,
    Group,
    Text,
    Alert,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { LocalizedProductCatalog } from '../types/product';

interface AddProductFromCatalogProps {
    opened: boolean;
    onClose: () => void;
    catalogProduct: LocalizedProductCatalog | null;
}

export default function AddProductFromCatalog({ opened, onClose, catalogProduct }: AddProductFromCatalogProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            quantity: 1,
            unit: 'pcs',
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +1 месяц
            notes: '',
        },
        validate: {
            quantity: (value) => (value < 1 ? t('product.validation.quantityMin') : null),
        },
    });

    const handleSubmit = async (_values: typeof form.values) => {
        if (!catalogProduct) return;

        setLoading(true);
        try {
            // Показываем сообщение о том, что нужно выбрать полку и камеру
            notifications.show({
                title: t('catalog.addToShelf'),
                message: t('product.selectShelfAndFreezer'),
                color: 'blue',
            });

            onClose();
        } catch (error: unknown) {
            notifications.show({
                title: t('common.error'),
                message: error instanceof Error ? error.message : 'Unknown error',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!catalogProduct) return null;

    const getLocalizedName = (product: LocalizedProductCatalog) => {
        const lang = t('common.language', { defaultValue: 'it' });
        switch (lang) {
            case 'ru': return product.name_ru || product.name_en;
            case 'en': return product.name_en;
            case 'it': return product.name_it || product.name_en;
            default: return product.name_en;
        }
    };

    const getLocalizedCategory = (product: LocalizedProductCatalog) => {
        const lang = t('common.language', { defaultValue: 'it' });
        switch (lang) {
            case 'ru': return product.category_ru || product.category_en;
            case 'en': return product.category_en;
            case 'it': return product.category_it || product.category_en;
            default: return product.category_en;
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('catalog.addToShelf')}
            size="md"
            centered
        >
            <Stack gap="md">
                {/* Информация о продукте */}
                <Alert color="blue" variant="light">
                    <Text fw={500}>
                        {catalogProduct.emoji} {getLocalizedName(catalogProduct)}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {t('catalog.category')}: {getLocalizedCategory(catalogProduct)}
                    </Text>
                </Alert>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <Group grow>
                            <NumberInput
                                label={t('product.quantity')}
                                placeholder="1"
                                min={1}
                                {...form.getInputProps('quantity')}
                            />
                            <Select
                                label={t('product.unit')}
                                data={[
                                    { value: 'pcs', label: t('product.units.pcs') },
                                    { value: 'kg', label: t('product.units.kg') },
                                    { value: 'g', label: t('product.units.g') },
                                    { value: 'l', label: t('product.units.l') },
                                    { value: 'ml', label: t('product.units.ml') },
                                    { value: 'pack', label: t('product.units.pack') },
                                    { value: 'box', label: t('product.units.box') },
                                ]}
                                {...form.getInputProps('unit')}
                            />
                        </Group>

                        <DateInput
                            label={t('product.expiryDate')}
                            placeholder={t('product.expiryDatePlaceholder')}
                            {...form.getInputProps('expiry_date')}
                        />

                        <Textarea
                            label={t('product.notes')}
                            placeholder={t('product.notesPlaceholder')}
                            {...form.getInputProps('notes')}
                        />

                        <Group justify="flex-end" gap="sm">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                loading={loading}
                            >
                                {t('catalog.addToShelf')}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Modal>
    );
}
