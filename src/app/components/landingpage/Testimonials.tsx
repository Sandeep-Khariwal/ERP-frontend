import React from "react";
import { Flex, Box, Text, Group, Image } from "@mantine/core";

const Testimonials = () => {
  return (
    <>
      <Flex gap={"xl"} p={"0 10% 10%"}>
        <Flex
          direction={"column"}
          w={"45%"}
          style={{
            gap: "1.25rem",
          }}
        >
          <Box
            className="animate-item features-title"
            style={{
              width: "fit-content",
              backgroundColor: "#F2E6E6",
              padding: "5px 1rem",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Testimonials
          </Box>
          <Flex gap={"xl"}>
            <Box>
              <Image
                style={{
                  marginTop: "5%",
                  fontSize: "1.5rem",
                  color: "blue",
                  background:
                    "linear-gradient(to bottom, #b9c9f5ff 0%, #ffffff 100%)",
                  padding: "10px",
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                }}
              ></Image>
            </Box>
            <Box>
              <Flex direction={"column"}>
                <Text style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                  Accelerate Efficiency
                </Text>
                <Text style={{ fontSize: "0.85rem" }}>
                  Supercharge your school’s operations with automation and smart
                  workflows. SikshaPay reduces manual workload, helping staff
                  focus on what truly matters—educating students.
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Testimonials;
