"use client";

import {
  AppShell,
  Group,
  Text,
  NavLink,
  ThemeIcon,
  Avatar,
  Box,
  Divider,
  Badge,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconUsers,
  IconPlugConnected,
  IconLayoutDashboard,
  IconMoon,
  IconSun,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/leads",             icon: IconUsers,             label: "Leads",        badge: null },
  { href: "/integrations/meta", icon: IconPlugConnected,     label: "Integrations", badge: null },
];

interface Props {
  children: ReactNode;
}

export function AppLayout({ children }: Props) {
  const pathname = usePathname();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      navbar={{ width: 240, breakpoint: "sm" }}
      padding="md"
    >
      <AppShell.Navbar p="sm">
        {/* Logo */}
        <AppShell.Section>
          <Group gap="sm" p="xs" mb="xs">
            <ThemeIcon size={36} radius="md" color="blue" variant="filled">
              <IconBuildingSkyscraper size={20} />
            </ThemeIcon>
            <Box>
              <Text fw={800} size="sm" lh={1}>Shikshapay</Text>
              <Text size="xs" c="dimmed">Lead CRM</Text>
            </Box>
          </Group>
          <Divider mb="sm" />
        </AppShell.Section>

        {/* Nav items */}
        <AppShell.Section grow>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              leftSection={
                <ThemeIcon
                  size={28}
                  radius="sm"
                  variant={pathname.startsWith(item.href) ? "filled" : "light"}
                  color="blue"
                >
                  <item.icon size={15} />
                </ThemeIcon>
              }
              rightSection={
                item.badge ? (
                  <Badge size="xs" circle color="red">
                    {item.badge}
                  </Badge>
                ) : null
              }
              active={pathname.startsWith(item.href)}
              styles={{
                root: { borderRadius: "var(--mantine-radius-md)", marginBottom: 4 },
              }}
            />
          ))}
        </AppShell.Section>

        {/* Bottom: user + theme toggle */}
        <AppShell.Section>
          <Divider mb="sm" />
          <Group justify="space-between" px="xs">
            <Group gap="xs">
              <Avatar size={30} radius="xl" color="blue">A</Avatar>
              <Box>
                <Text size="xs" fw={600}>Admin</Text>
                <Text size="xs" c="dimmed">Institute</Text>
              </Box>
            </Group>
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={() => toggleColorScheme()}
              aria-label="Toggle theme"
            >
              {colorScheme === "dark" ? <IconSun size={15} /> : <IconMoon size={15} />}
            </ActionIcon>
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}