import type { RoomStatus } from "../constants";

type BadgeStatus = {
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
};

export const getBadgeStatus = (status: RoomStatus): BadgeStatus => {
  switch (status) {
    case "occupied":
      return { variant: "default", label: "Ocupado" };
    case "vacant":
      return { variant: "secondary", label: "Disponible" };
    case "reserved":
      return { variant: "outline", label: "Reservado" };
    case "maintenance":
      return { variant: "destructive", label: "En mantenimiento" };
  }
};