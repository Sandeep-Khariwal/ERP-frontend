import {
  Accordion,
  Container,
  Title,
  Text,
  Box,
  rem,
} from "@mantine/core";

const faqData = [
  {
    question: "What is SikshaPay?",
    answer:
      "SikshaPay is an EdTech payment platform designed to simplify fee management, online payments, and financial transparency for educational institutions and students.",
  },
  {
    question: "How secure are my transactions?",
    answer:
      "We use industry-standard encryption (SSL) and are compliant with RBI norms to ensure all your transactions are fully secure.",
  },
  {
    question: "Can parents track payment history?",
    answer:
      "Yes, SikshaPay provides a detailed dashboard for parents to view, download, and track all past and upcoming payments.",
  },
  {
    question: "How do I get support if I face issues?",
    answer:
      "You can contact our support team through the Contact Us page. We’re available 24/7 via email, WhatsApp, and phone.",
  },
  {
    question: "Is SikshaPay free for students?",
    answer:
      "Yes, SikshaPay is completely free for students. Schools or institutions cover the integration cost.",
  },
];

export default function FAQPage() {
  return (
    <Container
      size="md"
      py={{ base: "xl", sm: "2xl" }}
      id="FAQ"
      style={{
        scrollMarginTop: rem(80),
        overflow:"hidden"
      }}
    >
      <Box mb="lg">
        <Title
          order={2}
          ta="center"
          c="blue.6"
          style={{ fontSize: rem(28) }}
        >
          Frequently Asked Questions
        </Title>
        <Text ta="center" c="dimmed" size="sm">
          Answers to the most common questions about using SikshaPay.
        </Text>
      </Box>

      <Accordion
        variant="separated"
        radius="md"
        transitionDuration={300}
        defaultValue="faq-0"
      >
        {faqData.map((item, index) => (
          <Accordion.Item value={`faq-${index}`} key={index}>
            <Accordion.Control>{item.question}</Accordion.Control>
            <Accordion.Panel>{item.answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}
