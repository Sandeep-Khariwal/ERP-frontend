"use client";

import { useAppSelector } from "@/app/redux/redux.hooks";
import { GetBatchOptionalSubjects } from "@/axios/institute/InstituteGetApi";
import { GetInstituteBatches } from "@/axios/institute/instituteSlice";
import { GetAllVans } from "@/axios/institute/transportApi";
import {
  Container,
  Grid,
  LoadingOverlay,
  MultiSelect,
  Select,
  Space,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";

const AssignBatch = (props: {
  formValues: any;
  instituteId: string;
  batchId: string;
  selectedBatch: string;
  selectedVan: string;
  optionalSubjects: string[];
  onChangeAssigningBatch: (val: string) => void;
  onChangeAssigningVan: (val: string) => void;
  onChangeAssigningOptionalSubjects: (val: string[]) => void;
  handleInputChange: (val: string, date: any) => void;
}) => {
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [batches, setBatches] = useState<{ _id: string; name: string }[]>([]);
  const [allVans, setAllVans] = useState<{ _id: string; name: string }[]>([]);

  const [optionalSubjects, setOptionalSubjects] = useState<
    { _id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const institute = useAppSelector(
    (state: any) => state.instituteSlice.instituteDetails
  );
  useEffect(() => {
    setIsLoading(true);
    GetInstituteBatches(props.instituteId)
      .then((x: any) => {
        setIsLoading(false);
        var fetchBatchs;
        // if (!props.selectedBatch) {
        fetchBatchs = x.batches.filter((b: any) => b._id === props.batchId);
        props.onChangeAssigningBatch(fetchBatchs[0]._id);
        if (fetchBatchs) {
          setBatches(fetchBatchs);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });

    if (institute?.featureAccess?.transportManagement) {
      GetAllVans(props.instituteId)
        .then((x: any) => {
          const formateVans = x.data.map((v: any) => {
            return { _id: v._id, name: "Van No " + v.vanNumber };
          });
          setAllVans(formateVans);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [props.instituteId]);

  useEffect(() => {
    if (props.selectedBatch) {
      setIsLoading(true);
      GetBatchOptionalSubjects(props.selectedBatch)
        .then((x: any) => {
          const { optionalSubjects } = x.subjects;
          setIsLoading(false);
          setOptionalSubjects(optionalSubjects);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [props.selectedBatch]);
  return (
    <Container w={isMobile ? "98%" : "100%"}>
      <LoadingOverlay visible={isLoading} />
      <Text fz={"lg"} ff={"Fira Sans"} fw={500} c="#D3D3D3" my={10}>
        Course Information
      </Text>
      <Grid>
        <Grid.Col span={isMobile ? 12 : 6}>
          <Select
            label="Assign Batches"
            ff={"Poppins"}
            placeholder="Select"
            value={props.selectedBatch}
            data={
              batches.length > 0
                ? batches.map((batch) => ({
                    value: batch._id,
                    label: batch.name,
                  }))
                : []
            }
            onChange={(selectedValues) => {
              props.onChangeAssigningBatch(selectedValues!!);
            }}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <DatePickerInput
            ff={"Poppins"}
            label="Date Of Joining"
            placeholder="Select Date"
            radius={"md"}
            value={props.formValues.dateOfJoining}
            // disabled={!collectBatchIds}
            onChange={(date) => props.handleInputChange("dateOfJoining", date)}
          />
        </Grid.Col>
        <Grid.Col span={isMobile ? 12 : 6}>
          <MultiSelect
            ff={"Poppins"}
            label="Select optional subjects"
            placeholder="Select optional subjects"
            data={optionalSubjects.map((subject) => ({
              value: subject._id,
              label: subject.name,
            }))}
            radius={"md"}
            defaultValue={props.optionalSubjects}
            // disabled={!collectBatchIds}
            clearable
            onChange={(subjects) => {
              props.onChangeAssigningOptionalSubjects(subjects);
            }}
          />
        </Grid.Col>
        {institute?.featureAccess?.transportManagement && (
          <Grid.Col span={isMobile ? 12 : 6}>
            <Select
              label="Assign Van "
              ff={"Poppins"}
              placeholder="Select"
              value={props.selectedVan}
              data={
                allVans.length > 0
                  ? allVans.map((van) => ({
                      value: van._id,
                      label: van.name,
                    }))
                  : []
              }
              onChange={(selectedValues) => {
                props.onChangeAssigningVan(selectedValues!!);
              }}
            />
          </Grid.Col>
        )}
      </Grid>
      <Space h="md" />
    </Container>
  );
};

export default AssignBatch;
