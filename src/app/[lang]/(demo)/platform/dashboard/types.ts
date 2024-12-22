export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  dataType?: "image" | "video" | "text" | "audio";
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  last_modified: string;
  samples: number;
}
