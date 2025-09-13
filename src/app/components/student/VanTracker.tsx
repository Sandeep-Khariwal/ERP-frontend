"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GetVanLiveLocation } from "@/axios/student/StudentGetApi";
import { Flex, Image, LoadingOverlay, Stack, Text } from "@mantine/core";
import socket from "@/socket/server";
import MySocket from "@/socket/server";
import { useAppSelector } from "@/app/redux/redux.hooks";

// Fix Leaflet icon path (optional, for some builds)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Device {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  speed: number;
  ignition: number;
  device_time: string;
  odometer: number;
}

function VanTracker(props:{van:string}) {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const socketRef = React.useRef<MySocket | null>(null);
    const student = useAppSelector((state) => state.studentSlice.studentDetails);

  useEffect(() => {
    // Initialize socket client for 'parent'
    socketRef.current = new MySocket();
    socketRef.current.connect();
    if(student?.institute){
        socketRef.current.socket.emit("joinSchool", student?.institute);
    }

    // Listen for 'vanLocationUpdate' events from server
    socketRef.current.on(`vanLocationUpdate:${props.van}`, (updatedDevices: Device[]) => {
      console.log("data updatedDevices : ", updatedDevices);

      setDevices(updatedDevices);

      // Optionally update center to first device if available
      if (updatedDevices.length > 0) {
        setCenter([updatedDevices[0].latitude, updatedDevices[0].longitude]);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [student]);

  if (!center)
    return (
      <Flex
      direction="column"
      align="center"
      justify="center"
    >
        <Text fz={26} fw={600} >Waiting for van location...</Text>
      <Image
        src="/assets/schoolbus.gif"
        alt="Loading van"
        width="100%"
        height="100%"
      />
    </Flex>
    );

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {devices.map((device) => (
        <Marker
          key={device.id}
          position={[device.latitude, device.longitude]}
          icon={vehicleIcon}
        >
          <Popup>
            <strong>{device.name}</strong>
            <br />
            Speed: {device.speed} km/h
            <br />
            Ignition: {device.ignition ? "ON" : "OFF"}
            <br />
            Last Update: {device.device_time}
            <br />
            Odometer: {device.odometer} km
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

// Optional: custom icon if you want
const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [32, 32],
});

export default React.memo(VanTracker);
