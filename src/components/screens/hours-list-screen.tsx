import { useAuth } from "@/auth";
import { db } from "@/config/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Calendar, Clock } from "lucide-react";

export const HoursListScreen = () => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const uid = user.uid;

  const deleteShift = async (shiftId: string) => {
    await deleteDoc(doc(db, "users", uid, "shifts", shiftId));
    console.log(`shift that is deleted is ${shiftId}`);
  };

  const fetchData = async () => {
    setIsLoading(true);
    if (!uid) return;
    const shiftsCollectionRef = collection(db, "users", uid, "shifts");
    const querySnapshot = await getDocs(shiftsCollectionRef);
    const items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setShifts(items);
    setIsLoading(false);
  };

  // TODO: moram provjerit ovaj useEffect mozda mi i ne treba, svakako extractat fetchData funkciju negdje dalje
  // mozda i fetchat ranije smjene npr na loginu? zato da korisnik ne mora cekat loading kad dodje na page a mozda neki cache implementirat?
  useEffect(() => {
    fetchData();
  }, []);

  return isLoading ? (
    <p>'Loading'</p>
  ) : (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            {"Worked Hours"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {"Track your daily work sessions"}
          </p>
        </div>
      </div>

      {/* Mobile-first list */}
      <div className="space-y-3">
        {shifts.length === 0 ? (
          <Card className="p-6 text-center">
            <Clock className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground">
              {"No worked hours recorded yet"}
            </p>
          </Card>
        ) : (
          shifts.map((shift) => (
            <Card
              key={shift.id}
              className="hover:bg-accent/50 p-4 transition-colors"
            >
              <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Date section */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-medium">
                      <pre>{shift.date.toDate().toLocaleString()}</pre>
                    </p>
                  </div>
                </div>

                {/* Time section */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-muted-foreground font-mono text-sm">
                      {shift.shiftStart} - {shift.shiftEnd}
                    </p>
                  </div>
                </div>

                {/* Total hours */}
                <div className="flex justify-end sm:justify-start">
                  <Badge variant="outline" className="font-mono text-xs">
                    {shift.totalHours.hours}h {shift.totalHours.minutes}m
                  </Badge>
                </div>
                <button
                  onClick={() => {
                    deleteShift(shift.id);
                  }}
                  className="absolute -top-8 -right-7 rounded-full bg-red-300 p-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none">
                      <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                      <path
                        fill="currentColor"
                        d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Summary footer for mobile */}
      {shifts.length > 0 && (
        <Card className="bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              {"Total Hours"}
            </span>
            <span className="text-foreground font-mono text-lg font-semibold"></span>
          </div>
        </Card>
      )}
    </div>
  );
};
