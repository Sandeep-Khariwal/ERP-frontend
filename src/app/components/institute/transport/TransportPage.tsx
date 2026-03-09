"use client";
import {
  CreateDriver,
  CreateVan,
  GetAllVans
} from "@/axios/institute/transportApi";
import { Van } from "@/interface/student.interface";
import {
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  NumberInput,
  Stack,
  Tabs,
  Text,
  TextInput,

} from "@mantine/core";
import { Select } from "@mantine/core";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DriverPage from "./DriverPage";
import VansPage from "./VansPage";
import { useMediaQuery } from "@mantine/hooks";

interface Driver {
  name: string;
  address: string;
  phone: string;
  van: string;
}

function TransportPage() {
  const institute = useSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );
  const [openDriverModal, setOpenDriverModal] = useState<boolean>(false);
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [openVanModal, setOpenVanModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allVans, setAllVans] = useState<Van[]>([]);
  const [driverData, setDriverData] = useState<Driver>({
    name: "",
    address: "",
    phone: "",
    van: "",
   
  });
  const [vanData, setVanData] = useState<{
    vanNumber: number;
    plateNumber: string;
  }>({
    vanNumber: 0,
    plateNumber: "",
  });

  useEffect(() => {
    GetAllVans(institute._id)
      .then((x: any) => {
        setAllVans(x.data);
        setIsLoading(false);
      })
      .catch((e:any) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [institute]);

  const handleDriverChange = (field: keyof Driver, value: string) => {
    setDriverData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleVanChange = (
    field: keyof {
      vanNumber: number;
      plateNumber: string;
    },
    value: string | number
  ) => {
    setVanData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleDriverSubmit = () => {
    setIsLoading(true);
  
      CreateDriver({ ...driverData, institute: institute._id})
      .then((x: any) => {
        console.log("van resp : ", x);
        setIsLoading(false);
        setOpenDriverModal(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };
  const handleVanSubmit = () => {
    setIsLoading(true);
      CreateVan({...vanData,  institute: institute._id })
  
      .then((x: any) => {
        console.log("driver resp : ", x);
        setIsLoading(false);
        setOpenVanModal(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };
  return (
    <Stack w={"100%"} mih={"100vh"} p={"20px"}>
      <LoadingOverlay visible={isLoading} />
      <Flex
        w={"80%"}
        align={"center"}
        direction={isMd ? "column" : "row"}
        justify={"space-between"}
      >
        <Text fw={700} fz={isMd ? 22 : 26}>
          Transport Management
        </Text>
        <Flex
          w={isMd ? "100%" : "50%"}
          align={"center"}
          justify={"flex-end"}
          gap={20}
          mt={isMd ? 20 : 0}
        >
          <Button
            style={{ backgroundColor: "#305CDE" }}
            onClick={() => setOpenDriverModal(true)}
          >
            + Add Driver
          </Button>
          <Button
            style={{ backgroundColor: "#305CDE" }}
            onClick={() => setOpenVanModal(true)}
          >
            + Add Van
          </Button>
        </Flex>
      </Flex>

      <Stack w={"100%"}>
        <Tabs color="teal" defaultValue="drivers">
          <Tabs.List>
            <Tabs.Tab value="drivers">Drivers</Tabs.Tab>
            <Tabs.Tab value="vans" color="blue">
              Vans
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="drivers" pt="xs" style={{ overflow: "auto" }}>
            <DriverPage instituteId={institute._id ?? ""} />
          </Tabs.Panel>

          <Tabs.Panel value="vans" pt="xs" style={{ overflow: "auto" }}>
            <VansPage allVans={allVans} />
          </Tabs.Panel>
        </Tabs>
      </Stack>

      <Modal
        opened={openDriverModal}
        onClose={() => setOpenDriverModal(false)}
        title="Add New Driver"
        centered
        radius="lg"
      >
        <Stack>
          <TextInput
            label="Driver Name"
            placeholder="Enter driver name"
            value={driverData.name}
            onChange={(e) => handleDriverChange("name", e.currentTarget.value)}
          />
          <TextInput
            label="Address"
            placeholder="Enter address"
            value={driverData.address}
            onChange={(e) =>
              handleDriverChange("address", e.currentTarget.value)
            }
          />
          <TextInput
            label="Phone Number"
            placeholder="+91 XXXXX XXXXX"
            value={driverData.phone}
              maxLength={10}
  inputMode="numeric"
  pattern="[0-9]*"
  onChange={(e) => {
    const value = e.currentTarget.value.replace(/\D/g, ""); // sirf digits allow karega
    if (value.length <= 10) {
      handleDriverChange("phone", value);
    }
  }}
          />
          {/* <TextInput
            label="Van Number"
            placeholder="Enter van number"
            value={driverData.van}
            onChange={(e) => handleDriverChange("van", e.currentTarget.value)}
            
          /> */}
          <Select
  label="Select Van Number"
  placeholder="Choose van number"
  data={allVans.map((van) => ({
    value: van._id,          // backend me save hone ke liye
   label: `Van ${van.vanNumber}` // dropdown me sirf number dikhega
  }))}
  value={driverData.van}
  onChange={(value) => handleDriverChange("van", value || "")}
/>

          <Button fullWidth mt="md" onClick={handleDriverSubmit}>
            Save Driver
          </Button>
        </Stack>
      </Modal>
      <Modal
        opened={openVanModal}
        onClose={() => setOpenVanModal(false)}
        title="Add New Van"
        centered
        radius="lg"
      >
        <Stack>
          <NumberInput
            label="Van Number"
            placeholder="Enter van number"
            value={vanData.vanNumber}
            onChange={(val) => handleVanChange("vanNumber", val || 0)}
            hideControls
          />
          <TextInput
            label="Plate Number"
            placeholder="Enter plate number"
            value={vanData.plateNumber}
            onChange={(e) =>
              handleVanChange("plateNumber", e.currentTarget.value)
            }
          />

          <Button fullWidth mt="md" onClick={handleVanSubmit}>
            Save Van
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default TransportPage;
