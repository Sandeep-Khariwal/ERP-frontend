"use client";

import { Table, Checkbox, Text, Flex } from "@mantine/core";
import { StudentListItem } from "./InstituteStudentsPage";
import StudentTableRow from "./StudentTableRow";

export const StudentTable = (props: {
  students: StudentListItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onManageBatch: (student: StudentListItem) => void;
}) => {
  const allSelected =
    props.students.length > 0 &&
    props.students.every((s) => props.selectedIds.includes(s._id));
  const someSelected =
    props.students.some((s) => props.selectedIds.includes(s._id)) &&
    !allSelected;

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="md" highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={props.onToggleSelectAll}
                disabled={props.students.length === 0}
              />
            </Table.Th>
            <Table.Th w={60}>Photo</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Roll No.</Table.Th>
            <Table.Th>Phone Number</Table.Th>
            <Table.Th>Current Batch</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th w={60}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {props.students.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={8}>
                <Flex justify="center" py={40}>
                  <Text c="dimmed">No students found.</Text>
                </Flex>
              </Table.Td>
            </Table.Tr>
          ) : (
            props.students.map((student) => (
              <StudentTableRow
                key={student._id}
                student={student}
                selected={props.selectedIds.includes(student._id)}
                onToggleSelect={() => props.onToggleSelect(student._id)}
                onManageBatch={() => props.onManageBatch(student)}
              />
            ))
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default StudentTable;