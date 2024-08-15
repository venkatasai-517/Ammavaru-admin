import { saveAs } from "file-saver";
import { storage, firestore } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

const Photos = () => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [visibleImages, setVisibleImages] = useState(6); // Number of images to show initially
  const [visibleVideos, setVisibleVideos] = useState(6); // Number of videos to show initially
  const initialVisibleItems = 6; // Initial number of items visible
  const [selectedFile, setSelectedFile] = useState(null); // State to track selected file for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Adds"));
        const files = [];
        querySnapshot.forEach((doc) => {
          files.push({ id: doc.id, ...doc.data() });
        });

        const imgFiles = files.filter((file) => file.type.startsWith("image/"));
        const vidFiles = files.filter((file) => file.type.startsWith("video/"));

        setImages(imgFiles);
        setVideos(vidFiles);
      } catch (error) {
        console.error("Error fetching files: ", error.message);
      }
    };

    fetchFiles();
  }, []);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    const uploadPromises = selectedFiles.map(async (file) => {
      try {
        const storageRef = ref(storage, `uploads/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const fileData = {
          url: downloadURL,
          type: file.type,
          name: file.name,
        };

        const docRef = await addDoc(collection(firestore, "uploads"), fileData);
        fileData.id = docRef.id;

        if (file.type.startsWith("image/")) {
          setImages((prevImages) => [...prevImages, fileData]);
        } else if (file.type.startsWith("video/")) {
          setVideos((prevVideos) => [...prevVideos, fileData]);
        }
      } catch (error) {
        console.error("Error uploading file: ", error.message);
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url, { mode: "cors" });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (error) {
      console.error("Download failed", error.message);
    }
  };

  const handleShare = async (url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this file!",
          url,
        });
        console.log("Share successful");
      } catch (error) {
        console.error("Share failed", error.message);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleSeeMoreImages = () => {
    setVisibleImages((prevVisible) => prevVisible + initialVisibleItems);
  };

  const handleSeeLessImages = () => {
    setVisibleImages(initialVisibleItems);
  };

  const handleSeeMoreVideos = () => {
    setVisibleVideos((prevVisible) => prevVisible + initialVisibleItems);
  };

  const handleSeeLessVideos = () => {
    setVisibleVideos(initialVisibleItems);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
          Upload
          <input
            type="file"
            name="upload"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Images</h2>
        <div className="grid grid-cols-3 gap-4">
          {images.slice(0, visibleImages).map((file) => (
            <div
              key={file.id}
              className="relative cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              <img
                className="w-full aspect-square object-cover"
                src={file.url}
                alt={`image-${file.name}`}
              />
            </div>
          ))}
        </div>
        {visibleImages < images.length && (
          <button
            onClick={handleSeeMoreImages}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            See More
          </button>
        )}
        {visibleImages > initialVisibleItems && (
          <button
            onClick={handleSeeLessImages}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            See Less
          </button>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Videos</h2>
        <div className="grid grid-cols-3 gap-4">
          {videos.slice(0, visibleVideos).map((file) => (
            <div
              key={file.id}
              className="relative cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              <video className="w-full aspect-video" controls src={file.url} />
            </div>
          ))}
        </div>
        {visibleVideos < videos.length && (
          <button
            onClick={handleSeeMoreVideos}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            See More
          </button>
        )}
        {visibleVideos > initialVisibleItems && (
          <button
            onClick={handleSeeLessVideos}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            See Less
          </button>
        )}
      </div>

      {isModalOpen && selectedFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 md:p-6 sm:p-8 lg:p-8 rounded shadow-lg relative  max-w-md mx-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>
            {selectedFile.type.startsWith("image/") ? (
              <img
                className="w-50 h-50 mb-4"
                src={selectedFile.url}
                alt={selectedFile.name}
              />
            ) : (
              <video className="w-full mb-4" controls src={selectedFile.url} />
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() =>
                  handleDownload(selectedFile.url, selectedFile.name)
                }
                className=" text-black rounded"
              >
                <i className="bi bi-arrow-down-circle"></i>
              </button>
              <button
                onClick={() => handleShare(selectedFile.url)}
                className=" text-black  rounded"
              >
                <i className="bi bi-share"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
