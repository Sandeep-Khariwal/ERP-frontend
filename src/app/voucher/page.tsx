"use client";

import { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  List,
  Paper,
  rem,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Bus,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileText,
  Gift,
  Globe,
  GraduationCap,
  Home,
  LayoutDashboard,
  MapPin,
  Megaphone,
  MessageCircle,
  Navigation,
  Phone,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Video,
  Wallet,
  Check
} from 'lucide-react';

// ─── Image sources ────────────────────────────────────────────────────────
const IMAGES = {
  heroDashboard: '/hero-section.jpeg',
  parentApp: '/parent-app.jpeg',
  businessDashboard: '/business.jpeg',
};

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'student',
    icon: Users,
    title: 'Student Management',
    desc: 'Handle the entire student lifecycle from admission to alumni — in one organized place.',
    features: [
      'Student Admission Management',
      'Student Fee Collection & Records',
      'Batch Promotion (One Click)',
      'Student Database Management',
    ],
  },
  {
    id: 'documents',
    icon: FileText,
    title: 'Smart Documents',
    desc: 'Generate professional documents in a single click — no design skills needed.',
    features: ['One-Click Marksheet Generator', 'Student ID Card Generator', 'Certificates & Documents', 'Fees Reciept Download'],
  },
  {
    id: 'communication',
    icon: Bell,
    title: 'Communication',
    desc: 'Keep parents in the loop instantly with automated messaging.',
    features: ['WhatsApp Notifications', 'Parent Communication', 'Daily Diary Updates'],
  },
  {
    id: 'academic',
    icon: CalendarDays,
    title: 'Academic Management',
    desc: 'Run your academic operations smoothly, day in and day out.',
    features: [
      'Attendance Management',
      'Class Tests & Online Quiz',
      'Examination Management',
      'Timetable Management',
    ],
  },
  {
    id: 'staff',
    icon: ClipboardCheck,
    title: 'Teacher & Staff',
    desc: 'Empower your team with dedicated panels and full records.',
    features: ['Teacher Panel', 'Admin Panel', 'User Management', 'Staff Records'],
  },
  {
    id: 'crm',
    icon: Megaphone,
    title: 'CRM & Marketing',
    desc: 'Capture every inquiry and never miss a prospective parent.',
    features: ['Lead Management', 'Meta (Facebook) Lead Integration', 'Student Inquiry Tracking'],
  },
  {
    id: 'learning',
    icon: Video,
    title: 'Online Learning',
    desc: 'Bring the classroom online with built-in video tools.',
    features: ['Online Classes', 'Online Meetings'],
  },
  {
    id: 'extra',
    icon: LayoutDashboard,
    title: 'Extra Modules',
    desc: 'Everything else a modern school needs, included.',
    features: ['Gallery Management', 'Examination Records'],
  },
];

const PARENT_FEATURES = [
  { icon: Wallet, label: 'Pay Fees Online' },
  { icon: FileText, label: 'Apply for Leave' },
  { icon: TrendingUp, label: 'Check Test Marks' },
  { icon: Bell, label: 'View Daily Diary' },
  { icon: MapPin, label: 'Track School Vehicle Live' },
  { icon: Smartphone, label: 'View Student Activities' },
  { icon: Users, label: 'Switch Between Multiple Children' },
];

const BONUSES = [
  {
    icon: Globe,
    title: 'Free School Landing Website',
    desc: 'A professional, ready-to-publish website for your school — included at no cost.',
  },
  {
    icon: Database,
    title: 'Free Student Database Setup',
    desc: 'Our team imports and configures your entire student database for you.',
  },
  {
    icon: ShieldCheck,
    title: 'Free Onboarding Support',
    desc: 'Guided onboarding so your staff is confident from day one.',
  },
  {
    icon: Megaphone,
    title: 'Lead Management Setup',
    desc: 'We configure your lead pipeline and Meta integration out of the box.',
  },
];

const SECTION_PY = { base: rem(56), sm: rem(72), lg: rem(112) };
const SECTION_PX = { base: rem(20), sm: rem(32), lg: rem(48) };

const ALT_SECTION_BG = {
  background: 'linear-gradient(160deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-violet-0) 100%)',
};

// ─── Scroll-reveal hook ────────────────────────────────────────────────────
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

// ─── NAVIGATION HEADER ─────────────────────────────────────────────────────
function NavigationHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      pos="fixed"
      top={0}
      left={0}
      right={0}
      h={72}
      style={{
        background: scrolled 
          ? 'rgba(255, 255, 255, 0.95)' 
          : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(6px)',
        zIndex: 1000,
        borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(15, 23, 42, 0.04)',
        boxShadow: scrolled 
          ? '0 4px 20px rgba(15, 23, 42, 0.1)' 
          : '0 2px 8px rgba(15, 23, 42, 0.04)',
        transition: 'all 200ms ease',
      }}
    >
      <Container size="xl" h="100%">
        <Group h="100%" justify="space-between">
          {/* Premium Left Section */}
          <Group gap={0} h="100%" style={{ cursor: 'pointer' }}>
            {/* Animated Gradient Circle */}
            <Box
              style={{
                position: 'relative',
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(76, 81, 230, 0.08), rgba(112, 72, 232, 0.08))',
                border: '1.5px solid rgba(76, 81, 230, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 260ms ease',
              }}
              className="nav-icon-hover"
            >
              <ThemeIcon
                size={44}
                radius="md"
                variant="gradient"
                gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                style={{
                  boxShadow: '0 4px 12px rgba(76, 81, 230, 0.25)',
                }}
              >
                <LayoutDashboard size={20} strokeWidth={1.8} />
              </ThemeIcon>
            </Box>

            {/* Brand Info */}
            <Box pl="md" style={{ borderLeft: '1px solid rgba(15, 23, 42, 0.08)' }}>
              <Group gap={4} align="flex-start">
                <Box>
                  <Text 
                    fw={700} 
                    size="sm" 
                    c="dark.9"
                    style={{ lineHeight: 1.2 }}
                  >
                    ShikshaPay
                  </Text>
                  <Text 
                    fw={600}
                    size="10px" 
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'violet', deg: 90 }}
                    style={{ lineHeight: 1, letterSpacing: '0.4px' }}
                  >
                    CLOUD
                  </Text>
                </Box>
              </Group>
            </Box>
          </Group>

          {/* Back Button */}
          <Button
            component="a"
            href="/"
            variant="outline"
            color="blue"
            leftSection={<ArrowLeft size={16} />}
            radius="lg"
            size="sm"
            style={{
              borderColor: 'rgba(76, 81, 230, 0.3)',
              transition: 'all 260ms ease',
            }}
            className="nav-btn-hover"
          >
            Back to Main
          </Button>
        </Group>
      </Container>

      <style>{`
        .nav-icon-hover:hover {
          background: linear-gradient(135deg, rgba(76, 81, 230, 0.15), rgba(112, 72, 232, 0.15));
          border-color: rgba(76, 81, 230, 0.25);
          transform: translateY(-2px);
        }
        .nav-btn-hover:hover {
          border-color: rgba(76, 81, 230, 0.6);
          background: rgba(76, 81, 230, 0.02);
          transform: translateY(-1px);
        }
      `}</style>
    </Box>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Stack gap="sm" align={center ? 'center' : 'flex-start'} maw={680} mx={center ? 'auto' : undefined}>
      {eyebrow && (
        <Badge
          variant="outline"
          color="blue"
          size="md"
          style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          {eyebrow}
        </Badge>
      )}
      <Title
        order={2}
        ta={center ? 'center' : 'left'}
        c={light ? 'white' : 'dark.9'}
        style={{ lineHeight: 1.2 }}
      >
        {title}
      </Title>
      {subtitle && (
        <Text ta={center ? 'center' : 'left'} c={light ? 'blue.1' : 'dimmed'} size="md" lh={1.7}>
          {subtitle}
        </Text>
      )}
    </Stack>
  );
}

function WindowDots() {
  return (
    <Group gap={6}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <Box key={c} w={9} h={9} style={{ borderRadius: 999, background: c }} />
      ))}
    </Group>
  );
}

function PhoneMockup({
  w = 420,
  src = IMAGES.parentApp,
  frame = 'illustration' as 'illustration' | 'device',
}: {
  w?: number;
  src?: string;
  frame?: 'illustration' | 'device';
}) {
  const [failed, setFailed] = useState(false);

  const fallback = (
    <Box
      pos="absolute"
      inset={0}
      style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #4c51e6, #7048e8)' }}
    >
      <Stack align="center" justify="center" h="100%" gap={6} px="md">
        <ThemeIcon size={44} radius="xl" style={{ background: 'rgba(255,255,255,0.18)' }}>
          <Smartphone size={22} color="white" />
        </ThemeIcon>
        <Text size="xs" c="white" fw={700} ta="center">
          Add your parent-app image at
        </Text>
        <Text size="10px" c="rgba(255,255,255,0.75)" ta="center" ff="monospace">
          {IMAGES.parentApp}
        </Text>
      </Stack>
    </Box>
  );

  if (frame === 'illustration') {
    return (
      <Box maw={w} mx="auto" pos="relative">
        <Paper
          radius="xl"
          shadow="xl"
          style={{
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(160deg, var(--mantine-color-blue-0), var(--mantine-color-violet-0))',
            border: '1px solid rgba(15,23,42,0.06)',
            boxShadow:
              '0 30px 60px -18px rgba(76,81,230,0.35), 0 12px 28px -10px rgba(15,23,42,0.18)',
          }}
        >
          <Box style={{ position: 'relative', width: '100%', maxHeight: 460, overflow: 'hidden' }}>
            {!failed ? (
              <img
                src={src}
                alt="Parents using the ShikshaPay parent app"
                onError={() => setFailed(true)}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  maxHeight: 460,
                  objectFit: 'contain',
                  margin: '0 auto',
                }}
              />
            ) : (
              <Box style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10' }}>{fallback}</Box>
            )}
          </Box>
        </Paper>
        <Box
          pos="absolute"
          top="10%"
          left="8%"
          right="8%"
          bottom="6%"
          style={{
            zIndex: -1,
            borderRadius: 28,
            background: 'linear-gradient(135deg, rgba(76,81,230,0.28), rgba(112,72,232,0.22))',
            filter: 'blur(30px)',
            transform: 'translateY(16px) scale(0.94)',
          }}
        />
      </Box>
    );
  }

  return (
    <Paper
      radius={40}
      shadow="xl"
      p={10}
      w={Math.min(w, 240)}
      mx="auto"
      style={{
        background: 'linear-gradient(160deg, #1a1f36, #0b0e1a)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow:
          '0 30px 60px -18px rgba(15,23,42,0.55), 0 10px 24px -10px rgba(76,81,230,0.25), inset 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      <Paper
        radius={30}
        bg="white"
        style={{ overflow: 'hidden', position: 'relative', aspectRatio: '9 / 19.5' }}
      >
        {!failed ? (
          <img
            src={src}
            alt="ShikshaPay parent app screenshot"
            onError={() => setFailed(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
            }}
          />
        ) : (
          fallback
        )}

        <Box pos="absolute" top={0} left={0} right={0} px="sm" pt={8} style={{ zIndex: 2 }}>
          <Group justify="space-between" wrap="nowrap">
            <Text size="10px" fw={700} c="white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}>
              9:41
            </Text>
            <Group gap={4}>
              <Box w={16} h={8} style={{ borderRadius: 2, background: 'rgba(255,255,255,0.85)' }} />
              <Box w={16} h={8} style={{ borderRadius: 2, background: 'rgba(255,255,255,0.85)' }} />
            </Group>
          </Group>
        </Box>

        <Center pos="absolute" top={7} left="50%" style={{ transform: 'translateX(-50%)', zIndex: 3 }}>
          <Box w={64} h={18} style={{ borderRadius: 999, background: '#0f172a' }} />
        </Center>

        <Center pos="absolute" bottom={8} left="50%" style={{ transform: 'translateX(-50%)', zIndex: 3 }}>
          <Box w={90} h={4} style={{ borderRadius: 999, background: 'rgba(255,255,255,0.7)' }} />
        </Center>
      </Paper>
    </Paper>
  );
}

function GpsMapMockup() {
  const routeD =
    'M 30 230 C 90 230, 90 150, 150 150 S 230 90, 280 90 S 350 60, 380 40';

  return (
    <Paper withBorder radius="xl" shadow="lg" style={{ overflow: 'hidden' }}>
      <Group px="md" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
        <WindowDots />
        <Text size="xs" c="dimmed" ml="xs">Live Vehicle Tracking</Text>
      </Group>

      <Box
        pos="relative"
        h={280}
        style={{
          backgroundImage:
            'linear-gradient(var(--mantine-color-gray-2) 1px, transparent 1px), linear-gradient(90deg, var(--mantine-color-gray-2) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundColor: '#eef4fb',
        }}
      >
        <svg
          viewBox="0 0 400 280"
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0 }}
        >
          <path
            className="dash-route"
            d={routeD}
            fill="none"
            stroke="#7048e8"
            strokeWidth="4"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <path
            className="draw-path"
            d={routeD}
            fill="none"
            stroke="#1971c2"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="30" cy="230" r="6" fill="#1971c2" />
          <circle cx="380" cy="40" r="6" fill="#7048e8" />
        </svg>

        <Box className="bus-track">
          <Box pos="relative" w={34} h={34}>
            <Box className="pulse-ring" />
            <ThemeIcon
              size={34}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'blue', to: 'violet', deg: 135 }}
              style={{ boxShadow: '0 4px 12px rgba(25,113,194,0.4)', position: 'relative' }}
            >
              <Bus size={17} />
            </ThemeIcon>
          </Box>
        </Box>

        <Box pos="absolute" top={30} left={368} style={{ transform: 'translate(-50%, -100%)' }}>
          <ThemeIcon size={26} radius="xl" color="violet" variant="filled">
            <MapPin size={13} />
          </ThemeIcon>
        </Box>

        <Paper
          withBorder
          radius="md"
          p={8}
          pos="absolute"
          bottom={12}
          left={12}
          shadow="sm"
          bg="white"
        >
          <Group gap={6}>
            <Navigation size={13} color="var(--mantine-color-blue-6)" />
            <Box>
              <Text size="9px" fw={700}>Bus 07 · Route A</Text>
              <Text size="8px" c="dimmed">ETA 6 mins · 2.1 km left</Text>
            </Box>
          </Group>
        </Paper>
      </Box>
    </Paper>
  );
}

function BusinessMockup() {
  const months = [
    { label: 'Jan', value: 62 },
    { label: 'Feb', value: 70 },
    { label: 'Mar', value: 56 },
    { label: 'Apr', value: 88 },
    { label: 'May', value: 74 },
    { label: 'Jun', value: 95 },
  ];

  const chartW = 260;
  const chartH = 80;
  const stepX = chartW / (months.length - 1);
  const points = months.map((m, i) => ({
    x: i * stepX,
    y: chartH - (m.value / 100) * chartH,
  }));
  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`))
    .join(' ');
  const areaPath = `${linePath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  const breakdown = [
    { label: 'Tuition Fees', pct: 68, color: 'blue' },
    { label: 'Transport Fees', pct: 20, color: 'violet' },
    { label: 'Other Income', pct: 12, color: 'teal' },
  ];

  return (
    <Paper withBorder radius="xl" shadow="lg" p="md" bg="white">
      <Group justify="space-between" align="flex-start" mb="sm">
        <Box>
          <Text fw={700} size="sm" c="dark.9">Revenue Overview</Text>
          <Text size="10px" c="dimmed">Last 6 months</Text>
        </Box>
        <Badge size="xs" color="teal" variant="light" leftSection={<TrendingUp size={10} />}>
          +18.4%
        </Badge>
      </Group>

      <Group gap="xl" mb="md">
        <Box>
          <Text fw={800} size="lg" c="dark.9">₹4.2L</Text>
          <Text size="8px" c="dimmed" tt="uppercase" fw={600}>Total Revenue</Text>
        </Box>
        <Box>
          <Text fw={800} size="lg" c="teal.7">₹2.4L</Text>
          <Text size="8px" c="dimmed" tt="uppercase" fw={600}>Net Profit</Text>
        </Box>
        <Box>
          <Text fw={800} size="lg" c="red.6">₹1.8L</Text>
          <Text size="8px" c="dimmed" tt="uppercase" fw={600}>Expenses</Text>
        </Box>
      </Group>

      <Box mb="md">
        <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="80" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4263eb" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4263eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGrad)" className="area-fade" />
          <path
            d={linePath}
            fill="none"
            stroke="#4263eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="draw-path"
          />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#4263eb" />
          ))}
        </svg>
        <Group justify="space-between" mt={4}>
          {months.map((m) => (
            <Text key={m.label} size="8px" c="dimmed">{m.label}</Text>
          ))}
        </Group>
      </Box>

      <Stack gap={8}>
        {breakdown.map((b) => (
          <Box key={b.label}>
            <Group justify="space-between" mb={3}>
              <Text size="9px" c="dimmed">{b.label}</Text>
              <Text size="9px" fw={700} c="dark.8">{b.pct}%</Text>
            </Group>
            <Box h={5} style={{ borderRadius: 999, background: 'var(--mantine-color-gray-1)', overflow: 'hidden' }}>
              <Box
                h="100%"
                className="bar-grow-h"
                style={{
                  width: `${b.pct}%`,
                  borderRadius: 999,
                  background: `var(--mantine-color-${b.color}-6)`,
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

function BusinessDashboardShot({
  src = IMAGES.businessDashboard,
  focalPosition = 'center top',
}: {
  src?: string;
  focalPosition?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <Box pos="relative">
      <Paper
        radius="xl"
        shadow="lg"
        p={0}
        style={{
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.6)',
          background: 'white',
          boxShadow:
            '0 30px 60px -18px rgba(76,81,230,0.32), 0 12px 28px -10px rgba(15,23,42,0.16), 0 0 0 1px rgba(15,23,42,0.04)',
        }}
      >
        <Group
          px="md"
          py={8}
          justify="space-between"
          style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', background: '#fafbfd' }}
        >
          <WindowDots />
          <Group gap={6}>
            <ThemeIcon size={18} radius="sm" variant="light" color="blue">
              <BarChart3 size={11} />
            </ThemeIcon>
            <Text size="10px" c="dimmed" fw={600}>ShikshaPay · Business Dashboard</Text>
          </Group>
          <Box w={18} />
        </Group>

        <Box style={{ position: 'relative', width: '100%', aspectRatio: '16 / 11', overflow: 'hidden' }}>
          {!failed ? (
            <img
              src={src}
              alt="ShikshaPay Cloud business dashboard — income, expense & financial reports"
              onError={() => setFailed(true)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: focalPosition,
                display: 'block',
              }}
            />
          ) : (
            <Box
              pos="absolute"
              inset={0}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(150deg, #eef1ff 0%, #f5f3ff 55%, #ffffff 100%)',
              }}
            >
              <Stack align="center" justify="center" h="100%" gap={8}>
                <ThemeIcon
                  size={52}
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                >
                  <BarChart3 size={24} />
                </ThemeIcon>
                <Text size="sm" fw={700} c="dark.7">Add your business dashboard screenshot</Text>
                <Text size="11px" c="dimmed" ff="monospace">{IMAGES.businessDashboard}</Text>
              </Stack>
            </Box>
          )}
        </Box>
      </Paper>

      <Box
        pos="absolute"
        top="8%"
        left="6%"
        right="6%"
        bottom="4%"
        style={{
          zIndex: -1,
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(76,81,230,0.3), rgba(112,72,232,0.24))',
          filter: 'blur(28px)',
          transform: 'translateY(16px) scale(0.96)',
        }}
      />
    </Box>
  );
}

function AdmissionsPipelineMockup() {
  const leads = [
    {
      column: 'New Lead',
      count: 12,
      color: 'gray',
      cards: [
        { name: 'Aarav Sharma', meta: 'Grade 9 · Inquired Today', tag: 'HIGH INTENT', tagColor: 'teal' },
        { name: 'Diya Patel', meta: 'Grade 4 · Facebook Ad', tag: 'PENDING', tagColor: 'gray' },
      ],
    },
    {
      column: 'Follow Up',
      count: 5,
      color: 'blue',
      cards: [
        { name: 'Rohan Gupta', meta: 'Grade 11 · Visited Campus', tag: 'CALL SCHEDULED', tagColor: 'blue', highlight: true },
      ],
    },
    {
      column: 'Admitted',
      count: 7,
      color: 'teal',
      cards: [
        { name: 'Sneha Verma', meta: 'Grade 1 · Fee Paid', struck: true },
      ],
    },
  ];

  return (
    <Paper
      withBorder
      radius="xl"
      shadow="md"
      p="lg"
      style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid rgba(15,23,42,0.06)' }}
    >
      <Group justify="space-between" align="flex-start" mb="lg">
        <Box>
          <Text fw={700} size="lg" c="dark.9">Admissions Pipeline</Text>
          <Text size="xs" c="dimmed">Drag and drop inquiries to update status</Text>
        </Box>
        <Badge color="blue" variant="light" size="md" radius="xl">
          24 Active
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {leads.map((col:any) => (
          <Stack key={col.column} gap="sm">
            <Text size="10px" fw={700} c={col.color === 'gray' ? 'dimmed' : col.color} tt="uppercase" style={{ letterSpacing: '0.04em' }}>
              {col.column} ({col.count})
            </Text>
            {col.cards.map((c:any) => (
              <Card
                key={c.name}
                withBorder
                radius="lg"
                p="sm"
                shadow="xs"
                bg="white"
                style={{
                  borderColor: c.highlight ? 'var(--mantine-color-blue-4)' : undefined,
                  borderWidth: c.highlight ? 1.5 : 1,
                  opacity: c.struck ? 0.6 : 1,
                }}
              >
                <Text
                  size="sm"
                  fw={700}
                  c="dark.9"
                  style={{ textDecoration: c.struck ? 'line-through' : undefined }}
                >
                  {c.name}
                </Text>
                <Text size="xs" c="dimmed" mb={c.tag ? 6 : 0}>{c.meta}</Text>
                {c.tag && (
                  <Badge size="xs" variant="light" color={c.tagColor}>
                    {c.tag}
                  </Badge>
                )}
              </Card>
            ))}
          </Stack>
        ))}
      </SimpleGrid>
    </Paper>
  );
}

function HeroFloatingCard() {
  return (
    <Paper
      radius="xl"
      p="sm"
      bg="white"
      style={{
        boxShadow: '0 20px 40px -12px rgba(15,23,42,0.25), 0 6px 14px -6px rgba(15,23,42,0.1)',
        border: '1px solid var(--mantine-color-gray-1)',
      }}
    >
      <Group gap="sm" wrap="nowrap" mb={8}>
        <ThemeIcon
          size={38}
          radius="lg"
          variant="gradient"
          gradient={{ from: 'teal', to: 'blue', deg: 135 }}
        >
          <Bus size={18} />
        </ThemeIcon>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text size="xs" fw={700} c="dark.9">Bus 07 is arriving</Text>
          <Text size="10px" c="dimmed">ETA 6 mins · Route A</Text>
        </Box>
        <Badge size="xs" color="teal" variant="light">Live</Badge>
      </Group>
      <Box h={4} style={{ borderRadius: 999, background: 'var(--mantine-color-gray-1)', overflow: 'hidden' }}>
        <Box
          h="100%"
          className="progress-grow"
          style={{ borderRadius: 999, background: 'linear-gradient(90deg,#0ca678,#20c997)' }}
        />
      </Box>
    </Paper>
  );
}

function HeroProductShot({
  src = IMAGES.heroDashboard,
  focalPosition = 'center 28%',
}: {
  src?: string;
  focalPosition?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <Box
      className="hero-tilt"
      style={{
        perspective: 1400,
      }}
    >
      <Paper
        radius="xl"
        shadow="lg"
        p={0}
        className="hero-tilt-inner"
        style={{
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.6)',
          background: 'white',
          boxShadow:
            '0 32px 64px -16px rgba(76,81,230,0.38), 0 14px 30px -10px rgba(15,23,42,0.16), 0 0 0 1px rgba(15,23,42,0.04)',
          transformStyle: 'preserve-3d',
        }}
      >
        <Group
          px="md"
          py={8}
          justify="space-between"
          style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', background: '#fafbfd' }}
        >
          <WindowDots />
          <Group gap={6}>
            <ThemeIcon size={18} radius="sm" variant="light" color="blue">
              <LayoutDashboard size={11} />
            </ThemeIcon>
            <Text size="10px" c="dimmed" fw={600}>ShikshaPay · Dashboard</Text>
          </Group>
          <Box w={18} />
        </Group>

        <Box style={{ position: 'relative', width: '100%', aspectRatio: '16 / 11', overflow: 'hidden' }}>
          {!failed ? (
            <img
              src={src}
              alt="ShikshaPay Cloud dashboard preview"
              onError={() => setFailed(true)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: focalPosition,
                display: 'block',
              }}
            />
          ) : (
            <Box
              pos="absolute"
              inset={0}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(150deg, #eef1ff 0%, #f5f3ff 55%, #ffffff 100%)',
              }}
            >
              <Stack align="center" justify="center" h="100%" gap={8}>
                <ThemeIcon
                  size={52}
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                >
                  <LayoutDashboard size={24} />
                </ThemeIcon>
                <Text size="sm" fw={700} c="dark.7">Add your dashboard screenshot</Text>
                <Text size="11px" c="dimmed" ff="monospace">{IMAGES.heroDashboard}</Text>
              </Stack>
            </Box>
          )}

          <Box
            pos="absolute"
            bottom={0}
            left={0}
            right={0}
            h={64}
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,0.85), rgba(255,255,255,0))',
              pointerEvents: 'none',
            }}
          />
        </Box>
      </Paper>

      <Box
        pos="absolute"
        top="8%"
        left="6%"
        right="6%"
        bottom="4%"
        style={{
          zIndex: -1,
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(76,81,230,0.35), rgba(112,72,232,0.28))',
          filter: 'blur(28px)',
          transform: 'translateY(18px) scale(0.96)',
        }}
      />
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Voucher() {
  const [featuresRef, featuresInView] = useInView<HTMLDivElement>();
  const [demoRef, demoInView] = useInView<HTMLDivElement>();
  const [ctaRef, ctaInView] = useInView<HTMLDivElement>();

  return (
    <Box style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes widgetFloat {
          0%, 100% { transform: rotate(-2deg) translateY(0px); }
          50% { transform: rotate(-2deg) translateY(-9px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes growBar {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes growBarH {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 700; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes donutDraw {
          from { stroke-dashoffset: 260; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -100; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.75); opacity: 0.55; }
          80% { transform: scale(2.3); opacity: 0; }
          100% { transform: scale(2.3); opacity: 0; }
        }
        @keyframes softPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -16px) scale(1.08); }
        }
        @keyframes progressGrow {
          from { width: 0%; }
          to { width: 65%; }
        }
        @keyframes moveBus {
          0%   { transform: translate(-50%, -50%) translate(30px, 230px); }
          20%  { transform: translate(-50%, -50%) translate(95px, 195px); }
          40%  { transform: translate(-50%, -50%) translate(150px, 150px); }
          60%  { transform: translate(-50%, -50%) translate(215px, 115px); }
          80%  { transform: translate(-50%, -50%) translate(280px, 90px); }
          100% { transform: translate(-50%, -50%) translate(380px, 40px); }
        }
        @keyframes heroTiltFloat {
          0%, 100% { transform: rotateX(6deg) rotateY(-8deg) translateY(0px); }
          50% { transform: rotateX(4deg) rotateY(-6deg) translateY(-10px); }
        }

        .fade-up { animation: fadeInUp 0.7s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.15s; }
        .fade-up-3 { animation-delay: 0.25s; }
        .float-el { animation: floatY 5s ease-in-out infinite; }
        .widget-float { animation: widgetFloat 5.5s ease-in-out infinite; animation-delay: 0.6s; }

        .hero-tilt { position: relative; }
        .hero-tilt-inner {
          animation: heroTiltFloat 7s ease-in-out infinite;
          transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 400ms ease;
        }
        .hero-tilt:hover .hero-tilt-inner {
          transform: rotateX(0deg) rotateY(0deg) translateY(-6px) !important;
          animation-play-state: paused;
        }

        .feature-card {
          transition: transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 40px -12px rgba(25, 113, 194, 0.28);
          border-color: var(--mantine-color-blue-3);
        }

        .reveal-card {
          opacity: 0;
          transform: translateY(34px) scale(0.96);
        }
        .reveal-card.in-view {
          animation: revealCardIn 720ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes revealCardIn {
          0% { opacity: 0; transform: translateY(34px) scale(0.96); }
          60% { opacity: 1; }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .feature-icon-wrap {
          position: relative;
          width: 48px;
          height: 48px;
        }
        .feature-icon-wrap::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 14px;
          background: conic-gradient(from 0deg, #4c51e6, #7048e8, #4c51e6);
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 300ms ease;
          animation: spinHalo 3.5s linear infinite;
          animation-play-state: paused;
        }
        .feature-card:hover .feature-icon-wrap::before {
          opacity: 0.35;
          animation-play-state: running;
        }
        .feature-icon {
          position: relative;
          transition: transform 300ms ease;
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(-4deg);
        }
        @keyframes spinHalo {
          from { transform: scale(0.85) rotate(0deg); }
          to { transform: scale(1) rotate(360deg); }
        }

        .video-glow {
          position: relative;
        }
        .video-glow::before {
          content: '';
          position: absolute;
          inset: -3px;
          z-index: 0;
          border-radius: 22px;
          background: linear-gradient(135deg, #4c51e6, #7048e8, #1971c2);
          opacity: 0.45;
          filter: blur(18px);
          animation: glowPulse 4s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.02); }
        }

        .lift-card {
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .lift-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px -14px rgba(25, 113, 194, 0.25);
        }

        .phone-lift {
          transition: transform 320ms ease, box-shadow 320ms ease;
        }
        .phone-lift:hover {
          transform: translateY(-6px) rotateZ(-0.5deg);
        }

        .bar-grow {
          transform-origin: bottom;
          animation: growBar 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .bar-grow-h {
          transform-origin: left;
          animation: growBarH 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .area-fade {
          animation: fadeIn 1s ease both;
        }
        .draw-path {
          stroke-dasharray: 700;
          animation: drawLine 1.6s ease forwards;
        }
        .dash-route {
          animation: dashMove 2.2s linear infinite;
        }
        .pulse-ring {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50%;
          background: rgba(112,72,232,0.45);
          animation: pulseRing 1.8s ease-out infinite;
        }
        .progress-grow {
          animation: progressGrow 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }

        .bus-track {
          position: absolute;
          top: 0;
          left: 0;
          width: 34px;
          height: 34px;
          animation: moveBus 8s ease-in-out infinite alternate;
        }
      `}</style>

      {/* NAVIGATION HEADER - STICKY */}
      <NavigationHeader />

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <Box
        style={{
          background: 'linear-gradient(160deg, var(--mantine-color-blue-0) 0%, white 60%)',
          overflow: 'hidden',
          position: 'relative',
        }}
        py={{ base: rem(48), lg: rem(104) }}
        px={SECTION_PX}
        pt={{ base: rem(110), lg: rem(150) }}
      >
        <Box
          pos="absolute"
          top={-80}
          right={-80}
          w={320}
          h={320}
          style={{
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(112,72,232,0.18), transparent 70%)',
            filter: 'blur(10px)',
            animation: 'blobDrift 9s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <Box
          pos="absolute"
          bottom={-100}
          left={-60}
          w={260}
          h={260}
          style={{
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25,113,194,0.16), transparent 70%)',
            filter: 'blur(10px)',
            animation: 'blobDrift 11s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }}
        />
        <Container size="xl" style={{ position: 'relative' }}>
          <Grid gutter={{ base: 'xl', lg: 'xl' }} align="center">
            <Grid.Col span={{ base: 12, lg: 6 }} style={{ minWidth: 0 }}>
              <Stack gap="md" className="fade-up">
                <Group gap="xs">
                  <Badge leftSection={<Sparkles size={13} />} variant="outline" color="blue" size="lg">
                    Enterprise School ERP
                  </Badge>
                </Group>

                <Text size="sm" fw={700} tt="uppercase" c="blue" style={{ letterSpacing: '0.2em' }}>
                  SHIKSHAPAY CLOUD
                </Text>

                <Title
                  order={1}
                  style={{ lineHeight: 1.1, fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
                  c="dark.9"
                >
                  Digitize Your School.{' '}
                  <Text
                    component="span"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                    inherit
                  >
                    Save Time. Increase Efficiency.
                  </Text>
                </Title>

                <Text size="lg" c="dimmed" maw={540} lh={1.7}>
                  Complete School ERP &amp; CRM Management Software — admissions, fees, academics,
                  transport, parent app and CRM, all in one elegant platform.
                </Text>

                <Group gap="sm" mt="xs">
                  <Button
                    component="a"
                    href="#final-cta"
                    size="md"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                    rightSection={<ArrowRight size={16} />}
                    radius="xl"
                  >
                    Book a Free Demo
                  </Button>
                  <Button
                    component="a"
                    href="#demo"
                    size="md"
                    variant="default"
                    leftSection={<PlayCircle size={18} />}
                    radius="xl"
                  >
                    Watch Live CRM Demo
                  </Button>
                </Group>

                <Group gap="lg" mt="xs">
                  {['No hidden charges', 'Free onboarding', '₹2/student/mo'].map((t) => (
                    <Group key={t} gap={6}>
                      <ThemeIcon color="blue" variant="light" size="sm" radius="xl">
                        <CheckCircle2 size={12} />
                      </ThemeIcon>
                      <Text size="xs" c="dimmed" fw={500}>{t}</Text>
                    </Group>
                  ))}
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }} style={{ minWidth: 0 }}>
              <Box
                pos="relative"
                maw={420}
                mx="auto"
                pb={{ base: 0, lg: rem(90) }}
                className="fade-up fade-up-2"
              >
                <HeroProductShot />

                <Box
                  pos="absolute"
                  bottom={rem(-70)}
                  right={rem(-24)}
                  w={230}
                  display={{ base: 'none', lg: 'block' }}
                  className="widget-float"
                  style={{ zIndex: 2 }}
                >
                  <HeroFloatingCard />
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* ═══ FEATURES ════════════════════════════════════════════════════════ */}
      <Box bg="white" py={SECTION_PY} px={SECTION_PX}>
        <Container size="xl">
          <SectionHeading
            eyebrow="Powerful Features"
            title="Everything Your School Needs in One Platform"
            subtitle="A modular, enterprise-grade suite covering every part of school operations — from admissions to transport."
          />

          <SimpleGrid ref={featuresRef} cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mt="xl">
            {CATEGORIES.map((cat, idx) => (
              <Card
                key={cat.id}
                withBorder
                radius="xl"
                p="lg"
                shadow="sm"
                className={`feature-card reveal-card${featuresInView ? ' in-view' : ''}`}
                style={{ animationDelay: `${(idx % 4) * 90 + Math.floor(idx / 4) * 140}ms` }}
              >
                <Box className="feature-icon-wrap" mb="md">
                  <ThemeIcon
                    size={48}
                    radius="lg"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                    className="feature-icon"
                  >
                    <cat.icon size={22} />
                  </ThemeIcon>
                </Box>
                <Text fw={700} size="sm" c="dark.9" mb={4}>{cat.title}</Text>
                <Text size="xs" c="dimmed" lh={1.6} mb="md">{cat.desc}</Text>
                <List
                  spacing={6}
                  size="xs"
                  c="dimmed"
                  icon={
                    <ThemeIcon color="blue" size={16} radius="xl" variant="light">
                      <CheckCircle2 size={10} />
                    </ThemeIcon>
                  }
                >
                  {cat.features.map((f) => (
                    <List.Item key={f}>{f}</List.Item>
                  ))}
                </List>
              </Card>
            ))}
          </SimpleGrid>

          <Box display={{ base: 'block', sm: 'none' }} mt="lg">
            <Accordion variant="separated" radius="xl">
              {CATEGORIES.map((cat) => (
                <Accordion.Item key={cat.id} value={cat.id}>
                  <Accordion.Control
                    icon={
                      <ThemeIcon color="blue" variant="light" size={36} radius="lg">
                        <cat.icon size={18} />
                      </ThemeIcon>
                    }
                  >
                    <Text fw={700} size="sm">{cat.title}</Text>
                    <Text size="xs" c="dimmed">{cat.desc}</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <List
                      spacing={8}
                      size="sm"
                      icon={
                        <ThemeIcon color="blue" size={18} radius="xl" variant="light">
                          <CheckCircle2 size={11} />
                        </ThemeIcon>
                      }
                    >
                      {cat.features.map((f) => (
                        <List.Item key={f}>{f}</List.Item>
                      ))}
                    </List>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Box>
        </Container>
      </Box>

      {/* ═══ PARENT MOBILE APP ═══════════════════════════════════════════════ */}
      <Box py={SECTION_PY} px={SECTION_PX} style={ALT_SECTION_BG}>
        <Container size="xl">
          <Grid gutter={{ base: 'xl', lg: 60 }} align="center" style={{ maxWidth: '100%' }}>
            <Grid.Col span={{ base: 12, lg: 6 }} order={{ base: 2, lg: 1 }} style={{ minWidth: 0 }}>
              <Box className="phone-lift fade-up">
                <PhoneMockup />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }} order={{ base: 1, lg: 2 }} style={{ minWidth: 0 }}>
              <SectionHeading
                eyebrow="Parent Mobile App"
                title="A powerful app for every parent"
                subtitle="Keep parents connected and informed — fees, attendance, marks, live transport and more, right from their pocket."
                center={false}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mt="lg">
                {PARENT_FEATURES.map((f) => (
                  <Card key={f.label} withBorder radius="lg" p="sm" shadow="xs" className="lift-card">
                    <Group gap="sm">
                      <ThemeIcon color="blue" variant="light" size={36} radius="lg">
                        <f.icon size={16} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="dark.8">{f.label}</Text>
                    </Group>
                  </Card>
                ))}
              </SimpleGrid>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* ═══ TRANSPORT / GPS ═════════════════════════════════════════════════ */}
      <Box bg="white" py={SECTION_PY} px={SECTION_PX}>
        <Container size="xl">
          <Grid gutter="xl" align="center">
            <Grid.Col span={{ base: 12, lg: 6 }} style={{ minWidth: 0 }}>
              <SectionHeading
                eyebrow="Transport Management"
                title="GPS Live Vehicle Tracking"
                subtitle="Know exactly where every school vehicle is — in real time. Parents see live ETAs, and admins monitor the entire fleet from one map."
                center={false}
              />
              <List
                mt="lg"
                spacing="sm"
                size="sm"
                c="dark.6"
                icon={
                  <ThemeIcon color="blue" variant="light" size={28} radius="xl">
                    <Bus size={14} />
                  </ThemeIcon>
                }
              >
                {[
                  'Real-time GPS location of every bus',
                  'Automatic ETA for parents on the app',
                  'Route history and trip playback',
                  'Driver & vehicle assignment panel',
                ].map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }} style={{ minWidth: 0 }}>
              <GpsMapMockup />
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* ═══ BUSINESS DASHBOARD ══════════════════════════════════════════════ */}
      <Box py={SECTION_PY} px={SECTION_PX} style={ALT_SECTION_BG}>
        <Container size="xl">
          <Grid gutter="xl" align="center">
            <Grid.Col span={{ base: 12, lg: 6 }} order={{ base: 2, lg: 1 }} style={{ minWidth: 0 }}>
              <BusinessDashboardShot />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }} order={{ base: 1, lg: 2 }} style={{ minWidth: 0 }}>
              <SectionHeading
                eyebrow="Business Dashboard"
                title="Income, expense & financial reports"
                subtitle="Get a clear, real-time picture of your school's finances. Track income, monitor expenses, and generate reports for stakeholders in seconds."
                center={false}
              />
              <List
                mt="lg"
                spacing="sm"
                size="sm"
                c="dark.6"
                icon={
                  <ThemeIcon color="blue" variant="light" size={28} radius="xl">
                    <BarChart3 size={14} />
                  </ThemeIcon>
                }
              >
                {[
                  'Live income & expense dashboard',
                  'Automated financial reports',
                  'Fee collection tracking',
                  'Budget vs. actual insights',
                ].map((item) => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* ═══ CRM ═════════════════════════════════════════════════════════════ */}
      <Box bg="white" py={SECTION_PY} px={SECTION_PX}>
        <Container size="xl">
          <Grid gutter="xl" align="center">
            <Grid.Col span={{ base: 12, lg: 5 }} style={{ minWidth: 0 }}>
              <SectionHeading
                eyebrow="CRM & Marketing"
                title="Never miss a prospective parent"
                subtitle="Capture leads, track inquiries, and integrate with Meta (Facebook) ads — all from one CRM built for schools."
                center={false}
              />
              <Stack gap="lg" mt="xl">
                {[
                  {
                    icon: Users,
                    title: 'Lead Management',
                    desc: 'Track every inquiry from first contact to admission with a visual pipeline.',
                  },
                  {
                    icon: Megaphone,
                    title: 'Meta Lead Integration',
                    desc: 'Auto-import Facebook & Instagram leads directly into your CRM.',
                  },
                  {
                    icon: ClipboardCheck,
                    title: 'Student Inquiry Tracking',
                    desc: 'Keep a complete history of every prospective student and parent.',
                  },
                ].map((c) => (
                  <Group key={c.title} align="flex-start" gap="md" wrap="nowrap">
                    <ThemeIcon color="blue" variant="light" size={44} radius="xl">
                      <c.icon size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={700} size="md" c="dark.9" mb={4}>{c.title}</Text>
                      <Text size="sm" c="dimmed" lh={1.6}>{c.desc}</Text>
                    </Box>
                  </Group>
                ))}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 7 }} style={{ minWidth: 0 }}>
              <AdmissionsPipelineMockup />
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* ═══ FREE BONUSES ════════════════════════════════════════════════════ */}
      <Box py={SECTION_PY} px={SECTION_PX} style={ALT_SECTION_BG}>
        <Container size="xl">
          <SectionHeading
            eyebrow="Included Free"
            title="Free Bonus With ShikshaPay Cloud"
            subtitle="Every plan includes these premium bonuses at no extra cost."
          />

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mt="xl">
            {BONUSES.map((b, idx) => (
              <Card
                key={b.title}
                radius="xl"
                p="xl"
                bg="white"
                className="lift-card fade-up"
                style={{
                  animationDelay: `${idx * 90}ms`,
                  border: '2px dashed var(--mantine-color-yellow-5)',
                  boxShadow: 'none',
                }}
              >
                <Box
                  mb="md"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: 'var(--mantine-color-yellow-0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <b.icon size={24} color="var(--mantine-color-yellow-7)" />
                </Box>
                <Text fw={700} c="dark.9" mb={6}>{b.title}</Text>
                <Text size="sm" c="dimmed" lh={1.6}>{b.desc}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ═══ PRICING ═════════════════════════════════════════════════════════ */}
      <Box id="pricing" bg="white" py={SECTION_PY} px={SECTION_PX}>
        <Container size="xl">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple & Transparent Pricing"
            subtitle="Choose the plan that fits your school. No hidden charges, ever."
          />

          <Grid gutter="lg" mt="xl" justify="center">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Card withBorder radius="xl" p="xl" shadow="sm" h="100%" className="lift-card fade-up">
                <Stack gap="md" h="100%">
                  <Badge color="blue" variant="light" size="md" w="fit-content">
                    Subscription
                  </Badge>
                  <Group align="flex-end" gap={4}>
                    <Title order={1} c="dark.9">₹2</Title>
                    <Text size="sm" c="dimmed" mb={6}>/ student / month</Text>
                  </Group>
                  <Text size="sm" c="teal" fw={600}>No hidden charges.</Text>
                  <Divider />
                  <List
                    spacing={10}
                    size="sm"
                    c="dark.6"
                    icon={
                      <ThemeIcon color="blue" size={20} radius="xl" variant="light">
                        <CheckCircle2 size={12} />
                      </ThemeIcon>
                    }
                    style={{ flex: 1 }}
                  >
                    {[
                      'All ERP & CRM modules included',
                      'Parent mobile app',
                      'WhatsApp notifications',
                      'Free onboarding & support',
                      'All free bonuses included',
                    ].map((f) => (
                      <List.Item key={f}>{f}</List.Item>
                    ))}
                  </List>
                  <Button
                    component="a"
                    href="#final-cta"
                    size="md"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                    rightSection={<ArrowRight size={16} />}
                    radius="xl"
                    fullWidth
                    mt="auto"
                  >
                    Get Started
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Card
                withBorder
                radius="xl"
                p="xl"
                pt={rem(40)}
                shadow="xl"
                h="100%"
                className="lift-card fade-up"
                style={{ borderColor: 'var(--mantine-color-violet-5)', borderWidth: 2, animationDelay: '120ms' }}
                pos="relative"
              >
                <Badge
                  pos="absolute"
                  top={rem(-16)}
                  left={rem(24)}
                  size="md"
                  leftSection={<Sparkles size={11} />}
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'blue', deg: 135 }}
                  style={{ boxShadow: '0 4px 10px rgba(112,72,232,0.35)' }}
                >
                  Best Value
                </Badge>
                <Stack gap="md" h="100%">
                  <Badge color="violet" variant="light" size="md" w="fit-content">
                    Lifetime Ownership
                  </Badge>
                  <Group align="flex-end" gap={4}>
                    <Title order={1} c="dark.9">₹30,000</Title>
                    <Text size="sm" c="dimmed" mb={6}>one-time</Text>
                  </Group>
                  <Text size="sm" c="violet" fw={600}>+ ₹1,000/month maintenance</Text>
                  <Divider />
                  <List
                    spacing={10}
                    size="sm"
                    c="dark.6"
                    icon={
                      <ThemeIcon color="violet" size={20} radius="xl" variant="light">
                        <CheckCircle2 size={12} />
                      </ThemeIcon>
                    }
                    style={{ flex: 1 }}
                  >
                    {[
                      'Complete software ownership',
                      'All modules, no recurring license fee',
                      'Suitable for lifetime ownership preference',
                      'Priority support included',
                      'All free bonuses included',
                    ].map((f) => (
                      <List.Item key={f}>{f}</List.Item>
                    ))}
                  </List>
                  <Button
                    component="a"
                    href="#final-cta"
                    size="md"
                    variant="filled"
                    color="dark"
                    rightSection={<ArrowRight size={16} />}
                    radius="xl"
                    fullWidth
                    mt="auto"
                  >
                    Talk to Our Team
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* ═══ LIVE DEMO ═══════════════════════════════════════════════════════ */}
      <Box
        id="demo"
        py={SECTION_PY}
        px={SECTION_PX}
        style={{ ...ALT_SECTION_BG, position: 'relative', overflow: 'hidden' }}
      >
        <Box
          pos="absolute"
          top={-90}
          left={-70}
          w={280}
          h={280}
          style={{
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(112,72,232,0.16), transparent 70%)',
            filter: 'blur(10px)',
            animation: 'blobDrift 10s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <Box
          pos="absolute"
          bottom={-100}
          right={-80}
          w={320}
          h={320}
          style={{
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25,113,194,0.14), transparent 70%)',
            filter: 'blur(10px)',
            animation: 'blobDrift 12s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }}
        />
        <Container size="lg" ref={demoRef} style={{ position: 'relative' }}>
          <Box className={`reveal-card${demoInView ? ' in-view' : ''}`}>
            <SectionHeading
              eyebrow="Live Demo"
              title="See ShikshaPay Cloud in Action"
              subtitle="Watch the official walkthrough of the complete platform — dashboard, modules, parent app and CRM."
            />
          </Box>
          
          <Box
            className={`reveal-card${demoInView ? ' in-view' : ''}`}
            mt="xl"
            style={{ animationDelay: '150ms', position: 'relative' }}
          >
            <Paper
              radius="xl"
              style={{ 
                overflow: 'hidden', 
                background: '#0f172a', 
                position: 'relative', 
                zIndex: 1,
                animation: 'videoGlow 4s ease-in-out infinite',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <Box style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                  src="https://www.youtube.com/embed/sDNkhTZAeS4"
                  title="ShikshaPay Cloud Live CRM Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            </Paper>

            <Group justify="center" gap="xl" mt="xl" pt="sm">
              <Group gap="xs">
                <ThemeIcon size={20} radius="xl" color="blue" variant="light">
                  <Check size={14} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" fw={500}>No hidden charges</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon size={20} radius="xl" color="blue" variant="light">
                  <Check size={14} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" fw={500}>Free onboarding</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon size={20} radius="xl" color="blue" variant="light">
                  <Check size={14} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" fw={500}>24/7 Premium Support</Text>
              </Group>
            </Group>
          </Box>
        </Container>
      </Box>

      {/* ═══ FINAL CTA ═══════════════════════════════════════════════════════ */}
      <Box
        id="final-cta"
        py={SECTION_PY}
        px={SECTION_PX}
        ta="center"
        style={{ ...ALT_SECTION_BG, position: 'relative', overflow: 'hidden' }}
      >
        <Box
          pos="absolute"
          top={-60}
          left="30%"
          w={360}
          h={360}
          style={{
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(76,81,230,0.14), transparent 70%)',
            animation: 'blobDrift 10s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <Box
          pos="absolute"
          bottom={-80}
          right="15%"
          w={300}
          h={300}
          style={{
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(112,72,232,0.14), transparent 70%)',
            animation: 'blobDrift 13s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }}
        />
        <Container size="md" ref={ctaRef} style={{ position: 'relative' }}>
          <Stack align="center" gap="lg" className={`reveal-card${ctaInView ? ' in-view' : ''}`}>
            
            <ThemeIcon
              size={56}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'blue', to: 'violet', deg: 135 }}
              style={{ animation: 'softPulse 2.4s ease-in-out infinite' }}
            >
              <GraduationCap size={28} />
            </ThemeIcon>

            <Title order={1} c="dark.9" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Book a Free Demo Today
            </Title>
            <Text c="dimmed" size="md" maw={480} lh={1.7}>
              Get a personalized walkthrough of ShikshaPay Cloud tailored for your school's needs.
            </Text>

            <Group gap="md" justify="center" mt="sm">
              <Card withBorder radius="xl" p="md" shadow="sm" className="hover-lift" style={{ cursor: 'pointer' }}>
                <Group gap="sm">
                  <ThemeIcon size={40} radius="lg" color="blue" variant="light">
                    <MessageCircle size={18} />
                  </ThemeIcon>
                  <Stack gap={2} align="flex-start">
                    <Text size="xs" tt="uppercase" c="dimmed" fw={500} style={{ letterSpacing: '0.06em' }}>
                      WhatsApp
                    </Text>
                    <Anchor href="https://wa.me/919416059799" c="dark.9" fw={700} size="md" underline="never">
                      9416059799
                    </Anchor>
                  </Stack>
                </Group>
              </Card>

              <Card withBorder radius="xl" p="md" shadow="sm" className="hover-lift" style={{ cursor: 'pointer' }}>
                <Group gap="sm">
                  <ThemeIcon size={40} radius="lg" color="blue" variant="light">
                    <Globe size={18} />
                  </ThemeIcon>
                  <Stack gap={2} align="flex-start">
                    <Text size="xs" tt="uppercase" c="dimmed" fw={500} style={{ letterSpacing: '0.06em' }}>
                      Website
                    </Text>
                    <Anchor href="https://shikshapay.cloud" c="dark.9" fw={700} size="md" underline="never">
                      shikshapay.cloud
                    </Anchor>
                  </Stack>
                </Group>
              </Card>
            </Group>

            <Text c="dimmed" size="sm" fw={600} mt="xs">
              <span style={{ opacity: 0.5 }}>—</span> Shiksha CRM Team <span style={{ opacity: 0.5 }}>—</span>
            </Text>

            <Group gap="sm" justify="center" mt="md">
              <Button
                component="a"
                href="https://wa.me/919416059799"
                size="md"
                variant="light"
                leftSection={<MessageCircle size={18} />}
                radius="xl"
                color="blue"
                className="btn-scale"
              >
                WhatsApp Us
              </Button>
              <Button
                component="a"
                href="tel:+919416059799"
                size="md"
                variant="gradient"
                gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                leftSection={<Phone size={18} />}
                radius="xl"
                className="btn-scale"
                style={{ boxShadow: '0 4px 14px rgba(76, 81, 230, 0.4)' }}
              >
                Book a Free Demo
              </Button>
              <Button
                component="a"
                href="#demo"
                size="md"
                variant="outline"
                color="gray"
                leftSection={<PlayCircle size={18} />}
                radius="xl"
                className="btn-scale"
              >
                Watch Live Demo
              </Button>
            </Group>

            <Text size="lg" fw={600} c="dark.9" fs="italic" mt="xl">
              "One Software. Complete School Management."
            </Text>
          </Stack>
        </Container>
      </Box>

      <style>
        {`
          @keyframes blobDrift {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes softPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(112, 72, 232, 0.4); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(112, 72, 232, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(112, 72, 232, 0); }
          }
          @keyframes videoGlow {
            0% { box-shadow: 0 0 25px rgba(76, 81, 230, 0.3), 0 0 50px rgba(112, 72, 232, 0.1); }
            50% { box-shadow: 0 0 40px rgba(76, 81, 230, 0.5), 0 0 80px rgba(112, 72, 232, 0.2); }
            100% { box-shadow: 0 0 25px rgba(76, 81, 230, 0.3), 0 0 50px rgba(112, 72, 232, 0.1); }
          }
          .hover-lift {
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
          }
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
          }
          .btn-scale {
            transition: transform 0.2s ease;
          }
          .btn-scale:hover {
            transform: scale(1.03);
          }
        `}
      </style>
    </Box>
  );
}