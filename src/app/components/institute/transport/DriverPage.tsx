"use client";
import { GetAllDrivers } from "@/axios/institute/transportApi";
import { LoadingOverlay, Stack, Table } from "@mantine/core";
import React, { useEffect, useState } from "react";

interface Drivers {
  _id: string;
  name: string;
  phone: string;
  address: string;
  profilePhoto: string;
  institute: string;
  van: {
    plateNumber: string;
    vanNumber: number;
    _id: string;
  };
}

function DriverPage(props: { instituteId: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allDrivers, setAllDrivers] = useState<Drivers[]>([]);
  useEffect(() => {
    GetAllDrivers(props.instituteId)
      .then((x: any) => {
        console.log("all drivers: ", x);
        
        setAllDrivers(x.data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [props.instituteId]);

  const rows = allDrivers.map((driver: Drivers) => (
    <Table.Tr key={driver._id}>
      <Table.Td>{driver.name}</Table.Td>
      <Table.Td>{driver.phone}</Table.Td>
      <Table.Td>{driver.van?.vanNumber}</Table.Td>
      <Table.Td>{driver.van?.plateNumber}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Stack>
      <LoadingOverlay visible={isLoading} />

      <Table striped highlightOnHover withTableBorder withColumnBorders c={"gray"} >
        <Table.Thead   bg={"linear-gradient(135deg, #D28BD9, #7585D8)"} c={"#333"}>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Van Number</Table.Th>
            <Table.Th>Plate Number</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
}

export default DriverPage;
