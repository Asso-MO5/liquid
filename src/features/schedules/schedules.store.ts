import { createSignal } from "solid-js";
import type { Schedule } from "./schedules.type";

export const [schedules, setSchedules] = createSignal<Schedule[]>([]);