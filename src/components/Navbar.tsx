import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppShell,
    Burger,
    Group,
    Text,
    Button,
    Menu,
    Avatar,
    ActionIcon,
    useMantineColorScheme,
    useComputedColorScheme,
    Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconLogout,
    IconSun,
    IconMoon,
    IconLanguage,
    IconHome,
    IconPackage,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { getAvailableLanguages, changeLanguage } from '../utils/i18nHelpers';

interface NavbarProps {
    children: React.ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, signOut } = useAuthStore();
    const [opened, { toggle }] = useDisclosure();
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light');
    const [languageMenuOpened, setLanguageMenuOpened] = useState(false);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const handleLanguageChange = (langCode: string) => {
        changeLanguage(langCode);
        setLanguageMenuOpened(false);
    };

    const languages = getAvailableLanguages();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Text size="lg" fw={700}>
                            Freezer Web
                        </Text>
                    </Group>

                    <Group>
                        <Menu
                            opened={languageMenuOpened}
                            onClose={() => setLanguageMenuOpened(false)}
                        >
                            <Menu.Target>
                                <ActionIcon
                                    variant="subtle"
                                    onClick={() => setLanguageMenuOpened(true)}
                                >
                                    <IconLanguage size={16} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                {languages.map((lang) => (
                                    <Menu.Item
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                    >
                                        {lang.name}
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>

                        <ActionIcon
                            variant="subtle"
                            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                        >
                            {computedColorScheme === 'light' ? (
                                <IconMoon size={16} />
                            ) : (
                                <IconSun size={16} />
                            )}
                        </ActionIcon>

                        <Menu>
                            <Menu.Target>
                                <Avatar size="sm" color="blue">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </Avatar>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={<IconLogout size={14} />} onClick={handleLogout}>
                                    {t('auth.logout')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Stack gap="xs">
                    <Button
                        variant="subtle"
                        leftSection={<IconHome size={16} />}
                        component={Link}
                        to="/dashboard"
                        justify="flex-start"
                    >
                        {t('navigation.dashboard')}
                    </Button>
                    <Button
                        variant="subtle"
                        leftSection={<IconPackage size={16} />}
                        component={Link}
                        to="/products"
                        justify="flex-start"
                    >
                        {t('navigation.products')}
                    </Button>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
