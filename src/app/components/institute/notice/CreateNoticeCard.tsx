import { Button, Card, Center, Flex, Stack, Text } from "@mantine/core";
import Image from "next/image";
import React from "react";

function CreateNoticeCard() {
  return (
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
            //   onClick={props.onAddBatchButtonClick}
          >
            <Text fz={16} fw={700} c={"#353935"} ff={"Poppins"}>
              Add Batch
            </Text>
          </Button>
        </Flex>
      </Center>
    </Card>
  );
}

export default CreateNoticeCard;
