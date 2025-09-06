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

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { signIn } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await signIn(values.email, values.password);

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
                {t('auth.loginTitle')}
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

                        <Button type="submit" fullWidth loading={loading}>
                            {t('auth.loginButton')}
                        </Button>

                        <Group justify="center" mt="md">
                            <Text size="sm">
                                {t('auth.dontHaveAccount')}{' '}
                                <Link to="/register" style={{ textDecoration: 'none' }}>
                                    {t('auth.register')}
                                </Link>
                            </Text>
                        </Group>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
