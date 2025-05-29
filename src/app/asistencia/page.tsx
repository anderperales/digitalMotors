"use client";
import AttendanceComponent from "@/components/AttendanceComponent";
import { AttendancesProvider } from "@/context/AttendanceContext";
import { ConstructionsProvider } from "@/context/ConstructionContext";
function Attendance() {
  return (
    <div>
            <AttendancesProvider>
                <ConstructionsProvider>
                  <AttendanceComponent></AttendanceComponent>
                </ConstructionsProvider>
            </AttendancesProvider>
    </div>
  );

}

export default Attendance;
