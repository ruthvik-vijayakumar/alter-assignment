import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_LENGTH = 3;

export default function Dropzone({ files, setFiles }) {
  const cssDropArea = "p-16 mt-10 border-2 border-neutral-200 rounded-xl m-4";
  const cssDragActiveDropArea =
    "p-16 mt-10 border-2 border-indigo-700 rounded-xl m-4";

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Do something with the files
    if (acceptedFiles?.length) {
      setFiles((prevFiles) => {
        if (
          acceptedFiles?.length + (prevFiles ? prevFiles.length : 0) <=
          MAX_LENGTH
        ) {
          return [
            ...prevFiles,
            ...acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
                id: Math.floor(Math.random() * 10000),
              })
            ),
          ];
        } else {
          return prevFiles ? [...prevFiles] : null;
        }
      });
    }
  }, []);

  useEffect(
    (val) => {
      console.log(val);
    },
    [files]
  );

  function handleRemoveFile(name) {
    setFiles((prevFiles) => {
      return prevFiles.filter((elem) => elem.name !== name);
    });
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize: 5242880,
  });
  const [selectedFile, setSelectedFile] = useState(undefined);
  function handleImageSelect(e) {
    console.log(e.target.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const selectedFileId = Object.fromEntries(fd.entries()).file;
    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.id === selectedFileId) Object.assign(file, { selected: true });
        else Object.assign(file, { selected: true });
      });
    });
  }

  return (
    <form onSubmit={handleFormSubmit}>
      {files.length < MAX_LENGTH && (
        <div
          {...getRootProps({
            className: isDragActive ? cssDragActiveDropArea : cssDropArea,
          })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-indigo-700 pl-4">Drop the files here ...</p>
          ) : (
            <p className="text-neutral-600 pl-4">
              Drag 'n' drop some files here, or click to select files
            </p>
          )}
        </div>
      )}
      {files.length >= MAX_LENGTH && (
        <div className="m-4 rounded-xl h-28 border-2 text-center align-text-top border-neutral-200">
          <h3 className="pt-4 font-semibold text-red-500">
            You've reached the image limit
          </h3>
          <p className="p-2 text-neutral-500">
            Remove one or more to upload more images
          </p>
        </div>
      )}

      <ul>
        {files?.map((file, index) => (
          <li key={file.id}>
            <div className="flex justify-between items-center  m-4 rounded-xl">
              <label htmlFor={file.id}>
                <img
                  src={file.preview}
                  alt={file.name}
                  className="object-fill w-20 h-20 rounded-xl ml-4"
                />
              </label>
              <input
                className="mr-6"
                // value={{ name: file.name, id: file.id, preview: file.preview }}
                value={file.id}
                // checked={(selectedFile && selectedFile === file) || undefined}
                // checked={true}
                onChange={handleImageSelect}
                type="radio"
                id={file.id}
                name="file"
              />
            </div>
            <button
              className="  ml-8 mb-4 bg-white hover:bg-gray-100 font-semibold px-2 h-8 text-red-500 rounded shadow "
              onClick={() => handleRemoveFile(file.name)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button
          type="submit"
          className="m-4  bg-white hover:bg-gray-100 text-gray-800 font-semibold mt-4 py-2 px-4 border border-gray-400 rounded shadow"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
