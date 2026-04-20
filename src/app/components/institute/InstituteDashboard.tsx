"use client";

import {
  Button,
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
import {
  InstituteBatchesSection,
  UserType,
} from "../dashboard/InstituteBatchesSection";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  CreateBatchAndSubjects,
  EditBatchAndSubjects,
  GetAccountByToken,
  GetInstituteBatches,
} from "@/axios/institute/instituteSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/redux.hooks";
import { EditCourseFeeModal } from "./EditCourseFeeModal";
import { InstituteInsideBatch } from "./insideBatch/InstituteInsideBatch";
import {
  ErrorNotification,
  hasCommonUniqueElement,
  SuccessNotification,
} from "@/app/helperFunction/Notification";
import { Notifications } from "@mantine/notifications";
import { IconCaretDownFilled } from "@tabler/icons-react";
import { DeleteTheBatch, EditTheBatchName } from "@/axios/batch/BatchPutApi";
import { setAdminDetails } from "@/app/redux/slices/adminSlice";
import { UserTypes } from "@/enums";
import { usePathname, useRouter } from "next/navigation";
import NoticeBoard from "./notice/NoticeBoard";
import { GetInstituteSubjects } from "@/axios/institute/InstituteGetApi"; //data fetch krne liye subject

export interface Batch {
  id: string;
  name: string;
  subjects: { _id: string; name: string }[];
  optionalSubjects: { _id: string; name: string }[];
  noOfTeachers: number;
  noOfStudents: number;
  firstThreeTeachers: string[];
  firstThreeStudents: string[];
}

export const InstituteDashboard = (props: { isShowTopCard?: boolean }) => {
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
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails,
  );

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>();
  const [batchId, setBatchId] = useState<string | null>(null);
  const [deleteBatchId, setDeleteBatchId] = useState<string>("");
  const [batchDeleteWarning, setBatchDeleteWarning] = useState<boolean>(false);
  const [editBatchDetails, setEditBatchDetails] = useState<boolean>(false);
  const [editBatchId, setEditBatchId] = useState<string>("");
  const navigation = useRouter();

  const pathname = usePathname();
  const prefix = pathname ? pathname.split("-")[0] : null;
  const typ = prefix?.split("/")[2];

  const adminDetails = useAppSelector(
    (state: any) => state.adminSlice.adminDetails,
  );

  const userType: UserTypes =
    adminDetails?.role?.toLowerCase() === "user"
      ? UserTypes.USER
      : UserTypes.ADMIN;

  const getAccountByToken = () => {
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
          }),
        );
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  // useEffect(() => {
  //   getAccountByToken();
  // }, []);

  useEffect(() => {
    if (institute?._id!!) {
      getAllInstituteBatches();
    }
  }, [institute]);

  useEffect(() => {
    if (openAddBatchModal) {
      getSubjects();
    }
  }, [openAddBatchModal]);

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
    { value: "Punjabi", label: "Punjabi" },
    { value: "Sanskrit", label: "Sanskrit" },
    { value: "Geography", label: "Geography" },
    { value: "Economics", label: "Economics" },
    { value: "History", label: "History" },
    { value: "Physical science", label: "Physical science" },
  ]);
  //ye dynamic subjects ke liye subjects add kri
  const [subjectOptions, setSubjectOptions] = useState<
    { value: string; label: string }[]
  >([]);

  //subject fetch krne ke liye fun bnaya jisme api call kri get valo
  const getSubjects = () => {
    if (!institute?._id) return;

    GetInstituteSubjects()
      .then((res: any) => {
        const formatted = (res.subjects || []).map((sub: any) => ({
          value: sub.value,
          label: sub.label,
        }));

        setSubjectOptions(formatted);
      })
      .catch((e) => console.log(e));
  };

  const getAllInstituteBatches = () => {
    setIsLoading(true);
    GetInstituteBatches(institute._id)
      .then((x: any) => {
        const { batches } = x;
        setIsLoading(false);
        const allBatches = batches.map((b: any) => {
          return {
            id: b._id,
            name: b.name,
            subjects: b.subjects,
            optionalSubjects: b.optionalSubjects,
            noOfTeachers: b.teachers.length,
            noOfStudents: b.students.length,
            firstThreeTeachers: b.teachers.slice(0, 2),
            firstThreeStudents: b.students.slice(0, 2),
          };
        });
        setBatches(allBatches);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
        if (e.status === 404) {
          navigation.push("/auth");
          // window.location.reload()
        }
        if (e.status === 401) {
          navigation.push("/auth");
        }
        if (e.status === 403) {
          ErrorNotification("Subscription has been expired!!");
          navigation.push("/pricing");
        }
      });
  };
  const createBatch = () => {
    if (hasCommonUniqueElement(selectedSubjects, selectedOptionalSubjects)) {
      ErrorNotification("Subjects and optional subjects should not same!");
      return;
    }
    if (!batchName) {
      ErrorNotification("Batch name is required!");
      return;
    }
    // setIsLoading(true);

    if (editBatchDetails) {
      console.log(
        editBatchId,
        "edit batch data : ",
        selectedOptionalSubjects,
        selectedSubjects,
      );
      setIsLoading(true);
      EditBatchAndSubjects(editBatchId, {
        batchName,
        subjects: selectedSubjects,
        optionalSubjects: selectedOptionalSubjects,
      })
        .then((x: any) => {
          SuccessNotification("Batch updated!!");
          const { data } = x;
          const newBatch = {
            id: data._id,
            name: data.name,
            subjects: data.subjects,
            noOfTeachers: data.teachers.length,
            noOfStudents: data.students.length,
            optionalSubjects: data.optionalSubjects,
            firstThreeTeachers: data.teachers.splice(0, 3),
            firstThreeStudents: data.students.splice(0, 3),
          };
          const editedBatch = batches.filter((b) => b.id !== editBatchId);
          setBatches([...editedBatch, newBatch]);
          setOpenAddBatchModal(false);
          setIsLoading(false);
          getAllInstituteBatches();
        })
        .catch((e) => {
          setOpenAddBatchModal(false);
          setIsLoading(false);
          console.log(e);
        });
    } else {
      setIsLoading(true);
      CreateBatchAndSubjects({
        batchName,
        subjects: selectedSubjects,
        optionalSubjects: selectedOptionalSubjects,
        instituteId: institute._id,
      })
        .then((x: any) => {
          SuccessNotification("Batch created!!");
          const { data } = x;
          const newBatch = {
            id: data._id,
            name: data.name,
            subjects: data.subjects,
            noOfTeachers: data.teachers.length,
            noOfStudents: data.students.length,
            optionalSubjects: data.optionalSubjects,
            firstThreeTeachers: data.teachers.splice(0, 3),
            firstThreeStudents: data.students.splice(0, 3),
          };
          setBatches((prevBatches) => [...prevBatches, newBatch]);
          setBatchId(data._id);
          setOpenAddBatchModal(false);
          setOpenEditCourseFee(true);
          setIsLoading(false);
          getAllInstituteBatches();
        })
        .catch((e) => {
          setOpenAddBatchModal(false);
          setIsLoading(false);
          console.log(e);
        });
    }
  };
  const onSelectSubjects = (data: string[]) => {
    setSelectedSubjects(data);
  };

  const deleteTheBatch = () => {
    setIsLoading(true);
    DeleteTheBatch(deleteBatchId)
      .then(() => {
        setBatchDeleteWarning(false);
        setIsLoading(false);
        setBatches((prev) => {
          return prev.filter((b) => b.id !== deleteBatchId);
        });
        SuccessNotification("Batch deleted!!");
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const updateTheBatchName = (id: string, name: string) => {
    setIsLoading(true);
    EditTheBatchName(id, name)
      .then(() => {
        setIsLoading(false);
        const updatedBatches = batches.map((batch) => {
          if (batch.id === id) {
            return {
              ...batch,
              name: name,
            };
          }
          return batch;
        });
        setBatches(updatedBatches);
        SuccessNotification("Batch name edited!!");
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const editBatch = (batchId: string) => {
    const batch = batches.filter((b) => b.id === batchId);
    setBatchName(batch[0].name);
    setSelectedBatch(batch[0]);
    setSelectedSubjects(batch[0].subjects.map((s) => s.name));
    setSelectedOptionalSubjects(batch[0].optionalSubjects.map((s) => s.name));
  };

  const handleCreateSubject = (newSubject: string) => {
    // setData((prevData) => [...prevData, newSubject]);
    // setSelectedSubjects((prevSubjects) => [...prevSubjects, newSubject]);
  };

  // console.log("userType:", userType);

  return (
    <>
      <Notifications />
      <LoadingOverlay visible={isLoading} />
      {(batchId === null || openEditCourseFee) && (
        <Stack w={"100%"} mih={"100%"} py={20}>
          {props.isShowTopCard !== false && (
            <InstituteDetailsCards instituteId={institute?._id || ""} />
          )}
          <InstituteProfile
            instituteId={institute?._id ?? ""}
            users={[].map((user: any) => ({
              id: user?._id || "",
              name: user?.name || "",
              role: user?.role || "",
            }))}
            userType={userType}
            onreloadData={() => {
              getAccountByToken();
              // getInstituteInfo();
            }}
          />

          <Flex align={"center"} w={isMd ? "95%" : "80%"} mx={"auto"}>
            <Text
              w={"100%"}
              fz={18}
              fw={700}
              c={"#1B1212"}
              ff={""}
              style={{ fontFamily: "sans-serif" }}
            >
              Batches
            </Text>
            {isMd && (
              <Button
                onClick={() => setOpenAddBatchModal(true)}
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
              w={isMd ? "95%" : "80%"}
              mx={"auto"}
              spacing={20}
              verticalSpacing={20}
              mb={isMd ? 100 : 0}
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
                showAddBatch={true}
                userType={2}
                setDeleteBatchId={(val: string) => {
                  setDeleteBatchId(val);
                  setBatchDeleteWarning(true);
                }}
                setDeleteModal={(val) => {}}
                onEditBatchName={(id: string, val: string) => {
                  updateTheBatchName(id, val);
                }}
                onbatchCardClick={(val) => {
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
                  // setEditBatchDetails(true);
                  // setEditBatchId(batchId);
                  // setOpenAddBatchModal(true);
                  // editBatch(batchId);
                }}
              />
            </SimpleGrid>
          }
          <Flex w={"100%"} align="center" justify={"center"}>
            <NoticeBoard userType={userType} />
          </Flex>
        </Stack>
      )}

      {batchId != null && !openEditCourseFee && (
        <Stack
          w={"100%"}
          h={"100%"}
          bg={"linear-gradient(135deg, #E6E1FF, #F7F5FF)"}
        >
          <InstituteInsideBatch
            userType={UserType.OTHERS}
            batchId={batchId}
            batchName={selectedBatch?.name!!}
            instituteId={institute?._id!!}
            onClickBack={() => {
              getAllInstituteBatches();
              setBatchId(null);
            }}
            fromInstituteTeacherSection={false}
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
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            required
          />
          <MultiSelect
            label="Select subjects"
            placeholder="pic subjects"
            value={selectedSubjects}
            // data={data}
            data={subjectOptions}
            onChange={onSelectSubjects}
            // creatable={true}
            // getCreateLabel={(query) => `+ Create ${query}`}
            // onCreate={(query) => {
            //   const item = { value: query, label: query };
            //   setData((current) => [...current, item]);
            //   return item;
            // }}
            searchable
            rightSection={<IconCaretDownFilled style={{ cursor: "pointer" }} />}
            required
          />
          <MultiSelect
            label="Select optional subjects"
            placeholder="pic optional subjects"
            // data={data}
            data={subjectOptions}
            value={selectedOptionalSubjects}
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

      <Modal
        centered
        title="Warning"
        style={{ fontFamily: "sans-serif" }}
        opened={batchDeleteWarning}
        onClose={() => setBatchDeleteWarning(false)}
      >
        <Text>Are you sure?. you want to delete the batch</Text>
        <Flex w={"100%"} align={"center"} justify={"end"} gap={10}>
          <Button
            variant="outline"
            onClick={() => setBatchDeleteWarning(false)}
          >
            Cancel
          </Button>
          <Button variant="filled" bg={"red"} onClick={deleteTheBatch}>
            Yes
          </Button>
        </Flex>
      </Modal>
    </>
  );
};
