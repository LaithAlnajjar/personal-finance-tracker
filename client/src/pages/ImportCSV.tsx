import { api } from "../lib/api";
import { useState, type SyntheticEvent, type ChangeEvent } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ImportCSV() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setStatus({ type: "error", message: "Please select a file first!" });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: "" });
    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    try {
      await api.post("/api/import", formData);
      setStatus({ type: "success", message: "File uploaded successfully!" });
      setSelectedFile(null);

      const fileInput = document.getElementById("csvFile") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to upload file. Please check the format.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setStatus({ type: null, message: "" });
    }
  };

  return (
    <div className="grid place-content-center w-full bg-secondary min-h-full">
      <form
        className="flex flex-col gap-6 p-10 bg-white rounded-3xl shadow-md w-[400px]"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Import Expenses
        </h2>

        {status.message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              status.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {status.message}
          </div>
        )}

        <label
          htmlFor="csvFile"
          className="flex flex-col text-gray-500 font-medium text-lg gap-2"
        >
          Upload CSV file
          <div className="relative">
            <input
              id="csvFile"
              className="block w-full text-base border border-gray-300 rounded-3xl p-3 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-3xl file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-teal-600 disabled:opacity-50"
              type="file"
              name="csvFile"
              accept=".csv"
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </label>

        <button
          className="bg-primary text-white py-3 rounded-3xl text-lg font-medium hover:bg-teal-600 hover:cursor-pointer transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload
            </>
          )}
        </button>

        {selectedFile && !status.type && (
          <p className="text-sm text-gray-500 text-center break-all">
            Selected: <span className="font-semibold">{selectedFile.name}</span>
          </p>
        )}
      </form>
    </div>
  );
}
