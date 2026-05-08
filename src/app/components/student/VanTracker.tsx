import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Stack, Text, Loader } from "@mantine/core";
import { socket } from "@/socket/MySocket";

interface VanTrackerProps {
  instituteId: string;
  van: string;
}

function VanTracker({ van, instituteId }: VanTrackerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(()=>{

    console.log("van platNum : ",van);
  },[])
  
  const [isConnected, setIsConnected] = useState<boolean>(true);

  // always create a fresh socket when component mounts
//   const socketInstance = useMemo(() => new MySocket(), []);

  const handleLocationUpdate = useCallback((devices: any[]) => {
    console.log("📡 Van update received:", devices);

    if (devices && devices.length > 0) {
      const device = devices[0];
      console.log("device : ",);
      
      const lat = device.latitude ?? device.lat ?? device.position?.lat ?? null;
      const lng =
        device.longitude ?? device.lng ?? device.position?.lng ?? null;

      if (lat && lng) {
        setPosition({ lat: Number(lat), lng: Number(lng) });
      }
    }
  }, []);

  useEffect(() => {
    console.log("COMPONENT MOUNTED");

    const onConnect = () => {
      console.log("✅ CONNECT EVENT FIRED");
      console.log("socket id:", socket.id);

      socket.emit("joinSchool", instituteId);
    };

    const onDisconnect = (reason: string) => {
      console.log("❌ disconnected:", reason);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on(`vanLocationUpdate:${van}`, handleLocationUpdate);

    // connect AFTER listeners
    if (!socket.connected) {
      socket.connect();
    } else {
      onConnect();
    }

    return () => {
      console.log("cleanup");

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(`vanLocationUpdate:${van}`, handleLocationUpdate);
    };
  }, [van, instituteId, handleLocationUpdate]);

  return (
    <Stack w={"100%"}  >
      <Text ta={"center"} c={"green"} fz={24} fw={600}>Live Tracking – {van}</Text>

      {!isConnected ? (
        <Stack align="center" justify="center" p="md">
          <Loader size="sm" />
          <Text c="red" size="sm">
            Disconnected – waiting for reconnect…
          </Text>
        </Stack>
      ) : position ? (
        <iframe
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${position.lat},${position.lng}&z=15&output=embed`}
        />
      ) : (
        <Text c="dimmed" fw={600} ta={"center"} >Waiting for live location…</Text>
      )}
    </Stack>
  );
}

export default VanTracker;