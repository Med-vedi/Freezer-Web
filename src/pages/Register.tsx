import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import {
    Container,
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Title,
    Text,
    Stack,
    Alert,
    Group,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

export default function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { signUp } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
            confirmPassword: (value, values) =>
                value !== values.password ? t('auth.passwordMismatch') : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await signUp(values.email, values.password);

            if (error) {
                setError(error.message);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(t('errors.networkError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" mb="xl">
                {t('auth.registerTitle')}
            </Title>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        {error && (
                            <Alert icon={<IconAlertCircle size={16} />} color="red">
                                {error}
                            </Alert>
                        )}

                        <TextInput
                            label={t('auth.email')}
                            placeholder={t('auth.email')}
                            required
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            label={t('auth.password')}
                            placeholder={t('auth.password')}
                            required
                            {...form.getInputProps('password')}
                        />

                        <PasswordInput
                            label={t('auth.confirmPassword')}
                            placeholder={t('auth.confirmPassword')}
                            required
                            {...form.getInputProps('confirmPassword')}
                        />

                        <Button type="submit" fullWidth loading={loading}>
                            {t('auth.registerButton')}
                        </Button>

                        <Group justify="center" mt="md">
                            <Text size="sm">
                                {t('auth.alreadyHaveAccount')}{' '}
                                <Link to="/login" style={{ textDecoration: 'none' }}>
                                    {t('auth.login')}
                                </Link>
                            </Text>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
