import { useEffect, useState } from 'react';
import {
    Container,
    Title,
    Button,
    Grid,
    Card,
    Text,
    Group,
    ActionIcon,
    Menu,
    Stack,
    Alert,
    Skeleton,
    Center,
} from '@mantine/core';
import {
    IconPlus,
    IconDots,
    IconEdit,
    IconTrash,
    IconSettings,
    IconAlertCircle,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useDisclosure } from '@mantine/hooks';
import { useFreezerStore } from '../store/freezerStore';
import { useModals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import Navbar from '../components/Navbar';
import FreezerCard from '../components/FreezerCard';
import FreezerDrawer from '../components/FreezerDrawer';
import FreezerForm from '../components/FreezerForm';

export default function Dashboard() {
    const { t } = useTranslation();
    const { freezers, loading, error, fetchFreezers, createFreezer, deleteFreezer } = useFreezerStore();
    const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
    const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
    const [editingFreezer, setEditingFreezer] = useState<any>(null);
    const [selectedFreezer, setSelectedFreezer] = useState<any>(null);

    const modals = useModals();

    useEffect(() => {
        fetchFreezers();
    }, [fetchFreezers]);

    const handleCreateFreezer = async (data: any) => {
        const { error } = await createFreezer(data);
        if (error) {
            notifications.show({
                title: t('common.error'),
                message: error,
                color: 'red',
            });
        } else {
            notifications.show({
                title: t('notifications.freezerCreated'),
                message: '',
                color: 'green',
            });
            closeForm();
        }
    };

    const handleEditFreezer = (freezer: any) => {
        setEditingFreezer(freezer);
        openForm();
    };

    const handleDeleteFreezer = (freezer: any) => {
        modals.openConfirmModal({
            title: t('freezer.confirmDelete'),
            children: (
                <Text size="sm">
                    {t('freezer.deleteWarning')}
                </Text>
            ),
            labels: { confirm: t('common.delete'), cancel: t('common.cancel') },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                const { error } = await deleteFreezer(freezer.id);
                if (error) {
                    notifications.show({
                        title: t('common.error'),
                        message: error,
                        color: 'red',
                    });
                } else {
                    notifications.show({
                        title: t('notifications.freezerDeleted'),
                        message: '',
                        color: 'green',
                    });
                }
            },
        });
    };

    const handleFreezerClick = (freezer: any) => {
        setSelectedFreezer(freezer);
        openDrawer();
    };

    const handleCloseDrawer = () => {
        closeDrawer();
        setSelectedFreezer(null);
    };

    const handleCloseForm = () => {
        closeForm();
        setEditingFreezer(null);
    };

    if (error) {
        return (
            <Navbar>
                <Container>
                    <Alert icon={<IconAlertCircle size={16} />} color="red" title={t('common.error')}>
                        {error}
                    </Alert>
                </Container>
            </Navbar>
        );
    }

    return (
        <Navbar>
            <Container>
                <Group justify="space-between" mb="xl">
                    <Title order={1}>{t('freezer.title')}</Title>
                    <Button leftSection={<IconPlus size={16} />} onClick={openForm}>
                        {t('freezer.addFreezer')}
                    </Button>
                </Group>

                {loading ? (
                    <Grid>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
                                <Skeleton height={200} />
                            </Grid.Col>
                        ))}
                    </Grid>
                ) : freezers.length === 0 ? (
                    <Center>
                        <Stack align="center" gap="md">
                            <Text size="lg" c="dimmed">
                                {t('freezer.emptyFreezer')}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {t('freezer.createFirstFreezer')}
                            </Text>
                            <Button onClick={openForm}>
                                {t('freezer.addFreezer')}
                            </Button>
                        </Stack>
                    </Center>
                ) : (
                    <Grid>
                        {freezers.map((freezer) => (
                            <Grid.Col key={freezer.id} span={{ base: 12, sm: 6, md: 4 }}>
                                <FreezerCard
                                    freezer={freezer}
                                    onClick={() => handleFreezerClick(freezer)}
                                    onEdit={() => handleEditFreezer(freezer)}
                                    onDelete={() => handleDeleteFreezer(freezer)}
                                />
                            </Grid.Col>
                        ))}
                    </Grid>
                )}

                <FreezerForm
                    opened={formOpened}
                    onClose={handleCloseForm}
                    onSubmit={handleCreateFreezer}
                    initialData={editingFreezer}
                />

                <FreezerDrawer
                    opened={drawerOpened}
                    onClose={handleCloseDrawer}
                    freezer={selectedFreezer}
                />
            </Container>
        </Navbar>
    );
}
