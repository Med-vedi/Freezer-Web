import { useEffect, useState } from 'react';
import {
    Container,
    Title,
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
    Alert,
    Skeleton,
    Center,
    Button,
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
    IconPlus,
    IconListDetails,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/supabaseClient';
import { ProductWithExpiry } from '../types/product';
import { getExpiryStatus, getDaysUntilExpiry, getExpiryText } from '../utils/date';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { notifications } from '@mantine/notifications';
import Navbar from '../components/Navbar';
import InitialProductsSetup from '../components/InitialProductsSetup';

export default function ProductsList() {
    const { t } = useTranslation();
    const { initialize: initializeCatalog, categories } = useCatalogStore();
    const { user } = useAuthStore();
    const [products, setProducts] = useState<ProductWithExpiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>('');
    const [expiryFilter, setExpiryFilter] = useState<string | null>('');
    const [activeTab, setActiveTab] = useState<string | null>('all');
    const [initialProductsModalOpened, setInitialProductsModalOpened] = useState(false);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductWithExpiry | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (user) {
            // Инициализируем каталог при загрузке
            initializeCatalog();
            fetchProducts();
        }
    }, [user, initializeCatalog]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        if (!user) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        try {
            console.log('Fetching products for user:', user.id);

            // Используем оптимизированный запрос через RPC функцию
            const { data, error } = await supabase.rpc('get_user_products_localized', {
                user_id_input: user.id,
                language_code: t('common.language', { defaultValue: 'it' })
            });

            console.log('Products query result:', { data, error });

            if (error) throw error;

            const productsWithExpiry = data.map((product: any) => ({
                ...product,
                // Маппим данные из RPC функции в ожидаемую структуру
                catalog: {
                    id: product.catalog_id,
                    name_en: product.catalog_name_en,
                    name_ru: product.catalog_name_ru,
                    name_it: product.catalog_name_it,
                    category_en: product.catalog_category_en,
                    category_ru: product.catalog_category_ru,
                    category_it: product.catalog_category_it,
                    description_en: product.catalog_description_en,
                    description_ru: product.catalog_description_ru,
                    description_it: product.catalog_description_it,
                    emoji: product.catalog_emoji,
                    is_popular: product.catalog_is_popular,
                    is_seasonal: product.catalog_is_seasonal,
                    default_unit: product.catalog_default_unit,
                },
                shelf: {
                    id: product.shelf_id,
                    name: product.shelf_name,
                    index_in_freezer: product.shelf_index,
                },
                freezer: {
                    id: product.freezer_id,
                    name: product.freezer_name,
                },
                expiryStatus: getExpiryStatus(product.expiry_date),
                daysUntilExpiry: getDaysUntilExpiry(product.expiry_date),
            }));

            console.log('Processed products:', productsWithExpiry);
            setProducts(productsWithExpiry || []);
        } catch (error: any) {
            console.error('Error fetching products:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = (product: ProductWithExpiry) => {
        setProductToDelete(product);
        setDeleteModalOpened(true);
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;

        setDeleting(true);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productToDelete.id);

            if (error) throw error;

            notifications.show({
                title: t('common.success'),
                message: t('productsList.productDeleted'),
                color: 'green',
            });

            // Обновляем список продуктов
            await fetchProducts();
            setDeleteModalOpened(false);
            setProductToDelete(null);
        } catch (error: any) {
            console.error('Error deleting product:', error);
            notifications.show({
                title: t('common.error'),
                message: t('productsList.deleteError') + ': ' + error.message,
                color: 'red',
            });
        } finally {
            setDeleting(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.shelf && product.shelf.name && product.shelf.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.freezer && product.freezer.name && product.freezer.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = !categoryFilter ||
            product.catalog?.category_it === categoryFilter ||
            product.catalog?.category_ru === categoryFilter ||
            product.catalog?.category_en === categoryFilter;

        const matchesExpiry = !expiryFilter || product.expiryStatus === expiryFilter;

        // Фильтр по вкладкам
        let matchesTab = true;
        if (activeTab === 'expiring') {
            matchesTab = product.expiryStatus === 'warning';
        } else if (activeTab === 'expired') {
            matchesTab = product.expiryStatus === 'danger';
        } else if (activeTab === 'good') {
            matchesTab = product.expiryStatus === 'good';
        }

        return matchesSearch && matchesCategory && matchesExpiry && matchesTab;
    });


    const getExpiryColor = (status: string) => {
        switch (status) {
            case 'good': return 'green';
            case 'warning': return 'yellow';
            case 'danger': return 'red';
            default: return 'gray';
        }
    };

    const getExpiryCount = (status: string) => {
        return products.filter(p => p.expiryStatus === status).length;
    };


    if (loading) {
        return (
            <Navbar>
                <Container size="md" py="xl">
                    <Title order={2} mb="lg">{t('productsList.title')}</Title>
                    <Stack>
                        <Group>
                            <Skeleton height={36} radius="sm" style={{ flex: 1 }} />
                            <Skeleton height={36} radius="sm" width={150} />
                            <Skeleton height={36} radius="sm" width={150} />
                        </Group>
                        <Grid>
                            {Array(6).fill(0).map((_, index) => (
                                <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={index}>
                                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                                        <Skeleton height={20} width="70%" mb="xs" />
                                        <Skeleton height={10} width="90%" mb="xs" />
                                        <Skeleton height={10} width="50%" />
                                    </Card>
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Stack>
                </Container>
            </Navbar>
        );
    }

    if (error) {
        return (
            <Navbar>
                <Container size="md" py="xl">
                    <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                        {error}
                    </Alert>
                </Container>
            </Navbar>
        );
    }

    return (
        <Navbar>
            <Container size="md" py="xl">
                <Title order={2} mb="lg">{t('productsList.title')}</Title>

                {/* Статистика */}
                <Group mb="lg" gap="md">
                    <Badge size="lg" color="blue" variant="light">
                        {t('productsList.totalProducts', { count: products.length })}
                    </Badge>
                    <Badge size="lg" color="green" variant="light">
                        {t('productsList.goodProducts', { count: getExpiryCount('good') })}
                    </Badge>
                    <Badge size="lg" color="yellow" variant="light">
                        {t('productsList.expiringSoon', { count: getExpiryCount('warning') })}
                    </Badge>
                    <Badge size="lg" color="red" variant="light">
                        {t('productsList.expired', { count: getExpiryCount('danger') })}
                    </Badge>
                </Group>

                {/* Информация о том, что показываются все продукты */}
                {activeTab === 'all' && (
                    <Text size="sm" c="dimmed" mb="md">
                        {t('productsList.showingAllProducts')}
                    </Text>
                )}

                {/* Фильтры */}
                <Stack mb="lg">
                    <Group grow>
                        <TextInput
                            placeholder={t('productsList.searchPlaceholder')}
                            leftSection={<IconSearch size={16} />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.currentTarget.value)}
                            style={{ flex: 1 }}
                        />
                        <Select
                            placeholder={t('product.categoryFilter')}
                            data={[
                                { value: '', label: t('product.allCategories') },
                                ...(categories || []).map(cat => ({ value: cat, label: cat })),
                            ]}
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            leftSection={<IconFilter size={16} />}
                        />
                        <Select
                            placeholder="Filter by expiry"
                            data={[
                                { value: '', label: 'All' },
                                { value: 'good', label: 'Good' },
                                { value: 'warning', label: 'Expiring Soon' },
                                { value: 'danger', label: 'Expired' },
                            ]}
                            value={expiryFilter}
                            onChange={setExpiryFilter}
                        />
                    </Group>

                    {/* Вкладки для быстрой фильтрации */}
                    <Tabs value={activeTab} onChange={setActiveTab}>
                        <Tabs.List>
                            <Tabs.Tab value="all" leftSection={<IconListDetails size={16} />}>
                                {t('productsList.allProducts')} ({products.length})
                            </Tabs.Tab>
                            <Tabs.Tab value="expiring" leftSection={<IconAlertCircle size={16} />}>
                                {t('productsList.expiringSoon')} ({getExpiryCount('warning')})
                            </Tabs.Tab>
                            <Tabs.Tab value="expired" leftSection={<IconAlertCircle size={16} />}>
                                {t('productsList.expired')} ({getExpiryCount('danger')})
                            </Tabs.Tab>
                            <Tabs.Tab value="good" leftSection={<IconPlus size={16} />}>
                                {t('productsList.goodProducts')} ({getExpiryCount('good')})
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                </Stack>

                {/* Список продуктов */}
                {filteredProducts.length === 0 ? (
                    <Center style={{ height: 200 }}>
                        <Stack align="center" gap="md">
                            {searchQuery || categoryFilter || expiryFilter || activeTab !== 'all' ? (
                                <Text size="lg" c="dimmed">
                                    {t('productsList.noProductsFound')}
                                </Text>
                            ) : products.length === 0 ? (
                                <>
                                    <Text size="lg" c="dimmed">
                                        {t('productsList.noProducts')}
                                    </Text>
                                    <Group>
                                        <Button
                                            leftSection={<IconPlus size={16} />}
                                            onClick={() => setInitialProductsModalOpened(true)}
                                            variant="filled"
                                        >
                                            {t('initialProducts.openModal')}
                                        </Button>
                                        <Button
                                            leftSection={<IconPlus size={16} />}
                                            component="a"
                                            href="/dashboard"
                                            variant="outline"
                                        >
                                            {t('productsList.addFirstProduct')}
                                        </Button>
                                    </Group>
                                </>
                            ) : (
                                <>
                                    <Text size="lg" c="dimmed">
                                        {t('productsList.noProducts')}
                                    </Text>
                                    <Button leftSection={<IconPlus size={16} />} component="a" href="/dashboard">
                                        {t('productsList.addFirstProduct')}
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Center>
                ) : (
                    <Grid>
                        {filteredProducts.map((product) => (
                            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={product.id}>
                                <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Group justify="space-between" mb="xs">
                                        <Text fw={500}>{product.name}</Text>
                                        <Badge color={getExpiryColor(product.expiryStatus)}>
                                            {getExpiryText(product.expiry_date)}
                                        </Badge>
                                    </Group>
                                    <Text size="sm" c="dimmed">
                                        {t('product.quantity')}: {product.quantity} {product.unit}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {t('product.category')}: {product.catalog?.category_it || product.catalog?.category_ru || product.catalog?.category_en || t('product.noCategory')}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {t('product.location')}: {product.freezer?.name} → {product.shelf?.name || `Shelf ${product.shelf?.index_in_freezer}`}
                                    </Text>
                                    <Group justify="flex-end" mt="md">
                                        <Menu shadow="md" width={200}>
                                            <Menu.Target>
                                                <ActionIcon variant="subtle" color="gray">
                                                    <IconDots size={16} />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item leftSection={<IconEdit size={14} />}>
                                                    {t('common.edit')}
                                                </Menu.Item>
                                                <Menu.Item
                                                    leftSection={<IconTrash size={14} />}
                                                    color="red"
                                                    onClick={() => handleDeleteProduct(product)}
                                                >
                                                    {t('common.delete')}
                                                </Menu.Item>
                                                <Menu.Item leftSection={<IconArrowRight size={14} />}>
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
                    title={t('productsList.confirmDelete')}
                    centered
                >
                    <Stack gap="md">
                        <Text>
                            {t('productsList.deleteConfirmMessage', {
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

                {/* Модальное окно для создания начальных продуктов */}
                <InitialProductsSetup
                    opened={initialProductsModalOpened}
                    onClose={() => setInitialProductsModalOpened(false)}
                    onProductsCreated={fetchProducts}
                />
            </Container>
        </Navbar>
    );
}