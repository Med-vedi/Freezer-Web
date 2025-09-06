import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import {
    Modal,
    TextInput,
    NumberInput,
    Select,
    Textarea,
    Button,
    Stack,
    Title,
    Tabs,
    Grid,
    Card,
    Text,
    Group,
    Badge,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
    IconSearch,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { supabase } from '../supabase/supabaseClient';
import { Product, LocalizedProductCatalog, CreateProductData } from '../types/product';
import { Shelf, Freezer } from '../types/freezer';
import { useCatalogStore } from '../store/catalogStore';

interface ProductFormProps {
    opened: boolean;
    onClose: () => void;
    shelf: Shelf;
    freezer: Freezer;
    product?: Product | null;
}

export default function ProductForm({ opened, onClose, shelf, freezer, product }: ProductFormProps) {
    const { t } = useTranslation();
    const { searchCatalog, popularProducts, categories, initialize } = useCatalogStore();
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCatalogItem, setSelectedCatalogItem] = useState<LocalizedProductCatalog | null>(null);
    const [activeTab, setActiveTab] = useState<string | null>('catalog');
    const [searchResults, setSearchResults] = useState<LocalizedProductCatalog[]>([]);

    const isEditing = !!product;

    const form = useForm({
        initialValues: {
            name: '',
            quantity: 1,
            unit: 'pcs',
            category: '',
            expiry_date: null as Date | null,
            notes: '',
            barcode: '',
        },
        validate: {
            name: (value) => (value.trim().length < 1 ? 'Name is required' : null),
            quantity: (value) => (value < 1 ? 'Quantity must be at least 1' : null),
        },
    });

    useEffect(() => {
        if (opened) {
            if (isEditing && product) {
                form.setValues({
                    name: product.name,
                    quantity: product.quantity,
                    unit: product.unit,
                    category: product.catalog?.category_en || product.catalog?.category_ru || product.catalog?.category_it || '',
                    expiry_date: product.expiry_date ? new Date(product.expiry_date) : null,
                    notes: product.notes || '',
                    barcode: product.barcode || '',
                });
            } else {
                form.reset();
            }
            loadInitialData();
        }
    }, [opened, isEditing, product]);

    const loadInitialData = async () => {
        const language = t('common.language', { defaultValue: 'it' });
        await initialize(language);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = await searchCatalog(query, t('common.language', { defaultValue: 'it' }));
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleCatalogItemSelect = (item: LocalizedProductCatalog) => {
        setSelectedCatalogItem(item);
        form.setValues({
            name: item.name,
            unit: item.default_unit || 'pcs',
            category: item.category || '',
        });
    };

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const productData: CreateProductData = {
                name: values.name,
                quantity: values.quantity,
                unit: values.unit,
                shelf_id: shelf.id,
                freezer_id: freezer.id,
                barcode: values.barcode || undefined,
                expiry_date: values.expiry_date ? values.expiry_date.toISOString().split('T')[0] : undefined,
                notes: values.notes || undefined,
                catalog_id: selectedCatalogItem?.id,
            };

            if (isEditing && product) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', product.id);

                if (error) throw error;

                notifications.show({
                    title: t('notifications.productUpdated'),
                    message: '',
                    color: 'green',
                });
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert({
                        ...productData,
                        user_id: user.id,
                    });

                if (error) throw error;

                notifications.show({
                    title: t('notifications.productAdded'),
                    message: '',
                    color: 'green',
                });
            }

            onClose();
        } catch (error: any) {
            notifications.show({
                title: t('common.error'),
                message: error.message,
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
                <Title order={3}>
                    {isEditing ? t('product.editProduct') : t('product.addProduct')}
                </Title>
            }
            size="lg"
        >
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="catalog">{t('product.selectFromCatalog')}</Tabs.Tab>
                    <Tabs.Tab value="create">{t('product.createNew')}</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="catalog" pt="md">
                    <Stack gap="md">
                        <TextInput
                            placeholder={t('product.searchCatalog')}
                            leftSection={<IconSearch size={16} />}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.currentTarget.value)}
                        />

                        <Select
                            label={t('product.categoryFilter')}
                            placeholder={t('product.allCategories')}
                            data={[
                                { value: '', label: t('product.allCategories') },
                                ...categories.map(cat => ({ value: cat, label: cat })),
                            ]}
                            onChange={(value) => {
                                if (value) {
                                    setSearchQuery(value);
                                } else {
                                    setSearchQuery('');
                                }
                            }}
                        />

                        <Grid>
                            {(searchQuery ? searchResults : popularProducts).map((item) => (
                                <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4 }}>
                                    <Card
                                        shadow="sm"
                                        padding="sm"
                                        radius="md"
                                        withBorder
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleCatalogItemSelect(item)}
                                    >
                                        <Stack gap="xs">
                                            <Group justify="space-between">
                                                <Text fw={500} size="sm">
                                                    {item.name}
                                                </Text>
                                                {item.emoji && <Text size="sm">{item.emoji}</Text>}
                                            </Group>
                                            {item.category && (
                                                <Badge size="sm" variant="light">
                                                    {item.category}
                                                </Badge>
                                            )}
                                            {item.description && (
                                                <Text size="xs" c="dimmed" lineClamp={2}>
                                                    {item.description}
                                                </Text>
                                            )}
                                            {item.is_popular && (
                                                <Badge size="xs" color="blue" variant="light">
                                                    Popular
                                                </Badge>
                                            )}
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            ))}
                        </Grid>

                        {(searchQuery ? searchResults : popularProducts).length === 0 && (
                            <Text ta="center" c="dimmed" py="xl">
                                {searchQuery ? t('product.noProductsFound') : t('product.noProducts')}
                            </Text>
                        )}
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="create" pt="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="md">
                            <TextInput
                                label={t('product.productName')}
                                placeholder={t('product.productName')}
                                required
                                {...form.getInputProps('name')}
                            />

                            <Group grow>
                                <NumberInput
                                    label={t('product.productQuantity')}
                                    placeholder="1"
                                    min={1}
                                    required
                                    {...form.getInputProps('quantity')}
                                />
                                <Select
                                    label={t('product.productUnit')}
                                    placeholder="pcs"
                                    data={[
                                        { value: 'pcs', label: 'pcs' },
                                        { value: 'kg', label: 'kg' },
                                        { value: 'g', label: 'g' },
                                        { value: 'l', label: 'l' },
                                        { value: 'ml', label: 'ml' },
                                        { value: 'pack', label: 'pack' },
                                        { value: 'box', label: 'box' },
                                    ]}
                                    {...form.getInputProps('unit')}
                                />
                            </Group>

                            <Group grow>
                                <TextInput
                                    label={t('product.productCategory')}
                                    placeholder={t('product.productCategory')}
                                    {...form.getInputProps('category')}
                                />
                                <TextInput
                                    label={t('product.productBarcode')}
                                    placeholder="Optional"
                                    {...form.getInputProps('barcode')}
                                />
                            </Group>

                            <DateInput
                                label={t('product.productExpiryDate')}
                                placeholder="Select date"
                                {...form.getInputProps('expiry_date')}
                            />

                            <Textarea
                                label={t('product.productNotes')}
                                placeholder="Optional notes"
                                rows={3}
                                {...form.getInputProps('notes')}
                            />

                            <Group justify="flex-end" gap="sm">
                                <Button variant="subtle" onClick={onClose}>
                                    {t('common.cancel')}
                                </Button>
                                <Button type="submit" loading={loading}>
                                    {isEditing ? t('common.save') : t('common.add')}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
}
