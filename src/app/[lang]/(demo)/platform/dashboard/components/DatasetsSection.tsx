import { useState } from "react";
import { UploadForm } from "./UploadForm";
import { DatasetsTable } from "./DatasetsTable";

export function DatasetsSection() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const handleUploadClick = () => {
    setShowUploadForm(true);
    // setIsTrainingModel(false); // Reset training model state
  };
  return (
    <>
      {showUploadForm ? (
        <UploadForm setShowUploadForm={setShowUploadForm} />
      ) : (
        <DatasetsTable onUploadClick={handleUploadClick} />
      )}
    </>
  );
}
