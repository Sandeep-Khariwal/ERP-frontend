import { Van } from "@/interfaces/student.interface";
import { ScrollArea, Stack, Table } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

function VansPage(props: { allVans: Van[] }) {
  const isMobile = useMediaQuery("(max-width: 968px)");
  const rows = props.allVans.map((van: Van) => (
    <Table.Tr key={van._id}>
      <Table.Td>{van.vanNumber}</Table.Td>
      <Table.Td>{van.plateNumber}</Table.Td>
      <Table.Td>{van.driver?.name}</Table.Td>
      <Table.Td>{van.students.length}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Stack>
      <ScrollArea type="auto">
      <Table striped highlightOnHover withTableBorder withColumnBorders miw={isMobile ? 480 : undefined}>
        <Table.Thead   bg={"#EEF3FF"} c={"#333"}>
          <Table.Tr>
            <Table.Th style={{ fontFamily: "Roboto" }}>Van Number</Table.Th>
            <Table.Th style={{ fontFamily: "Roboto" }}>plateNumber</Table.Th>
            <Table.Th style={{ fontFamily: "Roboto" }}>Driver Name</Table.Th>
            <Table.Th style={{ fontFamily: "Roboto" }}>Total Students</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      </ScrollArea>
    </Stack>
  );
}

export default VansPage;
