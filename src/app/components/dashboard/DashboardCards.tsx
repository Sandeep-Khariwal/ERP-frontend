"use client";
import { ErrorNotification, SuccessNotification } from "@/app/helperFunction/Notification";
import {
  Box,
  Card,
  Center,
  Flex,
  Button,
  Menu,
  Text,
  TextInput,
  Modal,
} from "@mantine/core";
import {
  IconCheck,
  IconDotsVertical,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UserType } from "./InstituteBatchesSection";
import { PromoteBatch, SetPassoutBatch } from "@/axios/batch/BatchPutApi";

export function SingleBatchCard(props: {
  id: string;
  name: string;
  noOfStudents: number;
  allBatches: {
    id: string;
    name: string;
  }[];
  firstThreeStudents: string[];
  userType: UserType;
  onbatchCardClick: () => void;
  onEditBatchName: (val: string) => void;
  onEditCourseFees: () => void;
  subjects: string[];
  noOfTeachers: number;
  firstThreeTeachers: string[];
  hasNextButton: boolean;
  showVerticalIcon: boolean;
  onEditBatchButtonClick: () => void;
  setDeleteBatchId: (batchId: string) => void;
  setDeleteModal: (val: boolean) => void;
}) {
  const [isnameEdit, setIsnameEdit] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>(props.name);

  const [passoutModal, setPassoutModal] = useState(false);
  const [confirmPassout, setConfirmPassout] = useState(false);
  const [passoutLoading, setPassoutLoading] = useState(false);


  const [promoteModal, setPromoteModal] = useState(false);

  const [selectedNextBatchId, setSelectedNextBatchId] = useState("");

  const [confirmPromote, setConfirmPromote] = useState(false);

  const [promoteLoading, setPromoteLoading] = useState(false);

  useEffect(() => {
    if (!confirmPassout) return;
    setPassoutLoading(true);

    SetPassoutBatch(props.id)
      .then((response: any) => {
        setConfirmPassout(false);
        setPassoutLoading(false);
        setPassoutModal(false);
        SuccessNotification("Batch Passout Successfully");
      })
      .catch((error: any) => {

        setConfirmPassout(false);
        setPassoutLoading(false);
        setPassoutModal(false);


        ErrorNotification(
          error?.response?.data?.message || "Something went wrong"
        );
      });

  }, [confirmPassout]);


  useEffect(() => {
    if (!confirmPromote) return;

    setPromoteLoading(true);

    PromoteBatch(props.id, selectedNextBatchId)
      .then((response: any) => {

        setConfirmPromote(false);
        setPromoteLoading(false);
        setPromoteModal(false);

        SuccessNotification("Batch Promoted Successfully");
      })
      .catch((error: any) => {

        setConfirmPromote(false);
        setPromoteLoading(false);
        setPromoteModal(false);

        ErrorNotification(
          error?.response?.data?.message || "Something went wrong"
        );
      });

  }, [confirmPromote]);

  return (
    <>
      <Card
        shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
        bg={"#FFFFFF"}
        h={"100%"}
        p={20}
        w={"100%"}
        onClick={() => {
          if (passoutModal || promoteModal) return;

          props.onbatchCardClick();
        }}
        style={{
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        <Modal
          opened={passoutModal}
          onClose={() => setPassoutModal(false)}
          centered
          closeOnClickOutside={false}
          withCloseButton={false}
          padding={30}
          radius={20}
        >
          <Flex direction="column" align="center">
            <Box
              style={{
                width: 85,
                height: 85,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #8E24AA 0%, #5E35B1 100%)",
                boxShadow: "0px 10px 25px rgba(126, 87, 194, 0.25)",
              }}
            >
              <Flex justify="center" align="center" h="100%">
                <Image
                  src={"/passoutImg2.png"}
                  alt="passout"
                  width={40}
                  height={40}
                />
              </Flex>
            </Box>

            <Text
              fz={26}
              fw={700}
              mt={22}
              c="#2E2E2E"
              style={{
                fontFamily: "Poppins",
              }}
            >
              Passout Batch
            </Text>

            <Text
              ta="center"
              c="#7B7B7B"
              mt={10}
              fz={15}
              maw={320}
              lh={1.6}
              style={{
                fontFamily: "Nunito",
              }}
            >
              Students from this batch will be marked as passout.
              Please confirm before continuing.
            </Text>

            <Flex justify="center" mt={30} gap={14} w="100%">
              <Button
                variant="light"
                color="gray"
                radius="xl"
                size="md"
                px={28}
                styles={{
                  root: {
                    fontWeight: 600,
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPassoutModal(false);
                }}
              >
                Cancel
              </Button>

              <Button
                radius="xl"
                size="md"
                px={30}
                loading={passoutLoading}
                styles={{
                  root: {
                    background:
                      "linear-gradient(135deg, #8E24AA 0%, #5E35B1 100%)",
                    fontWeight: 600,
                    boxShadow:
                      "0px 8px 20px rgba(126, 87, 194, 0.30)",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmPassout(true);
                }}
              >
                Confirm
              </Button>
            </Flex>
          </Flex>
        </Modal>
        <Modal
          opened={promoteModal}
          size={1100}
          onClose={() => setPromoteModal(false)}
          centered
          closeOnClickOutside={false}
          closeButtonProps={{
            style: {
              background: "#F3E8FF",
              borderRadius: "50%",
              color: "#7E57C2",
            },
          }}
          padding={30}
          styles={{
            body: {
              overflow: "hidden",
            },
          }}
          radius={20}
        >
          <Flex direction="column">
            <Flex direction="column" align="center" mb={20}>
              <Box
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #8E24AA 0%, #5E35B1 100%)",
                  boxShadow:
                    "0px 10px 25px rgba(126, 87, 194, 0.25)",
                }}
              >
                <Flex justify="center" align="center" h="100%">
                  <Text fz={34}>🎓</Text>
                </Flex>
              </Box>

              <Text
                fz={25}
                fw={700}
                mt={18}
                style={{
                  fontFamily: "Poppins",
                }}
              >
                Promote Batch
              </Text>

              <Text
                ta="center"
                c="#7B7B7B"
                fz={15}
                mt={8}
                maw={330}
                lh={1.6}
                style={{
                  fontFamily: "Nunito",
                }}
              >
                Select the next batch where students should
                be promoted.
              </Text>
            </Flex>

            <Flex
              wrap="wrap"
              gap={14}
              justify="center"
            >
              {props.allBatches
                .filter((batch) => batch.id !== props.id)
                .map((batch) => (
                  <Box
                    key={batch.id}
                    w="31%"
                    style={{
                      minWidth: "220px",
                    }}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      p={16}
                      style={{
                        border:
                          selectedNextBatchId === batch.id
                            ? "2px solid #7E57C2"
                            : "1px solid #ECECEC",
                        borderRadius: "16px",
                        cursor: "pointer",
                        background:
                          selectedNextBatchId === batch.id
                            ? "#F5EEFF"
                            : "#FFFFFF",
                        transition: "0.2s ease",
                        minHeight: "85px",
                      }}
                      onClick={() => {
                        setSelectedNextBatchId(batch.id);
                      }}
                    >
                      <Flex direction="column">
                        <Text
                          fw={700}
                          fz={16}
                          c="#2E2E2E"
                          style={{
                            fontFamily: "Poppins",
                          }}
                        >
                          {batch.name}
                        </Text>

                        <Text
                          fz={13}
                          c="#8B8B8B"
                          mt={2}
                          style={{
                            fontFamily: "Nunito",
                          }}
                        >
                          Promote students into this batch
                        </Text>
                      </Flex>

                      <Box
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border:
                            selectedNextBatchId === batch.id
                              ? "7px solid #7E57C2"
                              : "2px solid #D1D1D1",
                          transition: "0.2s ease",
                          flexShrink: 0,
                        }}
                      />
                    </Flex>
                  </Box>
                ))}
            </Flex>

            <Button
              mt={28}
              size="md"
              radius="xl"
              fullWidth
              loading={promoteLoading}
              disabled={!selectedNextBatchId}
              styles={{
                root: {
                  background:
                    "linear-gradient(135deg, #8E24AA 0%, #5E35B1 100%)",
                  fontWeight: 700,
                  height: 48,
                  boxShadow:
                    "0px 10px 24px rgba(126, 87, 194, 0.25)",
                },
              }}
              onClick={() => {
                if (!selectedNextBatchId) {
                  ErrorNotification("Please select batch");
                  return;
                }

                setConfirmPromote(false);

                setTimeout(() => {
                  setConfirmPromote(true);
                }, 0);
              }}
            >
              Promote Students
            </Button>
          </Flex>
        </Modal>
        {
          props.userType === UserType.OTHERS &&

          <Flex justify="space-between" align="center" ml={5} mr={5}>
            {!isnameEdit && (
              <Text
                fz={22}
                fw={500}
                c={"#36431F"}
                style={{
                  whiteSpace: "nowrap",
                  maxWidth: "70%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontFamily: "Roboto",
                }}
              >
                {props.name}
              </Text>
            )}
            {isnameEdit && (
              <NameEditor
                fileName={nameValue}
                setOnRenameClicked={setIsnameEdit}
                onRenameClick={(val: string) => {
                  if (props.onEditBatchName) props.onEditBatchName(val);
                }}
              />
            )}
            {
              <Menu>
                <Menu.Target>
                  {
                    props.showVerticalIcon ?

                      <Flex
                        style={{ cursor: "pointer" }}
                        justify="center"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <IconDotsVertical />
                      </Flex>
                      : <Text></Text>
                  }
                </Menu.Target>
                <Menu.Dropdown
                  mr={50}
                // style={{
                //   position: "absolute",
                //   top: "100%",
                //   marginTop: -20,
                //   marginLeft: -50,
                // }}
                >
                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsnameEdit(true);
                    }}
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <Box mr={2}>
                          <Image
                            src={"/renameImg.png"}
                            alt="profile"
                            width={20}
                            height={20}
                          />
                        </Box>
                      </Flex>
                      <Text
                        fz={16}
                        fw={500}
                        ml={10}
                        style={{ fontFamily: "Roboto" }}
                      >
                        Rename
                      </Text>
                    </Flex>
                  </Menu.Item>
                  {
                    <Menu.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onEditCourseFees();
                      }}
                    >
                      <Flex align="center">
                        <Flex align="center">
                          <Box mr={2}>
                            <Image
                              src={"/editImg.png"}
                              alt="profile"
                              width={20}
                              height={20}
                            />
                          </Box>
                        </Flex>
                        <Text
                          fz={16}
                          fw={500}
                          ml={10}
                          style={{ fontFamily: "Roboto" }}
                        >
                          Edit Course Fees
                        </Text>
                      </Flex>
                    </Menu.Item>
                  }
                  {/* <Menu.Item
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onEditBatchButtonClick();
                  }}
                >
                  <Flex align="center">
                    <Flex align="center">
                      <Box mr={2}>
                        <Image
                          src={"/editImg.png"}
                          alt="profile"
                          width={20}
                          height={20}
                        />
                      </Box>
                    </Flex>
                    <Text
                      fz={16}
                      fw={500}
                      ml={10}
                      style={{ fontFamily: "Roboto" }}
                    >
                      Edit Batch
                    </Text>
                  </Flex>
                </Menu.Item> */}

                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      setPromoteModal(true);
                    }}
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <Box mr={2}>
                          <Image
                            src={"/promoteImg.png"}
                            alt="promote"
                            width={30}
                            height={30}
                            style={{
                              objectFit: "contain",
                            }}
                          />
                        </Box>
                      </Flex>

                      <Text
                        fz={16}
                        fw={500}
                        ml={10}
                        style={{ fontFamily: "Roboto" }}
                      >
                        Promote Batch
                      </Text>
                    </Flex>
                  </Menu.Item>

                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      setPassoutModal(true);
                    }}
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <Box mr={2}>
                          <Image
                            src={"/passoutImg2.png"}
                            alt="profile"
                            width={20}
                            height={20}
                          />
                        </Box>
                      </Flex>
                      <Text
                        fz={16}
                        fw={500}
                        ml={10}
                        style={{ fontFamily: "Roboto" }}
                      >
                        Passout Batch
                      </Text>
                    </Flex>
                  </Menu.Item>
                  <Menu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      props.setDeleteBatchId(props.id);
                      props.setDeleteModal(true);
                    }}
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <Box mr={2}>
                          <Image
                            src={"/deleteImg.png"}
                            alt="profile"
                            width={20}
                            height={20}
                          />
                        </Box>
                      </Flex>
                      <Text
                        fz={16}
                        fw={500}
                        ml={10}
                        style={{ fontFamily: "Roboto" }}
                      >
                        Delete Batch
                      </Text>
                    </Flex>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            }
          </Flex>
        }
        <Flex direction="column" ml={5}>
          <Flex>
            <Text mr={4} fz={12} fw={500} c="#8F8F8F">
              {props.subjects.length > 6
                ? `${props.subjects.slice(0, 6).join(", ")}...`
                : props.subjects.join(", ")}
            </Text>
          </Flex>
          <Flex mt={10}>
            <Flex>
              {props.firstThreeStudents.length > 0 ? (
                props.firstThreeStudents.map((student: any, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#9C27B0",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      color: "white",
                    }}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      style={{ height: "100%" }}
                    >
                      <Text fz={14} fw={500}>
                        {" "}
                        {student.name[0]}{" "}
                      </Text>
                    </Flex>
                  </div>
                ))
              ) : props.id.startsWith("ICLS") ? (
                <Text fz={14} fw={700} mt={3} style={{ fontFamily: "Roboto" }}>
                  Add Students
                </Text>
              ) : (
                <></>
              )}
            </Flex>

            {props.firstThreeStudents.length > 0 ? (
              <Text
                fz={14}
                fw={600}
                ml={6}
                mt={4}
                style={{ fontFamily: "Nunito" }}
              >
                {props.noOfStudents - 3 > 0
                  ? `+${props.noOfStudents - 3}`
                  : props.noOfStudents}{" "}
                students{" "}
              </Text>
            ) : (
              ""
            )}
          </Flex>
          <Flex mt={5}>
            <Flex>
              {props.firstThreeTeachers.map((teacher: any, index) => (
                <Box
                  key={index}
                  style={{
                    backgroundColor: "#3F51B5",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    color: "white",
                  }}
                >
                  <Flex
                    align="center"
                    justify="center"
                    style={{ height: "100%" }}
                  >
                    <Text fz={14} fw={500} c={"white"} >
                      {teacher.name[0]}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Flex>
            {props.firstThreeTeachers.length > 0 ? (
              <Text
                fz={14}
                fw={600}
                ml={6}
                mt={4}
                style={{ fontFamily: "Nunito" }}
              >
                {props.noOfTeachers - 3 > 0
                  ? `+${props.noOfTeachers - 3}`
                  : props.noOfTeachers}{" "}
                teachers{" "}
              </Text>
            ) : (
              ""
            )}
          </Flex>
        </Flex>
      </Card>
    </>
  );
}

export function AddCardWithButton(props: {
  onAddBatchButtonClick: () => void;
}) {
  return (
    <>
      <Card
        radius={10}
        bg={"#FFFFFF"}
        h={"100%"}
        p={20}
        shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
      >
        <Center mt={30}>
          <Flex direction="column" justify="center" align="center">
            <Image
              src={"/classroom.png"}
              width={70}
              height={70}
              alt="classroom"
            />
            <Button
              size="sm"
              style={{
                backgroundColor: "#f7f7ff",
                color: "black",
                borderRadius: "20px",
                border: "1px solid #808080",
                marginTop: "10px",
              }}
              onClick={props.onAddBatchButtonClick}
            >
              <Text fz={16} fw={700} c={"#353935"} ff={"Poppins"}>
                Add Batch
              </Text>
            </Button>
          </Flex>
        </Center>
      </Card>
    </>
  );
}

export function NameEditor(props: {
  fileName: string;
  setOnRenameClicked: (val: boolean) => void;
  onRenameClick: (val: string) => void;
}) {
  const [value, setValue] = useState<string>(props.fileName);
  return (
    <Flex
      align="center"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <TextInput
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
        styles={{
          input: {
            fontSize: "22px",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid black",
            borderRadius: "0px",
            "&:focus-within": {
              borderBottom: "1px solid black",
            },
          },
        }}
      />
      <IconCheck
        onClick={() => {
          if (!value) {
            ErrorNotification("Name is required!!");
            return;
          }
          props.setOnRenameClicked(false);
          props.onRenameClick(value);
        }}
        style={{
          cursor: "pointer",
          width: "10vh",
        }}
      />
      <IconX
        onClick={() => {
          props.setOnRenameClicked(false);
        }}
        style={{
          cursor: "pointer",
          width: "10vh",
        }}
      />
    </Flex>
  );
}
