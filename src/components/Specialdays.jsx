import { useState, useEffect } from "react";
import { db1 } from "../firebase.jsx"; // adjust the path as needed
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const Special = () => {
  const [specialDay, setSpecialDay] = useState("");
  const [yearMonth, setYearMonth] = useState("");
  const [specialDays, setSpecialDays] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db1, "specialDays"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSpecialDays(data);
    };

    fetchData();
  }, []);

  const addSpecialDay = async () => {
    try {
      const docRef = await addDoc(collection(db1, "specialDays"), {
        specialDay,
        yearMonth,
      });
      console.log("Document written with ID: ", docRef.id);
      setSpecialDays([
        ...specialDays,
        { id: docRef.id, specialDay, yearMonth },
      ]);
      setSpecialDay("");
      setYearMonth("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteSpecialDay = async (id) => {
    try {
      await deleteDoc(doc(db1, "specialDays", id));
      setSpecialDays(specialDays.filter((day) => day.id !== id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const startEditing = (id, currentSpecialDay, currentYearMonth) => {
    setEditingId(id);
    setSpecialDay(currentSpecialDay);
    setYearMonth(currentYearMonth);
  };

  const updateSpecialDay = async () => {
    try {
      const docRef = doc(db1, "specialDays", editingId);
      await updateDoc(docRef, {
        specialDay,
        yearMonth,
      });
      setSpecialDays(
        specialDays.map((day) =>
          day.id === editingId ? { id: editingId, specialDay, yearMonth } : day
        )
      );
      setEditingId(null);
      setSpecialDay("");
      setYearMonth("");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <>
      <div className="max-w-full mx-auto p-4 pt-5 sm:p-6 lg:p-8 text-yellow-500">
        <div className="overflow-x-auto bg-red-600">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            Special days
          </h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Special Day"
              required
              value={specialDay}
              onChange={(e) => setSpecialDay(e.target.value)}
              className="mr-2 px-2 py-1"
            />
            <input
              type="date"
              placeholder="Year/Month"
              value={yearMonth}
              required
              onChange={(e) => setYearMonth(e.target.value)}
              className="mr-2 px-2 py-1"
            />
            {editingId ? (
              <button
                onClick={updateSpecialDay}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            ) : (
              <button
                type="submit"
                onClick={addSpecialDay}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Special Day
              </button>
            )}
          </div>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Special Day</th>
                <th className="px-4 py-2 text-left">Year/Month</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {specialDays.map(({ id, specialDay, yearMonth }) => (
                <tr
                  key={id}
                  className="text-yellow-50 border-b border-yellow-500"
                >
                  <td className="px-2 md:px-4 py-2">{specialDay}</td>
                  <td className="px-2 md:px-4 py-2">{yearMonth}</td>
                  <td className="px-2 md:px-4 py-2">
                    <button
                      onClick={() => startEditing(id, specialDay, yearMonth)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSpecialDay(id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Special;
