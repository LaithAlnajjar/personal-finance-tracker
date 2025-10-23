import { api } from "../lib/api";
import { useState, type SyntheticEvent, type ChangeEvent } from "react";

export default function ImportCSV() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    try {
      const response = await api.post("/api/import", formData);
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) setSelectedFile(files[0]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="csvFile" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
