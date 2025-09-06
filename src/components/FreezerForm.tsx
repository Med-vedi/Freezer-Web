import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import {
    Modal,
    TextInput,
    Button,
    Stack,
    Title,
    Group,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useFreezerStore } from '../store/freezerStore';

interface FreezerFormProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
}

export default function FreezerForm({ opened, onClose, onSubmit, initialData }: FreezerFormProps) {
    const { t } = useTranslation();
    const { updateFreezer } = useFreezerStore();
    const isEditing = !!initialData;

    const form = useForm({
        initialValues: {
            name: '',
        },
        validate: {
            name: (value) => (value.trim().length < 1 ? 'Name is required' : null),
        },
    });

    useEffect(() => {
        if (opened) {
            form.setValues({
                name: initialData?.name || '',
            });
        }
    }, [opened, initialData]);

    const handleSubmit = async (values: typeof form.values) => {
        if (isEditing) {
            const { error } = await updateFreezer(initialData.id, values);
            if (error) {
                // Handle error
                return;
            }
        }
        onSubmit(values);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Title order={3}>
                    {isEditing ? t('freezer.editFreezer') : t('freezer.addFreezer')}
                </Title>
            }
            size="sm"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label={t('freezer.freezerName')}
                        placeholder={t('freezer.freezerName')}
                        required
                        {...form.getInputProps('name')}
                    />

                    <Group justify="flex-end" gap="sm">
                        <Button variant="subtle" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit">
                            {isEditing ? t('common.save') : t('common.add')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
