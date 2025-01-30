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
          dashColor="#B54BF6"
        />
        <SingleInstituteCard
          heading="Total Paid"
          displayNumber={props.totalPaid}
          dashColor="#F64BAE"
          icon={<IconCurrencyRupee />}
        />
        <SingleInstituteCard
          heading="Total Overdue"
          displayNumber={props.totalOverdue}
          dashColor="#F6714B"
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
          shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
          h={90}
          w={175}
        >
          <Stack
            style={{ borderLeft: `4px solid ${props.dashColor}` }}
            px={8}
            h={"100%"}
          >
            <Text c={"#ABABAB"} fz={14} fw={500} w="100%">
              {props.heading}
            </Text>
            <Flex align="center">
              <Text fz={20} fw={500}>
                {props.icon ? props.icon : ""}
                {formatNumber(Number(props.displayNumber))}
              </Text>
            </Flex>
          </Stack>
        </Card>
      </>
    );
  }
