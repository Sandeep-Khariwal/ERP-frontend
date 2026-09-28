"use client";
import { useMediaQuery } from "@mantine/hooks";
import { AddCardWithButton, SingleBatchCard } from "./DashboardCards";

export enum UserType {
  STUDENT,
  TEACHER,
  OTHERS,
}

interface InstituteBatchesSectionProps {
  batches: {
    id: string;
    name: string;
    subjects: { _id: string; name: string }[];
    noOfTeachers: number;
    noOfStudents: number;
    studentInitials?: string[];
    teacherInitials?: string[];
    firstThreeStudents?: { name: string }[];
    firstThreeTeachers?: { name: string }[];

  }[];
  allBatches: {
    id: string;
    name: string;
  }[];
  userType: UserType;
  onAddBatchButtonClick: () => void;
  onEditBatchButtonClick: (batchId: string) => void;
  setDeleteBatchId: (batchId: string) => void;
  setDeleteModal: (val: boolean) => void;
  onEditBatchName: (id: string, val: string) => void;
  onbatchCardClick: (val: any) => void;
  onEditCourseFees: (val: any) => void;
  showAddBatch: boolean;
}

export function InstituteBatchesSection(props: InstituteBatchesSectionProps) {
  const isMd = useMediaQuery(`(max-width: 968px)`);

  return (
    <>
      {props.userType == UserType.OTHERS && !isMd && props.showAddBatch && (
        <AddCardWithButton
          onAddBatchButtonClick={props.onAddBatchButtonClick}
        />
      )}
      {props.batches.map((batch, index) => {
        return (
          <SingleBatchCard
            key={index}
            id={batch.id}
            name={batch.name}
            allBatches={props.batches}
            subjects={batch.subjects.map((s) => s.name)}
            userType={props.userType}
            noOfTeachers={batch.noOfTeachers}
            noOfStudents={batch.noOfStudents}
            studentInitials={
              batch.studentInitials ??
              batch.firstThreeStudents?.map((student) => student.name[0]) ??
              []
            }
            teacherInitials={
              batch.teacherInitials ??
              batch.firstThreeTeachers?.map((teacher) => teacher.name[0]) ??
              []
            }
            hasNextButton={true}
            onEditBatchButtonClick={() =>
              props.onEditBatchButtonClick(batch.id)
            }
            setDeleteBatchId={props.setDeleteBatchId}
            setDeleteModal={props.setDeleteModal}
            onEditBatchName={(val: any) => {
              props.onEditBatchName(batch.id, val);
            }}
            onbatchCardClick={() => {
              props.onbatchCardClick(batch);
            }}
            onEditCourseFees={() => {
              props.onEditCourseFees({
                _id: batch.id,
                name: batch.name,
              });
            }}
            showVerticalIcon={props.showAddBatch}
          />
        );
      })}
    </>
  );
}
