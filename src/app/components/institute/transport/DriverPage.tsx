"use client";
import { GetAllDrivers } from "@/axios/institute/transportApi";
import { LoadingOverlay, ScrollArea, Stack, Table } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
  const isMobile = useMediaQuery("(max-width: 968px)");
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

      <ScrollArea type="auto">
      <Table striped highlightOnHover withTableBorder withColumnBorders c={"gray"} miw={isMobile ? 480 : undefined}>
        <Table.Thead   bg={"#EEF3FF"} c={"#333"}>
          <Table.Tr>
            <Table.Th style={{ fontFamily: "Roboto" }}>Name</Table.Th>
            <Table.Th style={{ fontFamily: "Roboto" }}>Phone</Table.Th>
            <Table.Th style={{ fontFamily: "Roboto" }}>Van Number</Table.Th>
            <Table.Th style={{ fontFamily: "Roboto" }}>Plate Number</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      </ScrollArea>
    </Stack>
  );
}

export default DriverPage;
