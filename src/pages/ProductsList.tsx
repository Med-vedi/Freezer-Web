import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Tabs,
    Modal,
} from '@mantine/core';
import {
    IconPackage,
    IconListDetails,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { LocalizedProductCatalog, ProductWithExpiry } from '../types/product';
import Navbar from '../components/Navbar';
import ProductCatalog from '../components/ProductCatalog';
import MyProducts from '../components/MyProducts';
import ProductForm from '../components/ProductForm';
import AddProductFromCatalog from '../components/AddProductFromCatalog';

export default function ProductsList() {
    const { t } = useTranslation();
    const { initialize: initializeCatalog } = useCatalogStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<string | null>('catalog');
    const [productFormOpened, setProductFormOpened] = useState(false);
    const [addFromCatalogOpened, setAddFromCatalogOpened] = useState(false);
    const [selectedCatalogProduct, setSelectedCatalogProduct] = useState<LocalizedProductCatalog | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductWithExpiry | null>(null);

    useEffect(() => {
        if (user) {
            initializeCatalog();
        }
    }, [user, initializeCatalog]);

    const handleCatalogProductSelect = (product: LocalizedProductCatalog) => {
        setSelectedCatalogProduct(product);
        setAddFromCatalogOpened(true);
    };

    const handleProductEdit = (product: ProductWithExpiry) => {
        setSelectedProduct(product);
        setProductFormOpened(true);
    };

    const handleProductFormClose = () => {
        setProductFormOpened(false);
        setSelectedProduct(null);
    };

    const handleAddFromCatalogClose = () => {
        setAddFromCatalogOpened(false);
        setSelectedCatalogProduct(null);
    };

    return (
        <Navbar>
            <Container size="xl" py="xl">
                <Title order={2} mb="lg">{t('productsList.title')}</Title>

                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="catalog" leftSection={<IconPackage size={16} />}>
                            {t('productsList.catalog')}
                        </Tabs.Tab>
                        <Tabs.Tab value="my-products" leftSection={<IconListDetails size={16} />}>
                            {t('productsList.myProducts')}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="catalog" pt="md">
                        <ProductCatalog onProductSelect={handleCatalogProductSelect} />
                    </Tabs.Panel>

                    <Tabs.Panel value="my-products" pt="md">
                        <MyProducts
                            onProductEdit={handleProductEdit}
                            onProductMove={handleProductEdit}
                        />
                    </Tabs.Panel>
                </Tabs>

                {/* Модальное окно для добавления продукта из каталога */}
                <AddProductFromCatalog
                    opened={addFromCatalogOpened}
                    onClose={handleAddFromCatalogClose}
                    catalogProduct={selectedCatalogProduct}
                />

                {/* Модальное окно для редактирования продукта */}
                <Modal
                    opened={productFormOpened}
                    onClose={handleProductFormClose}
                    title={t('product.editProduct')}
                    size="xl"
                    centered
                >
                    <ProductForm
                        opened={productFormOpened}
                        onClose={handleProductFormClose}
                        product={selectedProduct}
                    />
                </Modal>
            </Container>
        </Navbar>
    );
}