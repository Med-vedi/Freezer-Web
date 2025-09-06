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
    Button,
    ThemeIcon,
    Divider,
    Alert,
    Center,
} from '@mantine/core';
import {
    IconSearch,
    IconFilter,
    IconPlus,
    IconPackage,
    IconStar,
    IconLeaf,
    IconAlertCircle,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { LocalizedProductCatalog } from '../types/product';
import { useCatalog } from '../hooks/useCatalog';
import { LoadingState, LoadingFilters } from './LoadingState';
import { ErrorBoundary } from './ErrorBoundary';

interface ProductCatalogProps {
    onProductSelect: (product: LocalizedProductCatalog) => void;
}

export default function ProductCatalog({ onProductSelect }: ProductCatalogProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>('');
    const [sortBy, setSortBy] = useState<string | null>('name');

    const {
        catalog,
        loading,
        error,
    } = useCatalog({
        language: t('common.language', { defaultValue: 'it' }),
    });

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

    const getLocalizedDescription = (product: LocalizedProductCatalog) => {
        const lang = t('common.language', { defaultValue: 'it' });
        switch (lang) {
            case 'ru': return product.description_ru || product.description_en;
            case 'en': return product.description_en;
            case 'it': return product.description_it || product.description_en;
            default: return product.description_en;
        }
    };

    const categories = useMemo(() => {
        return Array.from(new Set(catalog.map(p => getLocalizedCategory(p)))).map(cat => ({
            value: cat.toLowerCase(),
            label: cat
        }));
    }, [catalog]);

    const filteredProducts = useMemo(() => {
        return catalog.filter(product => {
            const name = getLocalizedName(product).toLowerCase();
            const category = getLocalizedCategory(product).toLowerCase();
            const search = searchQuery.toLowerCase();

            const description = getLocalizedDescription(product);
            const matchesSearch = name.includes(search) ||
                category.includes(search) ||
                (description && description.toLowerCase().includes(search));

            const matchesCategory = !categoryFilter || category === categoryFilter.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [catalog, searchQuery, categoryFilter]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return getLocalizedName(a).localeCompare(getLocalizedName(b));
                case 'category':
                    return getLocalizedCategory(a).localeCompare(getLocalizedCategory(b));
                case 'popular':
                    return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0);
                default:
                    return 0;
            }
        });
    }, [filteredProducts, sortBy]);

    const handleAddToShelf = (product: LocalizedProductCatalog) => {
        onProductSelect(product);
    };

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
            {/* Фильтры */}
            <Group grow>
                <TextInput
                    placeholder={t('catalog.searchPlaceholder')}
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    style={{ flex: 1 }}
                />
                <Select
                    placeholder={t('catalog.categoryFilter')}
                    data={[
                        { value: '', label: t('catalog.allCategories') },
                        ...categories,
                    ]}
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    leftSection={<IconFilter size={16} />}
                />
                <Select
                    placeholder={t('catalog.sortBy')}
                    data={[
                        { value: 'name', label: t('catalog.sortByName') },
                        { value: 'category', label: t('catalog.sortByCategory') },
                        { value: 'popular', label: t('catalog.sortByPopular') },
                    ]}
                    value={sortBy}
                    onChange={setSortBy}
                />
            </Group>

            {/* Статистика */}
            <Group gap="md">
                <Badge size="lg" color="blue" variant="light">
                    {t('catalog.totalProducts', { count: catalog.length })}
                </Badge>
                <Badge size="lg" color="green" variant="light">
                    {t('catalog.filteredProducts', { count: filteredProducts.length })}
                </Badge>
            </Group>

            {/* Список продуктов */}
            {sortedProducts.length === 0 ? (
                <Center style={{ height: 300 }}>
                    <Stack align="center" gap="md">
                        <ThemeIcon size={80} radius="xl" variant="light" color="gray">
                            <IconPackage size={40} />
                        </ThemeIcon>
                        <Text size="lg" c="dimmed">
                            {searchQuery || categoryFilter ?
                                t('catalog.noProductsFound') :
                                t('catalog.noProducts')
                            }
                        </Text>
                        {searchQuery || categoryFilter ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setCategoryFilter('');
                                }}
                            >
                                {t('catalog.clearFilters')}
                            </Button>
                        ) : null}
                    </Stack>
                </Center>
            ) : (
                <Grid>
                    {sortedProducts.map((product) => (
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={product.id}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Group justify="space-between" mb="xs">
                                    <Group gap="xs">
                                        <Text fw={500} size="lg">
                                            {product.emoji} {getLocalizedName(product)}
                                        </Text>
                                        {product.is_popular && (
                                            <ThemeIcon size="sm" color="yellow" variant="light">
                                                <IconStar size={12} />
                                            </ThemeIcon>
                                        )}
                                        {product.is_seasonal && (
                                            <ThemeIcon size="sm" color="green" variant="light">
                                                <IconLeaf size={12} />
                                            </ThemeIcon>
                                        )}
                                    </Group>
                                </Group>

                                <Text size="sm" c="dimmed" mb="xs">
                                    {t('catalog.category')}: {getLocalizedCategory(product)}
                                </Text>

                                {getLocalizedDescription(product) && (
                                    <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                                        {getLocalizedDescription(product)}
                                    </Text>
                                )}

                                <Divider mb="md" />

                                <Group justify="space-between" align="center">
                                    <Text size="sm" c="dimmed">
                                        {t('catalog.defaultUnit')}: {product.default_unit}
                                    </Text>
                                    <Button
                                        size="sm"
                                        leftSection={<IconPlus size={14} />}
                                        onClick={() => handleAddToShelf(product)}
                                    >
                                        {t('catalog.addToShelf')}
                                    </Button>
                                </Group>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}
        </Stack>
    );
}