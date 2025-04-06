import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadAudioCard = () => {
  const numCircles = 6;
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateRandomMovement = () => ({
    x: [Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150],
    y: [Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150],
  });

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [] },
    maxSize: 100 * 1024 * 1024,
    noClick: true,
  });

  const handleSubmit = async () => {
    if (!uploadedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("audio", uploadedFile);

    try {
      const res = await axios.post("http://localhost:5000/predict", formData);
      const result = res.data;

      navigate("/audio-analysis-result", {
        state: {
          fileName: uploadedFile.name,
          prediction: result,
        },
      });
    } catch (error) {
      console.error("Error uploading:", error);
      navigate("/audio-analysis-result", {
        state: {
          fileName: uploadedFile.name,
          prediction: { error: "Prediction failed. Try again." },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`relative flex flex-col items-center justify-center rounded-3xl bg-gradient-to-r from-[#0a0a0a] to-[#171717] shadow-lg overflow-hidden border-2 border-dashed ${
        isDragActive ? "border-blue-400 bg-opacity-80" : "border-gray-500"
      } p-6 transition-all duration-200`}
    >
      {/* Dropzone input (hidden visually) */}
      <input {...getInputProps()} style={{ display: "none" }} />

      {/* Background motion circles */}
      {[...Array(numCircles)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 bg-blue-500 opacity-25 rounded-full blur-3xl"
          animate={generateRandomMovement()}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative text-center h-60 w-[1400px] z-10 flex flex-col items-center">
        <h1 className="text-white text-xl font-bold">Upload Audio For Analysis</h1>
        <p className="text-gray-400 text-sm mb-4">Instantly analyze your audio using Dhwani4u</p>

        {/* Upload button */}
        <div
          className="cursor-pointer flex flex-col items-center justify-center w-56 h-20 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition relative overflow-hidden"
          onClick={() => {
            document.getElementById("hiddenAudioInput").click();
          }}
        >
          <UploadCloud size={24} className="mb-2" />
          <span className="text-base font-medium">Choose Audio File</span>
        </div>

        {/* Hidden input outside Dropzone */}
        <input
          type="file"
          id="hiddenAudioInput"
          accept="audio/*"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.length > 0) {
              setUploadedFile(e.target.files[0]);
            }
          }}
        />

        <p className="text-gray-400 text-xs mt-2">or, drop the file here</p>
        <p className="text-gray-500 text-xs mt-2">
          {/* Max file size: 100MB (<a className="text-blue-500 underline">Sign up</a> to increase) */}
          File type: MP3/WAV
        </p>

        {/* File uploaded + submit */}
        {uploadedFile && (
          <div className="mt-4 flex flex-col items-center gap-3">
            <p className="text-green-400 text-sm">Uploaded: {uploadedFile.name}</p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition text-base"
            >
              {loading ? "Analyzing..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAudioCard;






// import { motion } from "framer-motion";
// import { UploadCloud } from "lucide-react";

// const UploadAudioCard = () => {
//   const numCircles = 6; // Background floating elements

//   const generateRandomMovement = () => ({
//     x: [Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150],
//     y: [Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150]
//   });

//   return (
//     <div className="relative flex flex-col items-center justify-center h-60 w-[1000px] rounded-3xl bg-gradient-to-r from-[#0a0a0a] to-[#171717] shadow-lg overflow-hidden border-2 border-dashed border-gray-500">
      
//       {/* Floating Background Elements */}
//       {[...Array(numCircles)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-40 h-40 bg-blue-500 opacity-25 rounded-full blur-3xl"
//           animate={generateRandomMovement()}
//           transition={{ duration: 6 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
//           style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
//         />
//       ))}

//       {/* Main Content */}
//       <div className="relative text-center z-10 flex flex-col items-center">
//         <h1 className="text-white text-2xl font-bold">Upload Audio For Analysis</h1>
//         <p className="text-gray-400 text-sm mb-4">Instantly analyse your audio using Dhwani4u</p>

//         {/* Upload Button */}
//         <label className="cursor-pointer flex flex-col items-center justify-center w-60 h-20 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition">
//           <UploadCloud size={30} className="mb-2" />
//           <input type="file" accept="audio/*" className="hidden" />
//           <span className="text-lg font-medium">Choose Audio File</span>
//         </label>
        
//         <p className="text-gray-400 text-sm mt-2">or, drop the file here</p>
//         <p className="text-gray-500 text-xs mt-2">Maximum file size: 100MB (<a href="#" className="text-blue-500 underline">Sign up</a> to increase this limit)</p>
//       </div>
//     </div>
//   );
// };

// export default UploadAudioCard;








// import { motion } from "framer-motion";
// import { UploadCloud } from "lucide-react";
// import { useDropzone } from "react-dropzone";
// import { useCallback, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UploadAudioCard = () => {
//   const numCircles = 6;
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const generateRandomMovement = () => ({
//     x: [Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150],
//     y: [Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150],
//   });

//   const onDrop = useCallback((acceptedFiles) => {
//     if (acceptedFiles.length > 0) {
//       setUploadedFile(acceptedFiles[0]);
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "audio/*": [] },
//     maxSize: 100 * 1024 * 1024,
//     noClick: true,
//   });

//   const handleSubmit = async () => {
//     if (!uploadedFile) return;
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("audio", uploadedFile);

//     try {
//       const res = await axios.post("http://localhost:5000/predict", formData);
//       const result = res.data;

//       navigate("/audio-analysis-result", {
//         state: {
//           fileName: uploadedFile.name,
//           prediction: result,
//         },
//       });
//     } catch (error) {
//       console.error("Error uploading:", error);
//       navigate("/audio-analysis-result", {
//         state: {
//           fileName: uploadedFile.name,
//           prediction: { error: "Prediction failed. Try again." },
//         },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       {...getRootProps()}
//       className={`relative flex flex-col items-center justify-center rounded-3xl bg-gradient-to-r from-[#0a0a0a] to-[#171717] shadow-lg overflow-hidden border-2 border-dashed ${
//         isDragActive ? "border-blue-400 bg-opacity-80" : "border-gray-500"
//       } p-6 transition-all duration-200`}
//     >
//       <input {...getInputProps()} />

//       {[...Array(numCircles)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-20 h-20 bg-blue-500 opacity-25 rounded-full blur-3xl"
//           animate={generateRandomMovement()}
//           transition={{
//             duration: 6 + Math.random() * 3,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           style={{
//             top: `${Math.random() * 100}%`,
//             left: `${Math.random() * 100}%`,
//           }}
//         />
//       ))}

//       <div className="relative text-center z-10 flex flex-col items-center w-full">
//         <h1 className="text-white text-xl font-bold">Upload Audio For Analysis</h1>
//         <p className="text-gray-400 text-sm mb-4">Instantly analyze your audio using Dhwani4u</p>

//         <div
//           className="cursor-pointer flex flex-col items-center justify-center w-56 h-20 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition relative overflow-hidden"
//           onClick={() => document.getElementById("hiddenAudioInput").click()}
//         >
//           <UploadCloud size={24} className="mb-2" />
//           <span className="text-base font-medium">Choose Audio File</span>
//           <input
//             type="file"
//             id="hiddenAudioInput"
//             accept="audio/*"
//             className="absolute inset-0 opacity-0 cursor-pointer"
//             onChange={(e) => onDrop(Array.from(e.target.files))}
//           />
//         </div>

//         <p className="text-gray-400 text-xs mt-2">or, drop the file here</p>
//         <p className="text-gray-500 text-xs mt-2">
//           Max file size: 100MB (<a className="text-blue-500 underline">Sign up</a> to increase)
//         </p>

//         {uploadedFile && (
//           <div className="mt-4 flex flex-col items-center gap-3">
//             <p className="text-green-400 text-sm">Uploaded: {uploadedFile.name}</p>
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition text-base"
//             >
//               {loading ? "Analyzing..." : "Submit"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadAudioCard;






// import React, { useState } from 'react';
// import axios from 'axios';
// import { UploadCloud } from 'lucide-react';


// const UploadAudioCard = () => {
//   const [audioFile, setAudioFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     if (file && file.type.startsWith('audio/')) {
//       setAudioFile(file);
//       setResult(null);
//     }
//   };

//   const handleBrowse = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith('audio/')) {
//       setAudioFile(file);
//       setResult(null);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!audioFile) return;

//     const formData = new FormData();
//     formData.append('audio', audioFile);

//     setLoading(true);
//     try {
//       const response = await axios.post('http://localhost:5000/predict', formData);
//       setResult(response.data);
//     } catch (err) {
//       console.error(err);
//       setResult({ error: 'Prediction failed. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-4 w-full max-w-md mx-auto space-y-4">
//       <div
//         onDrop={handleDrop}
//         onDragOver={(e) => e.preventDefault()}
//         className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer"
//         onClick={() => document.getElementById('audioInput').click()}
//       >
//         <UploadCloud className="w-10 h-10 text-blue-500" />
//         <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Drag & drop or click to upload audio (MP3/WAV)</p>
//         <input
//           id="audioInput"
//           type="file"
//           accept="audio/*"
//           onChange={handleBrowse}
//           hidden
//         />
//       </div>

//       {audioFile && (
//         <p className="text-sm text-gray-700 dark:text-gray-300">Selected: {audioFile.name}</p>
//       )}

//       <button
//         onClick={handleSubmit}
//         disabled={!audioFile || loading}
//         className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
//       >
//         {loading ? 'Analyzing...' : 'Predict Gender & Age'}
//       </button>

//       {result && !result.error && (
//         <div className="text-center text-lg font-medium mt-2 text-zinc-800 dark:text-zinc-100">
//           <p>🧑‍💼 Gender: <span className="font-semibold">{result.gender}</span></p>
//           <p>🎂 Age Group: <span className="font-semibold">{result.age}</span></p>
//         </div>
//       )}

//       {result?.error && (
//         <p className="text-red-600 text-center">{result.error}</p>
//       )}
//     </div>
//   );
// };

// export default UploadAudioCard;
