import { Card, Flex, Stack, Text } from "@mantine/core";
import { IconCurrencyRupee } from "@tabler/icons-react";

interface studentFeesCardsProps {
    totalFees: number;
    totalPaid: number;
    totalOverdue: number;
  }
  
export function StudentFeesCards(props: studentFeesCardsProps) {
    return (
      <>
        <SingleInstituteCard
          heading="Total Fees"
          displayNumber={props.totalFees}
          dashColor="#2563eb"
        />
        <SingleInstituteCard
          heading="Total Paid"
          displayNumber={props.totalPaid}
          dashColor="#0f9f78"
          icon={<IconCurrencyRupee />}
        />
        <SingleInstituteCard
          heading="Total Overdue"
          displayNumber={props.totalOverdue}
          dashColor="#e05252"
        />
      </>
    );
  }

  function SingleInstituteCard(props: {
    heading: string;
    displayNumber: number | string;
    dashColor: string;
    icon?: any;
  }) {
    function formatNumber(value: number): number | string {
      if (value < 1000) {
        return value;
      } else {
        return `${value / 1000}k`;
      }
    }
    return (
      <>
        <Card
          bg={"#FFFFFF"}
          radius={10}
          shadow="0 2px 8px rgba(20, 42, 76, 0.06)"
          h="100%"
          mih={104}
          w="100%"
          withBorder
          p={{ base: "sm", sm: "md" }}
          style={{ borderColor: "#e5eaf2", minWidth: 0 }}
        >
          <Stack
            style={{ borderLeft: `3px solid ${props.dashColor}`, minWidth: 0 }}
            px={10}
            h={"100%"}
            justify="center"
          >
            <Text c="#667085" fz={12} fw={600} w="100%">
              {props.heading}
            </Text>
            <Flex align="center">
              <Text fz={22} fw={700} c="#172033">
                {props.icon ? props.icon : ""}
                {formatNumber(Number(props.displayNumber))}
              </Text>
            </Flex>
          </Stack>
        </Card>
      </>
    );
  }
