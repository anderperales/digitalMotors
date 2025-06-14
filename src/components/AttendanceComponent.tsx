import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import { useConstructions } from "@/context/ConstructionContext";
import { useAttendances } from "@/context/AttendanceContext";
import { AttendanceWithUser } from "@/interfaces/Attendance";
import { HiCheckCircle} from "react-icons/hi";
import Badge from "./Badge";

const AttendanceComponent = () => {
  const { data: session } = useSession();
  const { constructions, loadConstructions } = useConstructions();
  const { attendances, createAttendance, loadAttendances } = useAttendances();
  const [selectedConstructionId, setSelectedConstructionId] = useState<number | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const userId = session?.user?.id ? Number(session.user.id) : undefined;
  const userType = session?.user?.type || '';
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    loadConstructions();
    loadAttendances();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error("La geolocalización no es compatible con este navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error);
      }
    );
  };

  
  const openMapModal = (latitude: number | null, longitude: number | null) => {
    if (latitude === null || longitude === null) {
      console.error("Latitud o longitud no disponibles");
      return;
    }
  
    setMapUrl(`https://www.google.com/maps?q=${latitude},${longitude}&output=embed`);
    setIsMapModalOpen(true);
  };
  

  const handleMarkAttendance = async () => {
    if (!userId || !selectedConstructionId || !location) {
      alert(
        "Por favor, seleccionae un proyecto y asegúrate de que la ubicación esté disponible."
      );
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendances = attendances.filter(
      (attendance) =>
        attendance.userId === userId &&
        new Date(attendance.createdAt).getTime() >= today.getTime() &&
        new Date(attendance.createdAt).getTime() < today.getTime() + 24 * 60 * 60 * 1000
    );

    if (todayAttendances.length >= 2) {
      setModalMessage("Ya has marcado asistencia dos veces hoy.");
      setIsModalOpen(true);
      return;
    }

    const isFirstAttendance = todayAttendances.length === 0;
    const message = isFirstAttendance
      ? `Hora de ingreso: ${new Date().toLocaleTimeString()}?`
      : `Hora de salida: ${new Date().toLocaleTimeString()}?`;

    setModalMessage(message);
    setIsModalOpen(true);
  };

  const confirmAttendance = async () => {
    if (!userId || !selectedConstructionId || !location) {
      console.error("Faltan datos para registrar asistencia.");
      return;
    }

    const attendanceData = {
      userId,
      constructionId: selectedConstructionId,
      status: 1,
      notes: null,
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    };

    try {
      await createAttendance(attendanceData);
      loadAttendances();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al marcar asistencia:", error);
    }
  };

  const groupedAttendances = attendances
  .filter(attendance => attendance.construction?.id === selectedConstructionId)
  .reduce((acc, attendance) => {
    const date = new Date(attendance.createdAt).toLocaleDateString();
    const userKey = `${date}-${attendance.user?.id}`;
    
    if (!acc[userKey]) {
      acc[userKey] = {
        date,
        user: attendance.user,
        construction: attendance.construction,
        records: [],
      };
    }
    
    acc[userKey].records.push(attendance);
    return acc;
  }, {} as Record<string, { date: string; user: any; construction: any; records: AttendanceWithUser[] }>);

  return (
    <div className="p-4  bg-gray-100 rounded-lg">
       <div className="mb-4">
          <Badge customColor="bg-bramotors-red" customText="Módulo de Asistencia"></Badge>
        </div>

      <div className="p-4">
        <div className="md:flex block space-y-2 gap-x-2">
          <div>
            <select
              id="construction"
              value={selectedConstructionId || ""}
              onChange={(e) => setSelectedConstructionId(Number(e.target.value))}
              className="text-xs mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled>
                Seleccione un proyecto
              </option>
              {constructions.map((construction) => (
                <option key={construction.id} value={construction.id}>
                  {construction.description}
                </option>
              ))}
            </select>
          </div>
          
      {userType !== 2 && (      
          <button
            onClick={handleMarkAttendance}
            className={`px-2 py-1 ${selectedConstructionId==null ? "bg-gray-400" :  "bg-bramotors-red" } w-full md:w-fit justify-center text-white text-xs rounded-md   ${selectedConstructionId==null ? "" :  "hover:bg-bramotors-red/60" }`}
            disabled={selectedConstructionId==null}
          >
            <div className="flex gap-x-1 justify-center">
            <HiCheckCircle className="text-xl"></HiCheckCircle><span className="text-sm font-semibold"> REGISTRAR</span>
              </div>
          </button>
      )}
        </div>


      <div className="mt-6">
        <h2 className="text-md font-semibold mb-2">Asistencias Registradas</h2>
        
        {selectedConstructionId===null && 
        <>
          <div className="text-sm text-gray-500 font-semibold mb-2">No hay un proyecto seleccionado</div>
        </>}
        <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {Object.values(groupedAttendances).map(({ date, user, construction, records }) => {
            let checkIn = "N/A";
            let checkOut = "PENDIENTE";
            let checkInLocation = null;
            let checkOutLocation = null;

            let checkInLatitude: number | null = null;
            let checkInLongitude: number | null = null;
            let checkOutLatitude: number | null = null;
            let checkOutLongitude: number | null = null;

            // Si hay un solo registro, se considera "Ingreso"
            if (records.length === 1) {
              checkIn = new Date(records[0].createdAt).toLocaleTimeString();
              checkInLocation = `https://www.google.com/maps?q=${records[0].latitude},${records[0].longitude}`;
              checkInLatitude = records[0].latitude;
              checkInLongitude = records[0].longitude;

            }
            
            // Si hay dos registros, el primero es "Ingreso" y el segundo es "Salida"
            if (records.length === 2) {
              checkIn = new Date(records[1].createdAt).toLocaleTimeString();
              checkOut = new Date(records[0].createdAt).toLocaleTimeString();
              checkInLocation = `https://www.google.com/maps?q=${records[1].latitude},${records[1].longitude}`;
              checkOutLocation = `https://www.google.com/maps?q=${records[0].latitude},${records[0].longitude}`;
              checkInLatitude = records[1].latitude;
              checkInLongitude = records[1].longitude;
              checkOutLatitude = records[0].latitude;
              checkOutLongitude = records[0].longitude;
            }

            return (
              <li key={`${date}-${user?.id}`} className="p-4 text-sm gap-y-2 flex-col flex">
                <p><strong>Fecha:</strong> {date}</p>
                <p><strong>Usuario:</strong> {user?.username || "N/A"}</p>
                <p><strong>Proyecto:</strong> {construction?.description || "N/A"}</p>
                <p>
                  <strong>Ingreso:</strong> {checkIn}{" "}
                  {checkInLocation && (
                      <button
                      onClick={() => openMapModal(checkInLatitude, checkInLongitude)}
                      className="text-blue-500 underline"
                    >
                      <Badge customColor="bg-bramotors-red" customText="Ver mapa" />
                    </button>
                  )}
                </p>
                <p><strong>Salida:</strong> {checkOut}{" "}
                {checkOutLocation && (
                    <button
                    onClick={() => openMapModal(checkOutLatitude, checkOutLongitude)}
                    className="text-blue-500 underline"
                  >
                    <Badge customColor="bg-bramotors-red" customText="Ver mapa" />
                  </button>
                )}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      </div>
     

      
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <Dialog.Title className="text-sm text-center font-semibold">{modalMessage}</Dialog.Title>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={confirmAttendance}
                className="px-4 py-2 text-xs bg-bramotors-red font-semibold text-white rounded-md hover:bg-bramotors-red/60"
              >
                CONFIRMAR
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs bg-gray-200 font-semibold text-gray-700 rounded-md hover:bg-gray-300"
              >
                CANCELAR
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Modal del mapa */}
      <Dialog open={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-lg w-full p-4">
            <iframe src={mapUrl} width="100%" height="300" className="rounded-md" loading="lazy"></iframe>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AttendanceComponent;
