import { useAuth } from "@/auth";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export const HoursListScreen = () => {
  const [shifts, setShifts] = useState<any[]>([])
  const { user } = useAuth();
  const uid = user.uid;

  const fetchData = async () => {
    if (!uid) return;
    const shiftsCollectionRef = collection(db, "users", uid, "shifts");
    const querySnapshot = await getDocs(shiftsCollectionRef);
    const items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setShifts(items);
  };

  useEffect(() => {
    fetchData();
  }, [uid]);

  return (
    <div>
      <h2>HoursListScreen</h2>
      {shifts.length === 0 ? (
        <div>No shifts found.</div>
      ) : (
        <ul>
          {shifts.map((shift: any) => (
            <li key={shift.id}>
              {/*<pre>{JSON.stringify(shift.date, null, 2)}</pre>*/}
              <pre>{JSON.stringify(shift.shiftStart, null, 2)}</pre>
              <pre>{JSON.stringify(shift.shiftEnd, null, 2)}</pre>
              <pre>{JSON.stringify(shift.totalHours, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
