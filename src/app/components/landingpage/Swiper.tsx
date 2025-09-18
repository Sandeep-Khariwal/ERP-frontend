import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import { Box, Flex, Stack, Text, Title } from "@mantine/core";

// Import Swiper style
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useMediaQuery } from "@mantine/hooks";

const allSlides = [
  {
    tittle: "Admin & user side Dashboard",
    subtitle: "From here you can add new staff and create new batch!!",
    img: "/assets/slide1.jpg",
  },
  {
    tittle: "Inside the batch",
    subtitle:
      "This is the overview tab inside the batch. here you will get the information about the batch!!",
    img: "/assets/slide2.jpg",
  },
  {
    tittle: "Student tab inside the batch",
    subtitle:
      "Inside student tab you can check all the students information with their fee status!!",
    img: "/assets/slide3.jpg",
  },
  {
    tittle: "teacher tab inside the batch",
    subtitle:
      "Inside teacher tab you can check all the teacger information and edit them",
    img: "/assets/slide4.jpg",
  },
];

const SwiperSection = () => {
      const isMd = useMediaQuery(`(max-width: 968px)`);
  return (
    <>
      <Flex w={"100%"} bg={"#E6E1FF"} direction={isMd?"column":"row"} align={"center"} justify={"space-around"} mih={isMd?"60vh":"100vh"}>
        <Flex
          direction={"column"}
          align={"center"}
          justify={"center"}
          w={isMd?"100%":"30%"}
          h={"100%"}
        >
          <Box
            className="animate-item features-title"
            style={{
              width: "fit-content",
              backgroundColor: "#fff",
              padding: "5px 1rem",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Dashboard view experience
          </Box>

          <ul style={{display:isMd?"hidden":"block"}} >
            <li>
              {" "}
              <p
                style={{
                  fontSize: "1rem",
                }}
              >
                Admin & user Dashboard for add new staff member or create a new
                class in institute
              </p>
            </li>
            <li>
              {" "}
              <p
                style={{
                  fontSize: "1rem",
                }}
              >
                Overview tab to check detail information about the batch
              </p>
            </li>
            <li>
              {" "}
              <p
                style={{
                  fontSize: "1rem",
                }}
              >
                Student tab to check student present in tab with thier fee
                status
              </p>
            </li>
            <li>
              {" "}
              <p
                style={{
                  fontSize: "1rem",
                }}
              >
                teacher tab to monitor the all students who teaching in that
                class
              </p>
            </li>
          </ul>
        </Flex>
        <Flex align={"center"} justify={"center"} w={isMd?"100%":"70%"} h={"100%"}>
          <Flex
            w={"80%"}
            h={isMd?"30vh":"80vh"}
            justify={"center"}
            style={{
              backgroundImage: "url('/assets/computer-frame.png')", // Path to your computer frame image
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Flex align={"center"} justify={"center"} w={isMd?"95%":"80%"} h={isMd?"90%":"85%"}>
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                  delay: 5000,
                }}
                className="swip"
              >
                {allSlides.map((slide) => (
                  <SwiperSlide>
                    <Flex w={"100%"}>
                      <img
                        src={slide.img}
                        alt="slide1"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Flex>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default SwiperSection;
