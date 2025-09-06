import { useState, useMemo } from 'react';
import {
    TextInput,
    Select,
    Grid,
    Card,
    Text,
    Group,
    Badge,
    Stack,
    ActionIcon,
    Menu,
    Center,
    Button,
    ThemeIcon,
    Alert,
    Tabs,
    Modal,
} from '@mantine/core';
import {
    IconSearch,
    IconFilter,
    IconDots,
    IconEdit,
    IconTrash,
    IconArrowRight,
    IconAlertCircle,
    IconClock,
    IconCheck,
    IconPackage,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ProductWithExpiry } from '../types/product';
import { getExpiryText } from '../utils/date';
import { useAuthStore } from '../store/authStore';
import { useProducts } from '../hooks/useProducts';
import { LoadingState, LoadingFilters } from './LoadingState';
import { ErrorBoundary } from './ErrorBoundary';
import { notifications } from '@mantine/notifications';

interface MyProductsProps {
    onProductEdit?: (product: ProductWithExpiry) => void;
    onProductMove?: (product: ProductWithExpiry) => void;
}

export default function MyProducts({ onProductEdit, onProductMove }: MyProductsProps) {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>('');
    const [expiryFilter, setExpiryFilter] = useState<string | null>('');
    const [activeTab, setActiveTab] = useState<string | null>('all');
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductWithExpiry | null>(null);
    const [deleting, setDeleting] = useState(false);

    const {
        products,
        loading,
        error,
        deleteProduct,
    } = useProducts({
        userId: user?.id || '',
        language: t('common.language', { defaultValue: 'it' }),
        addedByUserOnly: true,
    });

    const handleDeleteProduct = (product: ProductWithExpiry) => {
        setProductToDelete(product);
        setDeleteModalOpened(true);
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;

        setDeleting(true);
        try {
            await deleteProduct(productToDelete.id);

            notifications.show({
                title: t('common.success'),
                message: t('myProducts.productDeleted'),
                color: 'green',
            });

            setDeleteModalOpened(false);
            setProductToDelete(null);
        } catch (error: unknown) {
            notifications.show({
                title: t('common.error'),
                message: error instanceof Error ? error.message : 'Unknown error',
                color: 'red',
            });
        } finally {
            setDeleting(false);
        }
    };

    const getExpiryColor = (status: string) => {
        switch (status) {
            case 'good': return 'green';
            case 'warning': return 'yellow';
            case 'danger': return 'red';
            default: return 'gray';
        }
    };

    const getExpiryCount = useMemo(() => {
        return (status: string) => products.filter(p => p.expiryStatus === status).length;
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const name = product.name.toLowerCase();
            const category = product.catalog?.category_it || product.catalog?.category_ru || product.catalog?.category_en || '';
            const search = searchQuery.toLowerCase();

            const matchesSearch = name.includes(search) ||
                category.toLowerCase().includes(search);

            const matchesCategory = !categoryFilter ||
                category.toLowerCase() === categoryFilter.toLowerCase();

            const matchesExpiry = !expiryFilter || product.expiryStatus === expiryFilter;

            const matchesTab = activeTab === 'all' || product.expiryStatus === activeTab;

            return matchesSearch && matchesCategory && matchesExpiry && matchesTab;
        });
    }, [products, searchQuery, categoryFilter, expiryFilter, activeTab]);

    const categories = useMemo(() => {
        return Array.from(new Set(products.map(p =>
            p.catalog?.category_it || p.catalog?.category_ru || p.catalog?.category_en || ''
        ).filter(Boolean))).map(cat => ({ value: cat.toLowerCase(), label: cat }));
    }, [products]);

    if (loading) {
        return (
            <Stack gap="md">
                <LoadingFilters />
                <LoadingState count={6} />
            </Stack>
        );
    }

    if (error) {
        return (
            <ErrorBoundary>
                <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                    {error.message}
                </Alert>
            </ErrorBoundary>
        );
    }

    return (
        <Stack gap="md">
            {/* Статистика */}
            <Group gap="md">
                <Badge size="lg" color="blue" variant="light">
                    {t('myProducts.totalProducts', { count: products.length })}
                </Badge>
                <Badge size="lg" color="green" variant="light">
                    {t('myProducts.goodProducts', { count: getExpiryCount('good') })}
                </Badge>
                <Badge size="lg" color="yellow" variant="light">
                    {t('myProducts.expiringSoon', { count: getExpiryCount('warning') })}
                </Badge>
                <Badge size="lg" color="red" variant="light">
                    {t('myProducts.expired', { count: getExpiryCount('danger') })}
                </Badge>
            </Group>

            {/* Фильтры */}
            <Group grow>
                <TextInput
                    placeholder={t('myProducts.searchPlaceholder')}
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    style={{ flex: 1 }}
                />
                <Select
                    placeholder={t('myProducts.categoryFilter')}
                    data={[
                        { value: '', label: t('myProducts.allCategories') },
                        ...categories,
                    ]}
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    leftSection={<IconFilter size={16} />}
                />
                <Select
                    placeholder={t('myProducts.expiryFilter')}
                    data={[
                        { value: '', label: t('myProducts.allExpiry') },
                        { value: 'good', label: t('myProducts.good') },
                        { value: 'warning', label: t('myProducts.expiringSoon') },
                        { value: 'danger', label: t('myProducts.expired') },
                    ]}
                    value={expiryFilter}
                    onChange={setExpiryFilter}
                />
            </Group>

            {/* Вкладки для быстрой фильтрации */}
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="all" leftSection={<IconPackage size={16} />}>
                        {t('myProducts.allProducts')} ({products.length})
                    </Tabs.Tab>
                    <Tabs.Tab value="warning" leftSection={<IconClock size={16} />}>
                        {t('myProducts.expiringSoon')} ({getExpiryCount('warning')})
                    </Tabs.Tab>
                    <Tabs.Tab value="danger" leftSection={<IconAlertCircle size={16} />}>
                        {t('myProducts.expired')} ({getExpiryCount('danger')})
                    </Tabs.Tab>
                    <Tabs.Tab value="good" leftSection={<IconCheck size={16} />}>
                        {t('myProducts.goodProducts')} ({getExpiryCount('good')})
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {/* Список продуктов */}
            {filteredProducts.length === 0 ? (
                <Center style={{ height: 300 }}>
                    <Stack align="center" gap="md">
                        <ThemeIcon size={80} radius="xl" variant="light" color="gray">
                            <IconPackage size={40} />
                        </ThemeIcon>
                        <Text size="lg" c="dimmed">
                            {searchQuery || categoryFilter || expiryFilter || activeTab !== 'all' ?
                                t('myProducts.noProductsFound') :
                                t('myProducts.noProducts')
                            }
                        </Text>
                        {searchQuery || categoryFilter || expiryFilter || activeTab !== 'all' ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setCategoryFilter('');
                                    setExpiryFilter('');
                                    setActiveTab('all');
                                }}
                            >
                                {t('myProducts.clearFilters')}
                            </Button>
                        ) : (
                            <Text size="sm" c="dimmed" ta="center">
                                {t('myProducts.addProductsFromCatalog')}
                            </Text>
                        )}
                    </Stack>
                </Center>
            ) : (
                <Grid>
                    {filteredProducts.map((product) => (
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={product.id}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Group justify="space-between" mb="xs">
                                    <Text fw={500} size="lg">
                                        {product.catalog?.emoji} {product.name}
                                    </Text>
                                    <Badge color={getExpiryColor(product.expiryStatus)}>
                                        {getExpiryText(product.expiry_date)}
                                    </Badge>
                                </Group>

                                <Text size="sm" c="dimmed" mb="xs">
                                    {t('myProducts.quantity')}: {product.quantity} {product.unit}
                                </Text>

                                <Text size="sm" c="dimmed" mb="xs">
                                    {t('myProducts.category')}: {product.catalog?.category_it || product.catalog?.category_ru || product.catalog?.category_en || t('myProducts.noCategory')}
                                </Text>

                                <Text size="sm" c="dimmed" mb="md">
                                    {t('myProducts.location')}: {product.freezer?.name || t('myProducts.unknownFreezer')} → {product.shelf?.name || t('shelf.shelfNumber', { number: product.shelf?.index_in_freezer || '?' })}
                                </Text>

                                <Group justify="flex-end" mt="md">
                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <ActionIcon variant="subtle" color="gray">
                                                <IconDots size={16} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                leftSection={<IconEdit size={14} />}
                                                onClick={() => onProductEdit?.(product)}
                                            >
                                                {t('common.edit')}
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<IconTrash size={14} />}
                                                color="red"
                                                onClick={() => handleDeleteProduct(product)}
                                            >
                                                {t('common.delete')}
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<IconArrowRight size={14} />}
                                                onClick={() => onProductMove?.(product)}
                                            >
                                                {t('common.move')}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}

            {/* Модальное окно подтверждения удаления */}
            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title={t('myProducts.confirmDelete')}
                centered
            >
                <Stack gap="md">
                    <Text>
                        {t('myProducts.deleteConfirmMessage', {
                            name: productToDelete?.name || ''
                        })}
                    </Text>
                    <Group justify="flex-end" gap="sm">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModalOpened(false)}
                            disabled={deleting}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            color="red"
                            onClick={confirmDeleteProduct}
                            loading={deleting}
                        >
                            {t('common.delete')}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    );
}