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
    <div className="grid place-content-center w-full bg-secondary">
      <form
        className="flex flex-col gap-6 p-10 bg-white rounded-3xl shadow-md w-[400px]"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Import Expenses
        </h2>

        <label
          htmlFor="csvFile"
          className="flex flex-col text-gray-500 font-medium text-lg gap-2"
        >
          Upload CSV file
          <input
            className="block w-full text-base border border-gray-300 rounded-3xl p-3 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-3xl file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-teal-600"
            type="file"
            name="csvFile"
            accept=".csv"
            onChange={handleChange}
          />
        </label>

        <button
          className="bg-primary text-white py-3 rounded-3xl text-lg font-medium hover:bg-teal-600 hover:cursor-pointer transition duration-200"
          type="submit"
        >
          Upload
        </button>

        {selectedFile && (
          <p className="text-sm text-gray-500 text-center">
            Selected file:{" "}
            <span className="font-semibold">{selectedFile.name}</span>
          </p>
        )}
      </form>
    </div>
  );
}
