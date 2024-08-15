import React, { useState, useEffect } from "react";
import firebaseDB from "../firebase";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
    amount: "",
    file: null,
  });
  const [img, setImg] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      firebaseDB.child("submissions").on("value", (snapshot) => {
        if (snapshot.val() !== null) {
          const data = snapshot.val();
          const formattedData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setSubmissions(formattedData);
        }
      });
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;
    const imgRef = ref(storage, `uploads/${uuidv4()}`);
    await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fileUrl = img ? await handleFileUpload(img) : formData.file;
      const formDataWithImgUrl = { ...formData, file: fileUrl };

      if (editId) {
        await firebaseDB.child(`submissions/${editId}`).set(formDataWithImgUrl);
        setEditId(null);
      } else {
        await firebaseDB.child("submissions").push(formDataWithImgUrl);
      }

      setFormData({
        name: "",
        mobileNumber: "",
        address: "",
        amount: "",
        file: null,
      });
      setImg(null);

      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("Failed to submit form.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      firebaseDB.child(`submissions/${id}`).remove();
    }
  };

  const handleEdit = (submission) => {
    setFormData({
      name: submission.name,
      mobileNumber: submission.mobileNumber,
      address: submission.address,
      amount: submission.amount,
      file: submission.file,
    });
    setEditId(submission.id);
  };

  return (
    <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-md">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">
          శ్రీశ్రీశ్రీ కళుగోళ శాంభవీ దేవస్థాన
        </h1>
        <h1 className="text-2xl font-semibold">జీర్ణోద్ధరణ విరాళ నిమిత్తం</h1>
        <h2 className="text-lg">సర్వాయపాళెం, కావలి మండలం, నెల్లూరు జిల్లా</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            పేరు
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="name"
            type="text"
            placeholder="పేరు"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="mobileNumber"
          >
            మొబైల్ నంబర్
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="mobileNumber"
            type="text"
            placeholder="మొబైల్ నంబర్"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="address"
          >
            చిరునామా
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="address"
            type="text"
            placeholder="చిరునామా"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="amount"
          >
            రూ
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="amount"
            type="number"
            placeholder="రూ"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="file">
            Screen Shot
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="file"
            type="file"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          {editId ? "Update" : "Submit"}
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-6">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Mobile Number</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">File</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(
              ({ id, name, mobileNumber, address, amount, file }) => (
                <tr key={id} className="border-b border-gray-200">
                  <td className="px-4 py-2">{name}</td>
                  <td className="px-4 py-2">{mobileNumber}</td>
                  <td className="px-4 py-2">{address}</td>
                  <td className="px-4 py-2">{amount}</td>
                  <td className="px-4 py-2">
                    {file ? (
                      <a href={file} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-2"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      onClick={() =>
                        handleEdit({
                          id,
                          name,
                          mobileNumber,
                          address,
                          amount,
                          file,
                        })
                      }
                    >
                      Update
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Form;
