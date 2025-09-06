import { useState } from 'react';
import {
    Alert,
    Button,
    Group,
    Stack,
    Text,
    Title,
    List,
    ThemeIcon,
    LoadingOverlay,
    Modal,
    SegmentedControl,
    Card,
    Badge,
} from '@mantine/core';
import {
    IconInfoCircle,
    IconCheck,
    IconPlus,
    IconPackage,
    IconStar,
    IconDatabase,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/supabaseClient';
import { notifications } from '@mantine/notifications';

interface InitialProductsSetupProps {
    opened: boolean;
    onClose: () => void;
    onProductsCreated: () => void;
}

export default function InitialProductsSetup({ opened, onClose, onProductsCreated }: InitialProductsSetupProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [loadType, setLoadType] = useState<'popular' | 'all'>('popular');

    const handleCreateInitialProducts = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Выбираем функцию в зависимости от типа загрузки
            const rpcFunction = loadType === 'all' ? 'load_all_catalog_products' : 'load_popular_products_only';

            const { data, error } = await supabase.rpc(rpcFunction, {
                user_id_input: user.id
            });

            if (error) throw error;

            if (data.success) {
                notifications.show({
                    title: t('initialProducts.productsCreated'),
                    message: t('initialProducts.productsCreatedMessage', {
                        count: data.products_created,
                        total: data.catalog_products || 'N/A'
                    }),
                    color: 'green',
                });
                onProductsCreated();
                onClose();
            } else {
                throw new Error(data.error || 'Failed to create initial products');
            }
        } catch (error: any) {
            console.error('Error creating initial products:', error);
            notifications.show({
                title: t('initialProducts.error'),
                message: error.message,
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    const sampleProducts = [
        'Milk',
        'Bread',
        'Eggs',
        'Chicken Breast',
        'Apples',
        'Bananas',
        'Cheese',
        'Butter',
        'Rice',
        'Pasta'
    ];

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group>
                    <ThemeIcon color="blue" size="lg" radius="md">
                        <IconPackage size={24} />
                    </ThemeIcon>
                    <div>
                        <Title order={3}>{t('initialProducts.title')}</Title>
                    </div>
                </Group>
            }
            size="md"
            centered
        >
            <LoadingOverlay visible={loading} />
            <Stack gap="md">
                <Text size="sm" c="dimmed">
                    {t('initialProducts.description')}
                </Text>

                <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
                    <Text size="sm">
                        {t('initialProducts.info')}
                    </Text>
                </Alert>

                <div>
                    <Text fw={500} mb="sm">{t('initialProducts.chooseLoadType')}:</Text>
                    <SegmentedControl
                        value={loadType}
                        onChange={(value) => setLoadType(value as 'popular' | 'all')}
                        data={[
                            {
                                value: 'popular',
                                label: (
                                    <Group gap="xs">
                                        <IconStar size={16} />
                                        <Text size="sm">{t('initialProducts.popularOnly')}</Text>
                                    </Group>
                                )
                            },
                            {
                                value: 'all',
                                label: (
                                    <Group gap="xs">
                                        <IconDatabase size={16} />
                                        <Text size="sm">{t('initialProducts.allProducts')}</Text>
                                    </Group>
                                )
                            }
                        ]}
                        fullWidth
                    />
                </div>

                <Card withBorder p="md">
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text fw={500} size="sm">
                                {loadType === 'popular' ? t('initialProducts.popularProducts') : t('initialProducts.allProducts')}
                            </Text>
                            <Badge color={loadType === 'popular' ? 'blue' : 'green'} variant="light">
                                {loadType === 'popular' ? '~30' : '300+'} {t('initialProducts.products')}
                            </Badge>
                        </Group>
                        <Text size="xs" c="dimmed">
                            {loadType === 'popular'
                                ? t('initialProducts.popularDescription')
                                : t('initialProducts.allDescription')
                            }
                        </Text>
                    </Stack>
                </Card>

                <Group justify="space-between" mt="md">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleCreateInitialProducts}
                        loading={loading}
                        size="md"
                        color={loadType === 'all' ? 'green' : 'blue'}
                    >
                        {loadType === 'all'
                            ? t('initialProducts.loadAllProducts')
                            : t('initialProducts.loadPopularProducts')
                        }
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
