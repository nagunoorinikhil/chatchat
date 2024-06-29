// // FileUpload.js
// import React, { useEffect, useState } from 'react';
// import { storage, db } from './firebase'; // Adjust the path as per your project structure
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { collection, addDoc ,setDoc, getDocs} from 'firebase/firestore';
// import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// const FileUpload = () => {

//   const [file, setFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState('');
//   const [storedUrls, setStoredUrls] = useState([]);
//   const [comments, setComments] = useState({});
//   // const [commentInput, setCommentInput] = useState('');
//   let imageIds=1200;

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);

//       const reader = new FileReader();
//       reader.onload = () => {
//         setImageUrl(reader.result);
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   };

//   const handleCommentChange = (imageId, e) => {
//     const { value } = e.target;
//     setComments((prevComments) => ({
//       ...prevComments,
//       [imageIds]: value,
//     }));
//   };


//   const handleFileUpload = async () => {
//     if (file) {
//       const storageRef = ref(storage, `images/${uuidv4()}_${file.name}`);

//       try {
//         imageIds=imageIds+1

//         await uploadBytes(storageRef, file);
//         const url = await getDownloadURL(storageRef);
//         console.log("File uploaded, URL:", url);

//         // Store the image URL in Firestore
        
//         const imageDocRef = await addDoc(collection(db, 'images'), {
//           name: file.name,
//           url: url,
//           createdAt: new Date()
//         });
//         console.log("Document added to Firestore with ID:", imageDocRef.id);

//         // Save URL in local storage
//         const updatedStoredUrls = [...storedUrls, { id: imageIds, url: url }];
//         console.log("Updated stored URLs:", updatedStoredUrls);
//         localStorage.setItem('storedUrls', JSON.stringify(updatedStoredUrls));
//         setStoredUrls(updatedStoredUrls);

//         setImageUrl('');
//         setFile(null);
//         console.log('File uploaded successfully:', url);
//       } catch (error) {
//         console.error('Error uploading file or adding document to Firestore:', error);
//       }
//     }
//   };

//   // Load stored URLs from local storage on component mount
//   // useEffect(() => {
//   //   const storedUrlsString = localStorage.getItem('storedUrls');
//   //   if (storedUrlsString) {
//   //     const storedUrlsArray = JSON.parse(storedUrlsString);
//   //     setStoredUrls(storedUrlsArray);
//   //   }
//   // }, []);
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'images'));
//         const urlsArray = querySnapshot.docs.map(doc => doc.data());
//         console.log(urlsArray);
//         setStoredUrls(urlsArray);
//       } catch (error) {
//         console.error("Error fetching images: ", error);
//       }
//     };

//     fetchImages();
//   }, []);

//   return (
//     <div>
     
//       <h1>Upload Image to Firebase</h1>
//       <input type="file" onChange={handleFileChange} />
//       {imageUrl && (
//         <div>
//           <h2>Image Preview:</h2>
//           <img src={imageUrl} alt="Preview" style={{ maxWidth: '5%', maxHeight: '5%', objectFit: 'contain' }} />
//           <button onClick={handleFileUpload}>Upload</button>
//         </div>
//       )}



//       <div>
//         <h2>Stored Images:</h2>
     

//         {storedUrls.map((storedUrl, index) => (
//           <div key={index}>
//             <p>Image :   {imageIds}</p>
//             <img src={storedUrl.url} alt={`Uploaded ${index}`} style={{ maxWidth: '10%', maxHeight: '10%', objectFit: 'contain' }} />
//             <input
//               type="text" key={imageIds}
//               value={comments[imageIds] || ''}
//               onChange={(e) => handleCommentChange(imageIds, e)}
//               placeholder="Add a comment..."
//             />
//           </div>

          

//         ))}
      
//       </div>
//     </div>
//   );
// };

// export default FileUpload;
