import { Van } from "@/interface/student.interface";
import { Stack, Table } from "@mantine/core";
import React from "react";

function VansPage(props: { allVans: Van[] }) {
  const rows = props.allVans.map((van: Van) => (
    <Table.Tr key={van._id}>
      <Table.Td>{van.vanNumber}</Table.Td>
      <Table.Td>{van.plateNumber}</Table.Td>
      <Table.Td>{van.driver.name}</Table.Td>
      <Table.Td>{van.students.length}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Stack>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead   bg={"linear-gradient(135deg, #D28BD9, #7585D8)"} c={"#333"}>
          <Table.Tr>
            <Table.Th>Van Number</Table.Th>
            <Table.Th>plateNumber</Table.Th>
            <Table.Th>Driver Name</Table.Th>
            <Table.Th>Total Students</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
}

export default VansPage;
