"use client";

import {
  Box,
  Button,
  Flex,
  TextInput,
  Textarea,
  Text,
  Image,
  Title,
  Group,
  Tooltip,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import {
  IconBrandYoutube,
  IconBrandWhatsapp,
  IconBrandInstagram,
} from "@tabler/icons-react";
import axios from "axios";

const contactFormImage = "/Contact-FormBG.png";
const contactUsImage = "/ContactUs.webp";

export default function ContactForm() {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const isSmallMobile = useMediaQuery("(max-width: 480px)");

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(
        "http://localhost:8080/api/v1/shikshapay/contact",
        form.values
      );
      setSuccessMsg("Your message has been sent successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const socialIcons = [
    {
      name: "youtube",
      icon: IconBrandYoutube,
      color: "#FF0000",
      link: "https://www.youtube.com/@sandeep_khariwal8137",
    },
    {
      name: "whatsapp",
      icon: IconBrandWhatsapp,
      color: "#25D366",
      link: "https://wa.me/+919416059799",
    },
    {
      name: "instagram",
      icon: IconBrandInstagram,
      color: "#E1306C",
      link: "https://www.instagram.com/ksjunction.in/",
    },
  ];

  return (
    <Box
      id="Contact"
      style={{
        background: isMobile
          ? "#ffffff"
          : "linear-gradient(to bottom right, #1e3b8a75, #ffffff)",
        width: "100%",
        minHeight: "100vh",
        padding: isMobile ? (isSmallMobile ? "0.5rem" : "0.5rem") : "5%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Flex
        justify="space-around"
        p={isMobile ? "0rem" : "0rem 4rem"}
        direction={isMobile ? "column" : "row"}
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "1000px",
          backgroundImage: isMobile ? "none" : `url(${contactFormImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "95%",
          backgroundPosition: "center",
        }}
        align="center"
      >
        {/* Form Section */}
        <Flex
          direction="column"
          gap="sm"
          p={isMobile ? (isSmallMobile ? "1rem 1rem" : "2rem 1.5rem") : "3rem"}
          w={isMobile ? "100%" : "40%"}
          maw={isMobile ? "600px" : "none"}
          style={{
            backgroundColor: isMobile
              ? "rgba(255, 255, 255, 0.95)"
              : "transparent",
            borderRadius: isMobile ? "12px" : "0px",
            boxShadow: isMobile ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "none",
          }}
          mx="auto"
        >
          <Title order={2} c="#1e3a8a">
            Let's talk
          </Title>
          <Text size="sm" c="dimmed">
            To request a quote or want to meet up for coffee, contact us
            directly or fill out the form and we will get back to you promptly.
          </Text>
          <TextInput
            required
            label="Your Name"
            radius="md"
            {...form.getInputProps("name")}
          />
          <TextInput
            required
            label="Your Email"
            radius="md"
            {...form.getInputProps("email")}
          />
          <Textarea
            required
            label="Your Message"
            placeholder="Type something if you want ..."
            radius="md"
            minRows={3}
            maxRows={5}
            {...form.getInputProps("message")}
          />
          <Button
            radius="xl"
            mt="md"
            fullWidth
            loading={loading}
            onClick={handleSubmit}
          >
            Send Message
          </Button>
          {successMsg && <Text c="green">{successMsg}</Text>}
          {errorMsg && <Text c="red">{errorMsg}</Text>}
        </Flex>

        {/* Right Info Section (Hidden on mobile) */}
        {!isMobile && (
          <Flex
            direction="column"
            w="40%"
            h="100%"
            justify="space-around"
            p="4rem 0"
            mr="1rem"
          >
            <Image
              src={contactUsImage}
              w="350px"
              h="200px"
              alt="contact"
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
            <Flex direction="column" gap={"1rem"} c="gray">
              <Flex mt={"0.5rem"} w={"fit-content"} gap={"md"}>
                <FaLocationPin />
                <Text size="0.90rem">
                  1st Floor, Sai Complex, Barnala Rd, above DCB Bank, Sirsa,
                  Haryana 125055
                </Text>
              </Flex>
              <Group>
                <FaPhoneAlt />
                <Text size="0.90rem">94160-59799</Text>
              </Group>
              <Group>
                <MdEmail />
                <Text size="0.90rem">sandeepkhariwal01@gmail.com</Text>
              </Group>
            </Flex>

            {/* Social Icons */}
            <Group gap="xl" mt="xl" px="xl">
              {socialIcons.map(({ name, icon: Icon, color, link }) => (
                <Tooltip
                  key={name}
                  label={name.charAt(0).toUpperCase() + name.slice(1)}
                  position="top"
                  withArrow
                  color={color}
                  arrowSize={6}
                  offset={8}
                >
                  <Box
                    component="a"
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredIcon(name)}
                    onMouseLeave={() => setHoveredIcon(null)}
                    style={{
                      background: hoveredIcon === name ? color : "#fff",
                      color: hoveredIcon === name ? "#fff" : "#555",
                      borderRadius: "50%",
                      width: rem(42),
                      height: rem(42),
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "all 0.3s ease",
                      transform:
                        hoveredIcon === name ? "scale(1.2)" : "scale(1)",
                      boxShadow: "0 10px 10px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    }}
                  >
                    <Icon size={20} />
                  </Box>
                </Tooltip>
              ))}
            </Group>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
