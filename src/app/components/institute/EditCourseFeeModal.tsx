import {
  Button,
  Flex,
  Modal,
  NumberInput,
  Radio,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getThisAndNextYearMonths, months } from "./helperFunctions";
import {
  FeeData,
  feeOptions,
  FeeOptions,
  Installment,
} from "@/interfaces/batchInterface";
import { CreateBatchFee } from "@/axios/institute/instituteSlice";
import { getOneYearPast, SuccessNotification } from "@/app/helperFunction/Notification";
import { GetBatchFee } from "@/axios/institute/InstituteGetApi";
import { showNotification } from "@mantine/notifications";

export function EditCourseFeeModal(props: {
  isCourseFeesEdit: boolean;
  isEditing: boolean;
  batchId: string;
  setisCourseFeesEdit: (val: any | null) => void;
}) {
  const [selectedClassMonthFeeData, setSelectedClassMonthFeeData] = useState<
    FeeData[]
  >([]);
  const [selectedClassYearlyFeeData, setSelectedClassYearlyFeeData] = useState<
    FeeData[]
  >([]);
  const [selectedClassQuaterlyFeeData, setSelectedClassQuaterlyFeeData] =
    useState<FeeData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [datesData, setDatesData] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const isMobile = useMediaQuery("(max-width: 800px)");
  const [startYearDate, setStartYearDate] = useState<Date>(new Date());
  const [defaultCoursePrice, setDefaultCoursePrice] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOptions>(
    FeeOptions.MONTHLY
  );
  const [existFeeOption, setExistFeeOption] = useState<FeeOptions>(
    FeeOptions.MONTHLY
  );
  const [quaterFees, setquarterFees] = useState<
    {
      date: Date;
      price: number;
    }[]
  >([]);
  const [showarning, setShowWarning] = useState<boolean>(false);
  const [installments, setInstallments] = useState<Installment[]>([
    { name: "", dueDate: "", amount: 0 },
  ]);
  const [monthlyInstallments, setMonthlyInstallments] = useState<Installment[]>(
    [{ name: "", dueDate: "", amount: 0 }]
  );
  const [quarterlyInstallments, setQuarterlyInstallments] = useState<
    Installment[]
  >([{ name: "", dueDate: "", amount: 0 }]);
  const [yearlyInstallments, setYearlyInstallments] = useState<Installment>({
    name: "",
    dueDate: "",
    amount: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [installment, setInstallment] = useState<Installment>({
    name: "Installment 1",
    dueDate: "",
    amount: 0,
  });

  const [editFeeBatch, setEditBatchFee] = useState<boolean>(false);

  const handleYearlyInstallmentChange = (field: string, value: any) => {
    setYearlyInstallments((p) => ({
      ...p,
      [field]: value,
    }));
  };

  const handleAddInstallment = () => {
    setInstallments([...installments, { name: "", dueDate: "", amount: 0 }]);
  };

  const handleRemoveInstallment = (index: number) => {
    const newInstallments = installments.filter((_, i) => i !== index);
    setInstallments(newInstallments);
  };

  const handleInstallmentChange = (
    index: any,
    field: keyof Installment,
    value: any
  ) => {
    const newInstallments = [...installments];
    newInstallments[index] = { ...newInstallments[index], [field]: value };
    setInstallments(newInstallments);
  };

  useEffect(() => {
    if (existFeeOption !== selectedFeeOption) {
      return;
    }
    GetBatchFee(props.batchId)
      .then((x: any) => {
        const { feeInstallments, feeType } = x.batchFee;
        const newInstallments = feeInstallments.map((f: any) => {
          return {
            name: f.name,
            dueDate: new Date(f.dueDate).toISOString().split("T")[0],
            amount: f.amount,
          };
        });

        if (feeType === FeeOptions.MONTHLY) {
          setMonthlyInstallments(newInstallments);
          // setInstallments(newInstallments);
          setExistFeeOption(FeeOptions.MONTHLY);
          setSelectedFeeOption(FeeOptions.MONTHLY);
        } else if (feeType === FeeOptions.QUARTERLY) {
          setQuarterlyInstallments(newInstallments);
          // setInstallments(newInstallments);
          setExistFeeOption(FeeOptions.QUARTERLY);
          setSelectedFeeOption(FeeOptions.QUARTERLY);
        } else {
          const startMonth = getOneYearPast(newInstallments[0].dueDate)
          setSelectedMonth(new Date(startMonth))
          setYearlyInstallments(newInstallments[0]);
          setExistFeeOption(FeeOptions.YEARLY);
          setSelectedFeeOption(FeeOptions.YEARLY);
        }

        // setInstallments(newInstallments);

        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [props.batchId, selectedFeeOption]);

  const onSubmitCreateBatchFee = (selectedFeeOption: FeeOptions) => {
    if (FeeOptions.YEARLY === selectedFeeOption) {
      CreateBatchFee({
        installments: [yearlyInstallments],
        batchId: props.batchId,
        feeType: FeeOptions.YEARLY,
      })
        .then((x: any) => {
          SuccessNotification("Batch fee created!!");
          props.setisCourseFeesEdit(null);
        })
        .catch((e) => {
          console.log(e);
          props.setisCourseFeesEdit(null);
        });
    } else {
      CreateBatchFee({
        installments,
        batchId: props.batchId,
        feeType: selectedFeeOption,
      })
        .then((x: any) => {
          SuccessNotification("Batch fee created!!");
          props.setisCourseFeesEdit(null);
        })
        .catch((e) => {
          console.log(e);
          props.setisCourseFeesEdit(null);
        });
    }
  };

  const onSubmitEditData = (selectedFeeOption: FeeOptions) => {

    //   !showarning &&
    //     EditBatchFee({
    //       id: props.isCourseFeesEdit._id,
    //       type: selectedFeeOption,
    //       feeinstallments:
    //         selectedFeeOption === FeeOptions.YEARLY
    //           ? [installment]
    //           : installments,
    //     })
    //       .then((res: any) => {
    //         setInstallments(res.batchFee.feeInstallments);
    //       })
    //       .catch((e) => {
    //         console.log(e);
    //       });
  };

  const handleEditBatchFee = () => {
    //   EditBatchFee({
    //     id: props.isCourseFeesEdit._id,
    //     type: selectedFeeOption,
    //     feeinstallments: installments,
    //   })
    //     .then((res) => {})
    //     .catch((e) => {
    //       console.log(e);
    //     });
  };

  useEffect(() => {
    let numberOfInstallments = 1;
    if (selectedFeeOption === FeeOptions.MONTHLY) {
      if (monthlyInstallments.length <= 1) {
        numberOfInstallments = 12;
        const currentDate = new Date();
        const initialInstallments = Array.from(
          { length: numberOfInstallments },
          (_, i) => {
            const dueDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + i + 1,
              1
            );
            return {
              name: `Installment ${i + 1}`,
              dueDate: dueDate.toISOString().split("T")[0],
              amount: price,
            };
          }
        );
        setInstallments(initialInstallments);
      } else {
        console.log("inside useEffect else", monthlyInstallments);
        setInstallments(monthlyInstallments);
      }
      return;
    } else if (selectedFeeOption === FeeOptions.QUARTERLY) {
      let numberOfInstallments = 4;
      if (editFeeBatch || quarterlyInstallments.length <= 1) {
        const currentDate = new Date();
        const initialInstallments = Array.from(
          { length: numberOfInstallments },
          (_, i) => {
            let dueDate = new Date();
            if (selectedMonth) {
              dueDate = new Date(
                selectedMonth.getFullYear(),
                selectedMonth.getMonth() + (i + 1) * 3 + 1,
                1
              );
            } else {
              dueDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + (i + 1) * 3 + 1,
                1
              );
            }
            return {
              name: `Installment ${i + 1}`,
              dueDate: dueDate.toISOString().split("T")[0],
              amount: price,
            };
          }
        );
        setInstallments(initialInstallments);
        return;
      } else {
        setInstallments(quarterlyInstallments);
      }
    } else if (selectedFeeOption === FeeOptions.YEARLY) {
      let dueDate = new Date();
      const currentDate = new Date();
      if (selectedMonth) {
        dueDate = new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth() + 12 + 1,
          1
        );
      } else {
        dueDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 12 + 1,
          1
        );
      }
      if (!editFeeBatch) {
      const data = {
        name: `Installment`,
        dueDate: dueDate.toISOString().split("T")[0],
        amount: 0,
      };
      setYearlyInstallments(data);
      setInstallment(data);
      }
    }
  }, [selectedFeeOption, price, monthlyInstallments]);

  useEffect(() => {
    if (selectedFeeOption === FeeOptions.QUARTERLY) {
      if (selectedMonth) {
        const startMonth = selectedMonth.getMonth();
        const selectedYear = selectedMonth.getFullYear();
        const fees = [
          {
            date: selectedMonth,
            price: 0,
          },
          {
            date: new Date(
              selectedYear + Math.floor((startMonth + 3) / 12),
              (startMonth + 3) % 12,
              2
            ),
            price: 0,
          },
          {
            date: new Date(
              selectedYear + Math.floor((startMonth + 6) / 12),
              (startMonth + 6) % 12,
              2
            ),
            price: 0,
          },
          {
            date: new Date(
              selectedYear + Math.floor((startMonth + 9) / 12),
              (startMonth + 9) % 12,
              2
            ),
            price: 0,
          },
          {
            date: new Date(
              selectedYear + Math.floor((startMonth + 12) / 12),
              (startMonth + 12) % 12,
              2
            ),
            price: 0,
          },
        ];
        setquarterFees(fees);
      }
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (
      selectedFeeOption === FeeOptions.YEARLY &&
      datesData.length > 0 &&
      selectedClassYearlyFeeData.length > 0
    ) {
    }
    if (
      selectedFeeOption === FeeOptions.QUARTERLY &&
      datesData.length > 0 &&
      selectedClassQuaterlyFeeData.length > 0
    ) {
    }
  }, [datesData, selectedClassYearlyFeeData, selectedFeeOption]);

  // useEffect(() => {
  //   if (props.isCourseFeesEdit)
  //     GetAllMonthsDataByClassId({ id: props.isCourseFeesEdit?._id })
  //       .then((x: any) => {
  //         const formattedInstallments = x.batchFee.feeInstallments.map(
  //           (installment: Installment) => ({
  //             ...installment,
  //             dueDate: new Date(installment.dueDate)
  //               .toISOString()
  //               .split("T")[0],
  //           })
  //         );

  //         if (x.batchFee) {
  //           setEditBatchFee(true);
  //           setSelectedFeeOption(x.batchFee.feeType);

  //           if (x.batchFee.feeType === "monthly") {
  //             setMonthlyInstallments(formattedInstallments);
  //             setInstallments(formattedInstallments);
  //           } else if (x.batchFee.feeType === "quarterly") {
  //             setQuarterlyInstallments(formattedInstallments);
  //           } else if (x.batchFee.feeType === "yearly") {
  //             setYearlyInstallments(formattedInstallments[0]);
  //             setInstallment(formattedInstallments[0]);
  //           }
  //         }

  //         setSelectedClassMonthFeeData(x.courseFees);
  //         setDefaultCoursePrice(x.lastupdatedCourseFee);
  //         setSelectedClassYearlyFeeData(x.yearlyFeeDates);
  //         setSelectedClassQuaterlyFeeData(x.quaterlyFeeDates);
  //         const values = (
  //           x.selectedFeeOption == "Monthly" ? x.courseFees : x.quaterlyFeeDates
  //         ).sort(
  //           (a: any, b: any) =>
  //             new Date(a.monthDate).getTime() - new Date(b.monthDate).getTime()
  //         );
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  // }, [props.isCourseFeesEdit]);

  useEffect(() => {
    if (props.isCourseFeesEdit) {
      const nextYearMonthsArray = getThisAndNextYearMonths();
      if (selectedFeeOption === FeeOptions.MONTHLY) {
        setDatesData(nextYearMonthsArray);
        // const found = selectedClassMonthFeeData.find((x) => {
        //   return (
        //     new Date(x.monthDate).toUTCString() ===
        //     new Date(nextYearMonthsArray[0].value).toUTCString()
        //   );
        // });
        // if (found) {
        //   setPrice(found.coursefees);
        // } else {
        setPrice(defaultCoursePrice);
        // }
      } else {
        setDatesData(getThisAndNextYearMonths());
      }
    }
  }, [props.isCourseFeesEdit, selectedFeeOption]);

  useEffect(() => {
    if (selectedMonth) {
      if (selectedFeeOption === FeeOptions.MONTHLY) {
        // const found = selectedClassMonthFeeData.find((x) => {
        //   return (
        //     new Date(x.monthDate).toUTCString() === selectedMonth.toUTCString()
        //   );
        // });
        // if (found) {
        //   setPrice(found.coursefees);
        // } else {
        setPrice(defaultCoursePrice);
        // }
      } else if (selectedFeeOption === FeeOptions.YEARLY) {
        const found = selectedClassYearlyFeeData.find((x) => {
          return (
            new Date(x.monthDate).toUTCString() === selectedMonth.toUTCString()
          );
        });
        if (found) {
          setPrice(found.coursefees);
        } else {
          setPrice(0);
        }
      } else if (selectedFeeOption === FeeOptions.QUARTERLY) {
        const found = selectedClassQuaterlyFeeData.find((x) => {
          return (
            new Date(x.monthDate).toUTCString() === selectedMonth.toUTCString()
          );
        });
        if (found) {
          setquarterFees((prev) => {
            const prev1 = prev;
            prev1[0].price =
              selectedClassQuaterlyFeeData.find((x) => {
                return (
                  new Date(x.monthDate).toUTCString() ===
                  prev[0].date.toUTCString()
                );
              })?.coursefees ?? 0;
            prev1[1].price =
              selectedClassQuaterlyFeeData.find((x) => {
                return (
                  new Date(x.monthDate).toUTCString() ===
                  prev[1].date.toUTCString()
                );
              })?.coursefees ?? 0;
            prev1[2].price =
              selectedClassQuaterlyFeeData.find((x) => {
                return (
                  new Date(x.monthDate).toUTCString() ===
                  prev[2].date.toUTCString()
                );
              })?.coursefees ?? 0;
            prev1[3].price =
              selectedClassQuaterlyFeeData.find((x) => {
                return (
                  new Date(x.monthDate).toUTCString() ===
                  prev[3].date.toUTCString()
                );
              })?.coursefees ?? 0;
            return prev1;
          });
        } else {
          setPrice(0);
        }
      }
    }
  }, [selectedMonth, datesData]);
  function isValid() {
    if (selectedFeeOption === FeeOptions.QUARTERLY) {
      return installments.slice(0, 4).every((x) => x.amount > 0);
    } else if (selectedFeeOption === FeeOptions.MONTHLY) {
      return installments.slice(0, 12).every((x) => x.amount > 0);
    } else {
      return yearlyInstallments.amount > 0;
    }
  }
  useEffect(() => {
    if (selectedMonth) {
      const year = selectedMonth.getFullYear() + 1;
      const month = selectedMonth.getMonth() + 1;
      const day = 1;

      const formattedDate = `${year}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
      }`;
      setInstallment((prevInstallment) => ({
        ...prevInstallment,
        dueDate: formattedDate,
      }));
    }
  }, [selectedMonth]);

  function submithandler(id: string) {
    props.setisCourseFeesEdit(null);
    setSelectedMonth(null);
    setDefaultCoursePrice(0);
    setPrice(0);
    //   if (props.isCourseFeesEdit && selectedMonth)
    // AddCourseFee({
    //   id: props.isCourseFeesEdit?._id,
    //   courseFees: price,
    //   date: selectedMonth,
    //   selectedFeeOption: selectedFeeOption,
    //   quaterFees: quaterFees,
    // })
    //   .then((x) => {
    //     showNotification({
    //       message:"Course Fee Added"
    //     })
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  }

  return (
    <>
      <Modal
        onClose={() => {
          props.setisCourseFeesEdit(null);
          setSelectedMonth(null);
          setDefaultCoursePrice(0);
          setPrice(0);
        }}
        opened={props.isCourseFeesEdit !== null}
        title={props.isEditing ? "Edit Course Fees" : "Add Course Fees"}
        size={isMobile ? "sm" : "lg"}
        centered
        styles={{
          title: {
            color: "black",
            fontSize: "20px",
            fontWeight: 700,
          },
        }}
      >
        <Stack>
          <Radio.Group
            value={selectedFeeOption}
            onChange={(val: string) => {
              console.log(val);
              if (FeeOptions.YEARLY === val) {
                setSelectedFeeOption(FeeOptions.YEARLY);
              } else if (FeeOptions.MONTHLY === val) {
                setSelectedFeeOption(FeeOptions.MONTHLY);
              } else {
                setSelectedFeeOption(FeeOptions.QUARTERLY);
              }
            }}
          >
            <Flex gap="30px">
              <Radio
                value={feeOptions[0].value}
                label={feeOptions[0].label}
                onClick={() =>
                  setInstallments([{ name: "", dueDate: "", amount: 0 }])
                }
              ></Radio>
              <Radio
                value={feeOptions[1].value}
                label={feeOptions[1].label}
                onClick={() =>
                  setInstallments([{ name: "", dueDate: "", amount: 0 }])
                }
              ></Radio>
              <Radio
                value={feeOptions[2].value}
                label={feeOptions[2].label}
                onClick={() =>
                  setInstallments([{ name: "", dueDate: "", amount: 0 }])
                }
              ></Radio>
            </Flex>
          </Radio.Group>
          {selectedFeeOption === FeeOptions.MONTHLY && (
            <>
              <Flex align="center">
                <NumberInput
                  value={price}
                  label="Price:"
                  onChange={(val) => {
                    if (val !== undefined) {
                      setPrice(Number(val));
                    }
                  }}
                />
              </Flex>
              {/* </Flex> */}
              <Table style={{ marginTop: "2rem" }}>
                <thead>
                  <tr style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}>
                    <th
                      style={{
                        padding: "2px",
                        fontSize: isMobile ? "10px" : "15px",
                        display: isMobile ? "none" : "block",
                        whiteSpace: "nowrap",
                      }}
                    >
                      S No.
                    </th>
                    <th
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    >
                      Name
                    </th>
                    <th
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    >
                      Due Date
                    </th>
                    <th
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    >
                      Amount in ₹
                    </th>
                    <th
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    ></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody
                  style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                >
                  {installments.map((installment, index) => (
                    <tr
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                      key={index}
                    >
                      <td
                        style={{
                          border: "0.5px thin gray",
                          padding: "2px",
                          display: isMobile ? "none" : "block",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "2px",
                        }}
                      >
                        <TextInput
                          value={installment.name}
                          w={isMobile ? "100px" : "100%"}
                          onChange={(event) =>
                            handleInstallmentChange(
                              index,
                              "name",
                              event.currentTarget.value
                            )
                          }
                        />
                      </td>
                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "2px",
                        }}
                      >
                        <TextInput
                          type="date"
                          value={installment.dueDate}
                          w={isMobile ? "100px" : "100%"}
                          onChange={(event) =>
                            handleInstallmentChange(
                              index,
                              "dueDate",
                              event.currentTarget.value
                            )
                          }
                        />
                      </td>
                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "2px",
                        }}
                      >
                        <NumberInput
                          value={installment.amount}
                          w={isMobile ? "100px" : "100%"}
                          onChange={(value) =>
                            handleInstallmentChange(index, "amount", value)
                          }
                          min={0}
                          hideControls
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
          {selectedFeeOption === FeeOptions.YEARLY && (
            <>
              <Flex
                justify={"space-between"}
                align={isMobile ? "flex-start" : "center"}
                direction={isMobile ? "column" : "row"}
              >
                <Select
                  data={datesData}
                  required
                  label="Start Month:"
                  value={
                    selectedMonth
                      ? selectedMonth.toISOString().split("T")[0]
                      : new Date().getMonth().toLocaleString()
                  }
                  onChange={(val) => {
                    if (val) {
                      const date = new Date(val);
                      setSelectedMonth(date);
                    }
                  }}
                />
              </Flex>
              <Text>
                {months[selectedMonth?.getMonth() ?? 0]}{" "}
                {selectedMonth?.getFullYear()} -
                {months[selectedMonth?.getMonth() ?? 0]}{" "}
                {(selectedMonth?.getFullYear() ?? 0) + 1}
              </Text>
              <Table style={{ marginTop: "2rem", width: "100%" }}>
                <thead>
                  <tr style={{ border: "0.5px thin gray" }}>
                    <th style={{ border: "0.5px thin gray" }}>Name</th>
                    <th style={{ border: "0.5px thin gray" }}>Due Date</th>
                    <th style={{ border: "0.5px thin gray" }}>Amount in ₹</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}>
                    <td
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    >
                      <TextInput
                        value={yearlyInstallments.name}
                        w={isMobile ? "100px" : "100%"}
                        onChange={(event) =>
                          handleYearlyInstallmentChange(
                            "name",
                            event.currentTarget.value
                          )
                        }
                      />
                    </td>
                    <td
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    >
                      <TextInput
                        type="date"
                        value={yearlyInstallments.dueDate}
                        w={isMobile ? "100px" : "100%"}
                        onChange={(event) =>
                          handleYearlyInstallmentChange(
                            "dueDate",
                            event.currentTarget.value
                          )
                        }
                      />
                    </td>
                    <td
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    >
                      <NumberInput
                        value={yearlyInstallments.amount}
                        w={isMobile ? "100px" : "100%"}
                        onChange={(value) =>
                          handleYearlyInstallmentChange("amount", value)
                        }
                        min={0}
                        hideControls
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
          {selectedFeeOption === FeeOptions.QUARTERLY && (
            <>
              <Flex align="center">
                <Text mr={10}>Start Month:</Text>
                <Select
                  data={datesData}
                  value={
                    selectedMonth
                      ? selectedMonth.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(val) => {
                    if (val) {
                      const date = new Date(val);
                      setSelectedMonth(date);
                    }
                  }}
                ></Select>
              </Flex>
              <Table style={{ marginTop: "2rem" }}>
                <thead>
                  <tr style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}>
                    <th
                      style={{
                        padding: "2px",
                        fontSize: isMobile ? "10px" : "15px",
                        display: isMobile ? "none" : "block",
                        whiteSpace: "nowrap",
                      }}
                    >
                      S No.
                    </th>
                    <th
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    >
                      Name
                    </th>
                    <th
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    >
                      Due Date
                    </th>
                    <th
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    >
                      Amount in ₹
                    </th>
                    <th
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                    ></th>
                  </tr>
                </thead>
                <tbody
                  style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                >
                  {installments.map((installment, index) => (
                    <tr
                      style={{ border: "0.5px solid #D3D3D3", padding: "2px" }}
                      key={index}
                    >
                      <td
                        style={{
                          border: "0.5px thin gray",
                          padding: "2px",
                          display: isMobile ? "none" : "block",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "2px",
                        }}
                      >
                        <TextInput
                          value={installment.name}
                          w={isMobile ? "100px" : "100%"}
                          onChange={(event) =>
                            handleInstallmentChange(
                              index,
                              "name",
                              event.currentTarget.value
                            )
                          }
                        />
                      </td>
                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "2px",
                        }}
                      >
                        <TextInput
                          type="date"
                          value={installment.dueDate}
                          w={isMobile ? "100px" : "100%"}
                          onChange={(event) =>
                            handleInstallmentChange(
                              index,
                              "dueDate",
                              event.currentTarget.value
                            )
                          }
                        />
                      </td>
                      <td
                        style={{
                          border: "0.5px solid #D3D3D3",
                          padding: "2px",
                        }}
                      >
                        <NumberInput
                          value={installment.amount}
                          w={isMobile ? "100px" : "100%"}
                          onChange={(value) =>
                            handleInstallmentChange(index, "amount", value)
                          }
                          min={0}
                          hideControls
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          <Flex justify="right">
            <Button
              onClick={() => {
                if (!selectedMonth && selectedFeeOption === FeeOptions.YEARLY) {
                  showNotification({
                    message: "Start month required!!",
                  });
                  return;
                }
                if (!props.isEditing) {
                  onSubmitCreateBatchFee(selectedFeeOption);
                } else {
                  if (isValid()) {
                    setShowWarning(true);
                  }
                  onSubmitEditData(selectedFeeOption);
                }
              }}
              bg="#3174F3"
              style={{
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
              disabled={!isValid()}
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      </Modal>
      <Modal
        opened={showarning}
        onClose={() => {
          setShowWarning(false);
        }}
        centered
        title="Warning"
        styles={{
          title: {
            color: "black",
            fontWeight: 700,
            fontSize: 20,
          },
        }}
      >
        <Stack>
          <Text>
            Are you sure you want to change course fee? This action will delete
            all previous fee records.
          </Text>
          <Flex justify="right">
            <Button
              onClick={() => {
                setShowWarning(false);
              }}
              color="black"
              style={{
                color: "#000000",
                border: "1px solid #808080",
              }}
              variant="outline"
              size="md"
              mr={10}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (props.isCourseFeesEdit)
                  //   submithandler(props.isCourseFeesEdit._id);
                  setShowWarning(false);
                handleEditBatchFee();
              }}
              size="md"
              bg="#4B65F6"
              style={{
                "&:hover": {
                  backgroundColor: "#3C51C5",
                },
              }}
            >
              Yes
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  );
}
