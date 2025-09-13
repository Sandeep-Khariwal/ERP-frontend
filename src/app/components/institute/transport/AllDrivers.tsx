"use client";
import { useAppSelector } from "@/app/redux/redux.hooks";
import { GetAllDrivers } from "@/axios/institute/transportApi";
import { Flex, Menu, Stack, Table } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDotsVertical } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

interface Drivers {
  _id: string;
  name: string;
  profilePhoto: string;
  address: string;
  phone: string;
  van: {
    _id: string;
    vanNumber: string;
    plateNumber: string;
  };
}

const AllDrivers = (props: { instituteId: string }) => {
  const [allDrivers, setAllDrivers] = useState<Drivers[]>([]);
  const isMd = useMediaQuery(`(max-width: 968px)`);

  useEffect(() => {
    if (props.instituteId) {
      GetAllDrivers(props.instituteId)
        .then((x: any) => {
          const drivers = x.data;
          setAllDrivers(drivers);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.instituteId]);
  const rows = allDrivers.map((driver: Drivers) => (
    <Table.Tr key={driver.van.plateNumber}>
      <Table.Td>{driver.name}</Table.Td>
      {!isMd && <Table.Td>{driver.phone}</Table.Td>}
      {!isMd && <Table.Td>{driver.address}</Table.Td>}
      <Table.Td ta={"center"} >{driver.van.vanNumber}</Table.Td>
      {!isMd && <Table.Td>{driver.van.plateNumber}</Table.Td>}
      <Table.Td>
        <Menu>
          <Menu.Target>
            <Flex
              align={"center"}
              justify={"center"}
              w={"2rem"}
              py={3}
              bg="#FFFFFF"
            >
              <IconDotsVertical />
            </Flex>
          </Menu.Target>
          <Menu.Dropdown></Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Stack w={"100%"} mih={"100vh"}>
      <Table highlightOnHover withTableBorder stripedColor="white">
        <Table.Thead
          bg={"linear-gradient(135deg, #D28BD9, #7585D8)"}
          style={{
            border: "2px solid transparent",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          <Table.Tr>
            <Table.Th>Driver Name</Table.Th>
            {!isMd && <Table.Th>Phone</Table.Th>}
            {!isMd && <Table.Th>Address</Table.Th>}
            <Table.Th>Van Number</Table.Th>
            {!isMd && <Table.Th>Plate Number</Table.Th>}

            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
};

export default AllDrivers;
