import { GetAllInstituteVans } from "@/axios/institute/transportApi";
import { Flex, Menu, Stack, Table } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDotsVertical } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

interface vans {
  _id: string;
  vanNumber: number;
  plateNumber: string;
  driver: string;
  conductor?: string;
  students: number;
}

const AllVans = (props: { instituteId: string }) => {
  const [allVans, setAllVans] = useState<vans[]>([]);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  useEffect(() => {
    if (props.instituteId) {
      GetAllInstituteVans(props.instituteId)
        .then((x: any) => {
          const formateVans = x.data.map((v: any) => {
            return {
              ...v,
              driver: v.driver.name,
              students: v.students.length,
            };
          });
          setAllVans(formateVans);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.instituteId]);

  const rows = allVans.map((van: vans) => (
    <Table.Tr key={van._id}>
      <Table.Td>{van.vanNumber}</Table.Td>
      {!isMd && <Table.Td>{van.plateNumber}</Table.Td>}

      <Table.Td>{van.driver}</Table.Td>
      {!isMd && <Table.Td>{van.students}</Table.Td>}

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
      <Table highlightOnHover withTableBorder stripedColor="#F5F5F5">
        <Table.Thead
          bg={"linear-gradient(135deg, #D28BD9, #7585D8)"}
          style={{
            border: "2px solid transparent",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          <Table.Tr>
            <Table.Th>Van Number</Table.Th>
            {!isMd && <Table.Th>plateNumber</Table.Th>}
            <Table.Th>Driver</Table.Th>
            {!isMd && <Table.Th>Total students</Table.Th>}
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
};

export default AllVans;
