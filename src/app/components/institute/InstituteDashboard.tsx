"use client";

import {
  Box,
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Modal,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { InstituteProfile } from "../dashboard/InstituteStaff";
import { InstituteDetailsCards } from "../dashboard/InstituteDetailsCards";
import { InstituteBatchesSection } from "../dashboard/InstituteBatchesSection";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  CreateBatchAndSubjects,
  GetAccountByToken,
  GetInstituteBatches,
} from "@/app/api/institute/instituteSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { setAdminDetails } from "@/app/redux/adminSlice";
import { EditCourseFeeModal } from "./EditCourseFeeModal";
import { InstituteInsideBatch } from "./insideBatch/InstituteInsideBatch";
import {
  ErrorNotification,
  hasCommonUniqueElement,
} from "@/app/helperFunction/Notification";
import {
  notifications,
  Notifications,
  useNotifications,
} from "@mantine/notifications";
import {
  IconArrowBadgeDown,
  IconArrowDown,
  IconBadge4kFilled,
  IconCaretDown,
  IconCaretDownFilled,
} from "@tabler/icons-react";

interface Batch {
  id: string;
  name: string;
  subjects: { _id: string; name: string }[];
  noOfTeachers: number;
  noOfStudents: number;
  firstThreeTeachers: string[];
  firstThreeStudents: string[];
}

export const InstituteDashboard = () => {
  const isMd = useMediaQuery(`(max-width: 968px)`);
  const isLg = useMediaQuery(`(max-width: 1024px)`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openAddBatchModal, setOpenAddBatchModal] = useState<boolean>(false);
  const [openEditCourseFee, setOpenEditCourseFee] = useState<boolean>(false);
  const [batchName, setBatchName] = useState<string>("");
  const dispatch = useAppDispatch();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedOptionalSubjects, setSelectedOptionalSubjects] = useState<
    string[]
  >([]);
  const admin = useAppSelector((state: any) => state.adminSlice.adminDetails);

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>();
  const [batchId, setBatchId] = useState<string | null>(null);


  useEffect(() => {
    setIsLoading(true);
    GetAccountByToken()
      .then((x: any) => {
        const { data } = x;
        setIsLoading(false);
        dispatch(
          setAdminDetails({
            name: data.name,
            _id: data._id,
            phone: data.phone,
            institute: data.institute,
          })
        );
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (admin?.institute?._id!!) {
      setIsLoading(true);
      GetInstituteBatches(admin.institute._id)
        .then((x: any) => {
          const { batches } = x;
          setIsLoading(false);
          const allBatches = batches.map((b:any)=>{
            return {
              id: b._id,
              name: b.name,
              subjects: b.subjects,
              noOfTeachers: b.teachers.length,
              noOfStudents: b.students.length,
              firstThreeTeachers: b.teachers.slice(0,2),
              firstThreeStudents: b.students.slice(0,2)
            }
          })
          setBatches(allBatches);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    }
  }, [admin?.institute?._id!!]);

  const [data, setData] = useState<{ value: string; label: string }[]>([
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
    { value: "Science", label: "Science" },
    { value: "Social science", label: "Social science" },
    { value: "EVS", label: "EVS" },
    { value: "G.K.", label: "G.K." },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Biology", label: "Biology" },
    { value: "IT", label: "IT" },
  ]);
  const toggleAddBatchModal = () => {};
  const createBatch = () => {
    if (hasCommonUniqueElement(selectedSubjects, selectedOptionalSubjects)) {
      ErrorNotification("Subjects and optional subjects should not same!");
      return;
    }
    if (!batchName) {
      ErrorNotification("Batch name is required!");
      return;
    }
    setIsLoading(true);
    CreateBatchAndSubjects({
      batchName,
      subjects: selectedSubjects,
      optionalSubjects: selectedOptionalSubjects,
      instituteId: admin.institute._id,
    })
      .then((x: any) => {
        const { batch } = x;
        const newBatch = {
          id: batch._id,
          name: batch.name,
          subjects: batch.subjects,
          noOfTeachers: batch.teachers.length,
          noOfStudents: batch.students.length,
          firstThreeTeachers: batch.teachers.splice(0, 3),
          firstThreeStudents: batch.students.splice(0, 3),
        };
        setOpenAddBatchModal(false);
        setOpenEditCourseFee(true);
        setIsLoading(false);
      })
      .catch((e) => {
        setOpenAddBatchModal(false);
        setIsLoading(false);
        console.log(e);
      });
  };
  const onSelectSubjects = (data: string[]) => {
    setSelectedSubjects(data);
  };

  return (
    <>
      <Notifications />
      <LoadingOverlay visible={isLoading} />
      {(batchId === null || openEditCourseFee) && (
        <Stack w={"100%"} h={"100%"}>
          <InstituteDetailsCards instituteId={admin?.institute?._id || ""} />
          <InstituteProfile
          instituteId={admin?.institute?._id??""}
            users={[].map((user: any) => ({
              id: user?._id || "",
              name: user?.name || "",
              role: user?.role || "",
            }))}
            onreloadData={() => {
              // getInstituteInfo();
            }}
          />

          <Flex align={"center"}   w={isMd?"95%":"80%"} mx={"auto"}>
            <Text w={"100%"} fz={18} fw={700} c={"#1B1212"} ff={""} style={{fontFamily:"sans-serif"}} >
              Batches
            </Text>
            {isMd && (
              <Button
                onClick={()=> setOpenAddBatchModal(true)}
                w={"12rem"}
                size="lg"
                variant="default"
                fw={700}
                style={{
                  fontSize: "16px",
                  borderRadius: "24px",
                  borderColor: "#808080",
                  borderWidth: "1px",
                  fontFamily: "Roboto",
                }}
              >
                + Add Batch
              </Button>
            )}
          </Flex>
          {
            <SimpleGrid
              cols={isMd ? 1 : isLg ? 2 : 4}
              w={isMd?"95%":"80%"}
              mx={"auto"}
              spacing={20}
              verticalSpacing={20}
            >
              <InstituteBatchesSection
                batches={batches.map((batch: any) => ({
                  id: batch?.id || "",
                  name: batch?.name || "",
                  subjects: batch?.subjects || [],
                  noOfTeachers: batch?.noOfTeachers || 0,
                  noOfStudents: batch?.noOfStudents || 0,
                  firstThreeStudents: batch?.firstThreeStudents || [],
                  firstThreeTeachers: batch?.firstThreeTeachers || [],
                }))}
                userType={1}
                setDeleteBatchId={() => {}}
                setDeleteModal={(val) => {}}
                onEditBatchName={(id, val) => {
                  //   editBatchName(id, val);
                }}
                onbatchCardClick={(val) => {
                  console.log("log batch id : ",val);
                  
                  setBatchId(val.id);
                  setSelectedBatch(val);
                }}
                onEditCourseFees={(val: any) => {
                  setBatchId(val._id);
                  setOpenEditCourseFee(true);
                  // setisCourseFeesEdit(val);
                }}
                onAddBatchButtonClick={() => {
                  setOpenAddBatchModal(true);
                }}
                onEditBatchButtonClick={function (batchId: string): void {
                  //   handleEditBatch(batchId);
                }}
              />
            </SimpleGrid>
          }
        </Stack>
      )}

      {batchId != null && !openEditCourseFee && (
        <Stack
          w={"100%"}
          h={"100%"}
          bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
        >
          <InstituteInsideBatch
            batchId={batchId}
            batchName={selectedBatch?.name!!}
            instituteId={admin?.institute?._id!!}
            onClickBack={() => {
              setBatchId(null);
            }}
          />
        </Stack>
      )}

      <Modal
        opened={openAddBatchModal}
        onClose={() => setOpenAddBatchModal(false)}
        title="Add Batch"
        centered
      >
        <Stack>
          <TextInput
            label="Enter batch name"
            placeholder="Enter the batch name"
            onChange={(e) => setBatchName(e.target.value)}
            required
          />
          <MultiSelect
            label="Select subjects"
            placeholder="pic subjects"
            data={data}
            onChange={onSelectSubjects}
            searchable
            rightSection={<IconCaretDownFilled style={{ cursor: "pointer" }} />}
            required
          />
          <MultiSelect
            label="Select optional subjects"
            placeholder="pic optional subjects"
            data={data}
            onChange={(subjects: string[]) =>
              setSelectedOptionalSubjects(subjects)
            }
            rightSection={<IconCaretDownFilled style={{ cursor: "pointer" }} />}
            searchable
          />
        </Stack>
        <Flex w={"100%"} ml={"auto"} p={20}>
          <Button
            variant="outline"
            style={{ fontFamily: "Roboto" }}
            onClick={createBatch}
          >
            Submit
          </Button>
        </Flex>
      </Modal>
      {openEditCourseFee && (
        <EditCourseFeeModal
          isCourseFeesEdit={openEditCourseFee}
          isEditing={false}
          batchId={batchId!!}
          setisCourseFeesEdit={(val: null) => {
            setBatchId(null);
            setOpenEditCourseFee(false);
          }}
        />
      )}
    </>
  );
};
