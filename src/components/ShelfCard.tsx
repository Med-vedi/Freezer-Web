import { useState } from 'react';
import {
    Card,
    Text,
    Group,
    Badge,
    Stack,
    ThemeIcon,
    ActionIcon,
    Modal,
    Button,
    Grid,
    Chip,
    Alert,
    Skeleton,
} from '@mantine/core';
import {
    IconPackage,
    IconPlus,
    IconEye,
    IconAlertTriangle,
    IconClock,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useDisclosure } from '@mantine/hooks';
import { Shelf, Freezer } from '../types/freezer';
import { Product } from '../types/product';
import { getExpiryStatus, getDaysUntilExpiry } from '../utils/date';
import ProductChip from './ProductChip';
import ProductForm from './ProductForm';

interface ShelfCardProps {
    shelf: Shelf;
    freezer: Freezer;
}

export default function ShelfCard({ shelf, freezer }: ShelfCardProps) {
    const { t } = useTranslation();
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
        openModal();
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        openForm();
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        openForm();
    };

    const getExpiryColor = (status: string) => {
        switch (status) {
            case 'good': return 'green';
            case 'warning': return 'yellow';
            case 'danger': return 'red';
            default: return 'gray';
        }
    };

    return (
        <>
            <Card
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={openModal}
            >
                <Stack gap="sm">
                    <Group justify="space-between">
                        <Group gap="xs">
                            <ThemeIcon color="blue" variant="light">
                                <IconPackage size={16} />
                            </ThemeIcon>
                            <Text fw={500}>
                                {shelf.name || t('shelf.shelfNumber', { number: shelf.index_in_freezer })}
                            </Text>
                        </Group>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal();
                            }}
                        >
                            <IconEye size={16} />
                        </ActionIcon>
                    </Group>

                    <Group justify="space-between">
                        <Badge color="blue" variant="light">
                            {t('shelf.shelfStats.totalProducts', { count: totalProducts })}
                        </Badge>
                        <Text size="sm" c="dimmed">
                            {t('shelf.shelfStats.totalQuantity', { count: totalQuantity })}
                        </Text>
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

                    {totalProducts === 0 && (
                        <Text size="sm" c="dimmed" ta="center" py="sm">
                            {t('shelf.emptyShelf')}
                        </Text>
                    )}
                </Stack>
            </Card>

            <Modal
                opened={modalOpened}
                onClose={closeModal}
                title={
                    <Text fw={500}>
                        {shelf.name || t('shelf.shelfNumber', { number: shelf.index_in_freezer })}
                    </Text>
                }
                size="lg"
            >
                <Stack gap="md">
                    <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                            {t('shelf.shelfStats.totalProducts', { count: totalProducts })}
                        </Text>
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={handleAddProduct}
                            size="sm"
                        >
                            {t('shelf.addProduct')}
                        </Button>
                    </Group>

                    {totalProducts === 0 ? (
                        <Text ta="center" c="dimmed" py="xl">
                            {t('shelf.emptyShelf')}
                        </Text>
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
            </Modal>

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
