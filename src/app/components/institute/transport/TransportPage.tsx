"use client";
import {
  ErrorNotification,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { useAppSelector } from "@/app/redux/redux.hooks";
import {
  CreateDriver,
  CreateVan,
  GetAllDrivers,
  GetAllInstituteVans,
} from "@/axios/institute/transportApi";
import {
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconUser } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import AllDrivers from "./AllDrivers";
import AllVans from "./AllVans";
import { UpdateGpsInfo } from "@/axios/institute/InstitutePutApi";
interface Driver {
  name: string;
  address: string;
  phone: string;
  van: string;
  institute?: string;
}

interface Van {
  vanNumber: number;
  plateNumber: string;
}

const TransportPage = () => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const [openedDriverModal, setOpenedDriverModal] = useState(false);
  const [openedVanModal, setOpenedVanModal] = useState(false);
  const [openedGpsModal, setOpenedGpsModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [allVans, setAllVans] = useState<{ _id: string; name: string }[]>([]);
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );

  const [driverData, setDriverData] = useState<Driver>({
    name: "",
    address: "",
    phone: "",
    van: "",
  });
  const [vanData, setVanData] = useState<Van>({
    vanNumber: 0,
    plateNumber: "",
  });
  const [gpsData, setGpsData] = useState<{ gpsUrl: string; gpsToken: string }>({
    gpsUrl: "",
    gpsToken: "",
  });

  useEffect(() => {
    setIsLoading(true);
    if (institute._id) {
      GetAllInstituteVans(institute._id)
        .then((x: any) => {
          const formateVans = x.data.filter((v:any)=> !v.driver).map((v: any) => {
            return { _id: v._id, name: "Van No " + v.vanNumber };
          });
          setAllVans(formateVans);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [institute]);

  const handleVanChange = (field: keyof Van, value: string | number) => {
    setVanData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVanSubmit = () => {
    if (!vanData.vanNumber || !vanData.plateNumber) {
      ErrorNotification("All fields are required!!");
      return;
    }
    CreateVan({ ...vanData, institute: institute._id })
      .then((x: any) => {
        SuccessNotification("Van Add!!");
        setOpenedVanModal(false);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setOpenedVanModal(false);
        const { message } = e.response.data;
        setIsLoading(false);
        ErrorNotification(message);
      });
  };

  const handleChange = (field: keyof Driver, value: string) => {
    setDriverData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!driverData.name || !driverData.phone || !driverData.address) {
      ErrorNotification("All fields are required!!");
      return;
    }
    setIsLoading(true);
    CreateDriver({ ...driverData, institute: institute._id })
      .then((x: any) => {
        SuccessNotification("Driver Add!!");
        setOpenedDriverModal(false);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setOpenedDriverModal(false);
        const { message } = e.response.data;
        setIsLoading(false);
        ErrorNotification(message);
      });
  };

  const handleGpsSubmit = () => {
    if (!gpsData.gpsUrl || !gpsData.gpsToken) {
      ErrorNotification("All fields are required!!");
      return;
    }
    UpdateGpsInfo(institute._id, gpsData)
      .then((x: any) => {
        SuccessNotification("GPS info Add!!");
        setOpenedGpsModal(false);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setOpenedGpsModal(false);
        const { message } = e.response.data;
        setIsLoading(false);
        ErrorNotification(message);
      });
  };

  return (
    <Stack
      w={"100%"}
      mih={"100vh"}
      bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
      mb={isMd ? 100 : 0}
      p={20}
    >
      <LoadingOverlay visible={isLoading} />
      <Flex direction={isMd?"column":"row"} w={"100%"} align={"center"} justify={"space-between"}>
        <Text fw={600} fz={isMd?24:32}>
          Transport Management
        </Text>
        <Flex w={isMd?"100%":"50%"} gap={isMd?5:20} align={"center"} justify={"center"}>
          <Button
            onClick={() => setOpenedDriverModal(true)}
            styles={{
              root: {
                backgroundColor: "#0f52ba",
                color: "#ffffff", // White text for contrast
                "&:hover": {
                  backgroundColor: "#0c47a1", // Slightly darker on hover
                },
              },
            }}
          >
            {
                isMd?"+ Driver":"+ Add Driver"
            }
          
          </Button>
          <Button
            onClick={() => setOpenedVanModal(true)}
            styles={{
              root: {
                backgroundColor: "#0f52ba",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#0c47a1",
                },
              },
            }}
          >
           {isMd?"+ Van":"+ Add Van"}
          </Button>
          <Button
            onClick={() => setOpenedGpsModal(true)}
            styles={{
              root: {
                backgroundColor: "#0f52ba",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#0c47a1",
                },
              },
            }}
          >
          {isMd?"+ Gps":"+ Add Gps"}
          </Button>
        </Flex>
      </Flex>

      <Tabs color="#0f52ba" defaultValue="driver">
        <Tabs.List>
          <Tabs.Tab value="driver">Driver</Tabs.Tab>
          <Tabs.Tab value="van" color="blue">
            Vans
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="driver" pt="xs">
          <AllDrivers instituteId={institute._id} />
        </Tabs.Panel>

        <Tabs.Panel value="van" pt="xs">
          <AllVans instituteId={institute._id} />
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={openedDriverModal}
        onClose={() => setOpenedDriverModal(false)}
        title="Add New Driver"
        centered
        radius="lg"
      >
        <Stack>
          <TextInput
            label="Driver Name"
            placeholder="Enter driver name"
            value={driverData.name}
            onChange={(e) => handleChange("name", e.currentTarget.value)}
          />
          <TextInput
            label="Address"
            placeholder="Enter address"
            value={driverData.address}
            onChange={(e) => handleChange("address", e.currentTarget.value)}
          />
          <TextInput
            label="Phone Number"
            placeholder="+91 XXXXX XXXXX"
            value={driverData.phone}
            onChange={(e) => handleChange("phone", e.currentTarget.value)}
          />
          <Select
            label="Assign Van "
            ff={"Poppins"}
            placeholder={`${allVans.length > 0?"Select Van No":"No van available"}`}
            value={driverData.van}
            data={
              allVans.length > 0
                ? allVans.map((van) => ({
                    value: van._id,
                    label: van.name,
                  }))
                : []
            }
            onChange={(selectedValues) => {
              setDriverData((prev: any) => {
                return {
                  ...prev,
                  van: selectedValues,
                };
              });
              // props.onChangeAssigningVan(selectedValues!!);
            }}
          />

          <Button
            fullWidth
            mt="md"
            onClick={handleSubmit}
            styles={{
              root: {
                backgroundColor: "#0f52ba",
                color: "#ffffff", // White text for contrast
                "&:hover": {
                  backgroundColor: "#0c47a1", // Slightly darker on hover
                },
              },
            }}
          >
            Save Driver
          </Button>
        </Stack>
      </Modal>
      <Modal
        opened={openedVanModal}
        onClose={() => setOpenedVanModal(false)}
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
              handleVanChange(
                "plateNumber",
                e.currentTarget.value.toUpperCase()
              )
            }
          />

          <Button
            fullWidth
            mt="md"
            onClick={handleVanSubmit}
            styles={{
              root: {
                backgroundColor: "#0f52ba",
                color: "#ffffff", // White text for contrast
                "&:hover": {
                  backgroundColor: "#0c47a1", // Slightly darker on hover
                },
              },
            }}
          >
            Save Van
          </Button>
        </Stack>
      </Modal>

      <Modal opened={openedGpsModal} title={"Add Gps Info"} onClose={() => setOpenedGpsModal(false)}>
        <Stack>
          <TextInput
            label="Enter API URL"
            placeholder="Enter API Url"
            value={gpsData.gpsUrl}
            onChange={(e) =>
              setGpsData((prev) => {
                return {
                  ...prev,
                  gpsUrl: e.currentTarget.value,
                };
              })
            }
          />
          <TextInput
            label="Enter Token"
            placeholder="Enter Token"
            value={gpsData.gpsToken}
            onChange={(e) =>
              setGpsData((prev) => {
                return {
                  ...prev,
                  gpsToken: e.currentTarget.value,
                };
              })
            }
          />
          <Button
            fullWidth
            mt="md"
            onClick={handleGpsSubmit}
            styles={{
              root: {
                backgroundColor: "#0f52ba",
                color: "#ffffff", // White text for contrast
                "&:hover": {
                  backgroundColor: "#0c47a1", // Slightly darker on hover
                },
              },
            }}
          >
            Save gps info
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default TransportPage;
