import React, { useEffect, useState } from 'react';
import { storage, db } from './firebase'; // Adjust the path as per your project structure
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [storedUrls, setStoredUrls] = useState([]);
  const [comments, setComments] = useState({});
  const [editModeId, setEditModeId] = useState(null); // Track which comment is being edited

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCommentChange = (id, e) => {
    const { value } = e.target;
    setComments((prevComments) => ({
      ...prevComments,
      [id]: value,
    }));
  };

  const handleCommentKeyDown = async (id, e) => {
    if (e.key === 'Enter') {
      await handleCommentUpdate(id);
    }
  };

  const handleCommentUpdate = async (id) => {
    try {
      await updateDoc(doc(db, 'images', id), {
        comments: comments[id] || '',
      });
      console.log('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setEditModeId(null); // Reset edit mode after updating
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await deleteDoc(doc(db, 'images', id));
      setStoredUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));
      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        delete updatedComments[id];
        return updatedComments;
      });
      console.log('Image and comments deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleLikeDislike = async (id, type) => {
    const docRef = doc(db, 'images', id);
    const currentValue = storedUrls.find((url) => url.id === id)[type];

    try {
      await updateDoc(docRef, {
        [type]: currentValue + 1,
      });
      setStoredUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === id ? { ...url, [type]: currentValue + 1 } : url
        )
      );
      console.log(`${type} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `images/${uuidv4()}_${file.name}`);

      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        const imageDocRef = await addDoc(collection(db, 'images'), {
          name: file.name,
          url: url,
          createdAt: new Date(),
          comments: '',
          likes: 0,
          dislikes: 0,
        });

        setStoredUrls((prevUrls) => [
          ...prevUrls,
          { id: imageDocRef.id, url: url, comments: '', likes: 0, dislikes: 0 },
        ]);

        setImageUrl('');
        setFile(null);
      } catch (error) {
        console.error('Error uploading file or adding document to Firestore:', error);
      }
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'images'));
        const urlsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStoredUrls(urlsArray);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Upload Image to Firebase</h1>
      <input type="file" onChange={handleFileChange} />
      {imageUrl && (
        <div>
          <h2>Image Preview:</h2>
          <img
            src={imageUrl}
            alt="Preview"
            style={{ maxWidth: '5%', maxHeight: '5%', objectFit: 'contain' }}
          />
          <button onClick={handleFileUpload}>Upload</button>
        </div>
      )}

      <div>
        <h2>Stored Images:</h2>
        {storedUrls.map((storedUrl) => (
          <div key={storedUrl.id}>
            <img
              src={storedUrl.url}
              alt={`Uploaded`}
              style={{ maxWidth: '10%', maxHeight: '10%', objectFit: 'contain' }}
            />
            <input
              type="text"
              value={comments[storedUrl.id] || ''}
              onChange={(e) => handleCommentChange(storedUrl.id, e)}
              onKeyDown={(e) => handleCommentKeyDown(storedUrl.id, e)}
              placeholder="Add a comment..."
              disabled={editModeId !== storedUrl.id}
            />
            {editModeId !== storedUrl.id ? (
              <button onClick={() => setEditModeId(storedUrl.id)}>Edit Comment</button>
            ) : (
              <button
                disabled={!comments[storedUrl.id]}
                onClick={() => handleCommentUpdate(storedUrl.id)}
              >
                Save
              </button>
            )}
            <button onClick={() => handleDeleteImage(storedUrl.id)}>Delete</button>
            <button onClick={() => handleLikeDislike(storedUrl.id, 'likes')}>
              Like ({storedUrl.likes})
            </button>
            <button onClick={() => handleLikeDislike(storedUrl.id, 'dislikes')}>
              Dislike ({storedUrl.dislikes})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
