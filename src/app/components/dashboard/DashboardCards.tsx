"use client";
import { ErrorNotification } from "@/app/helperFunction/Notification";
import {
  Box,
  Card,
  Center,
  Flex,
  Button,
  Menu,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconCheck,
  IconDotsVertical,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import {  useState } from "react";

export function SingleBatchCard(props: {
  id: string;
  name: string;
  noOfStudents: number;
  firstThreeStudents: string[];
  userType: any;
  onbatchCardClick: () => void;
  onEditBatchName: (val: string) => void;
  onEditCourseFees: () => void;
  subjects: string[];
  noOfTeachers: number;
  firstThreeTeachers: string[];
  hasNextButton: boolean;
  onEditBatchButtonClick: () => void;
  setDeleteBatchId: (batchId: string) => void;
  setDeleteModal: (val: boolean) => void;
}) {
  const [isnameEdit, setIsnameEdit] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>(props.name);
  return (
    <>
      <Card
        shadow="0px 0px 30px 0px rgba(0, 0, 0, 0.10)"
        bg={"#FFFFFF"}
        h={"100%"}
        p={20}
        w={"100%"}
        onClick={() => {
          props.onbatchCardClick();
        }}
        style={{
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
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
                <Flex
                  style={{ cursor: "pointer" }}
                  justify="center"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <IconDotsVertical />
                </Flex>
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
                <Menu.Item
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
                props.firstThreeStudents.map((student:any, index) => (
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
              {props.firstThreeTeachers.map((teacher:any, index) => (
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
