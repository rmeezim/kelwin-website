"use client";

import { useEffect, useState } from "react";

interface LocationData {
  city: string;
  timezone: string;
}

function getCityFromTimezone(tz: string): string {
  return tz.split("/").pop()!.replace(/_/g, " ").toUpperCase();
}

function formatTime(timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function LocationTime() {
  const [location, setLocation] = useState<LocationData>({
    city: "LONDON",
    timezone: "Europe/London",
  });
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLocation({ city: getCityFromTimezone(browserTz), timezone: browserTz });

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.city && data.timezone) {
          setLocation({ city: data.city.toUpperCase(), timezone: data.timezone });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const tick = () => setTime(formatTime(location.timezone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [location.timezone]);

  if (!time) return null;

  return (
    <span
      className="text-[12px] tracking-[0.16em] tabular-nums font-body font-medium inline-flex items-center gap-2"
      style={{ color: "var(--text-muted)" }}
    >
      {/* Blinking bronze dot to the left of the city name */}
      <span
        className="inline-block w-1.5 h-1.5 rounded-full bg-bronze shrink-0"
        style={{ animation: "blink 1.6s ease-in-out infinite" }}
      />
      {location.city}
      <span className="text-bronze select-none">|</span>
      {time}
    </span>
  );
}
