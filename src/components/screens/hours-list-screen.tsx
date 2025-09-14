import { useAuth } from "@/auth";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";

export const HoursListScreen = () => {
  const { user } = useAuth();
  const uid = user.uid;

  const fetchData = async () => {
    const shiftsColRef = collection(db, "users", uid, "shifts");
    const querySnapshot = await getDocs(shiftsColRef);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <div>HoursListScreen</div>;
};
