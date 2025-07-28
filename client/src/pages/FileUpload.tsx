import React, { useState, useCallback, useEffect } from "react";
import {
  Upload,
  File,
  X,
  Check,
  AlertCircle,
  Download,
  Shield,
  View,
  Eye,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import api from "../services/api";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  originalName: string;
  type: string;
  uploadedAt: string;
  encrypted: boolean;
  url: string;
  createdAt: string;
  format: string;
  public_id: string;
  size: 167031;
  updatedAt: string;
  _id: string;
}

interface FileUploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

const FileUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentUploads, setCurrentUploads] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [openDelete, setOpenDelete] = useState<string>("");

  React.useEffect(() => {
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = async () => {
    try {
      const response = await api.get("/upload");
      setUploadedFiles(response?.data?.files);
    } catch (error) {
      console.error("Failed to load files:", error);
    } finally {
      isUploading;
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files);

    handleFileUpload(files);
  };

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response)
        setCurrentUploads((prevUploads) => [
          ...prevUploads,
          response?.data?.file,
        ]);
      toast.info("File Uploaded successfully.");

      loadUploadedFiles();
    } catch {
      console.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const response = await api.delete(`/upload/?id=${id}/`);
      if (response) {
        toast.info("File deleted successfully.");
      }
    } catch {
      console.error("Failed to delete file");
    }
  };

  const getFileIcon = (type: string) => {
    if (type?.startsWith("image/")) return "🖼️";
    if (type?.startsWith("video/")) return "🎥";
    if (type?.startsWith("audio/")) return "🎵";
    if (type?.includes("pdf")) return "📄";
    if (type?.includes("document") || type?.includes("word")) return "📝";
    if (type?.includes("spreadsheet") || type?.includes("excel")) return "📊";
    return "📁";
  };
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient">File Upload</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">File Upload</h1>
        <p className="text-muted-foreground mt-1">
          Securely store and manage your important documents
        </p>
      </div>

      {/* Security Notice */}
      <Card className="border-accent/20 bg-accent-light/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-accent p-2 rounded-xl">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-accent mb-2">
                End-to-End Encryption
              </h3>
              <p className="text-sm text-muted-foreground">
                All files are encrypted before upload and can only be decrypted
                by you. We cannot access your files even if we wanted to.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="card-security">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors border-accent bg-accent-light/20 `}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Files</h3>

            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="bg-blue-900 text-white p-2  rounded-sm hover:bg-opacity-80 duration-100"
            >
              {isUploading ? "Uploading..." : "Select Files"}
            </label>
            <p className="text-xs text-muted-foreground mt-4">
              Maximum file size: 10MB. Supported formats: All file types
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Uploads */}
      {currentUploads?.length > 0 && (
        <Card className="card-security">
          <CardHeader>
            <CardTitle>Uploading Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentUploads?.map((upload, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getFileIcon(upload?.type)}</div>
                    <div>
                      <p className="font-medium truncate max-w-sm">
                        {upload?.originalName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(upload?.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {upload.status === "uploading" && (
                      <span className="text-sm text-muted-foreground">
                        {upload.progress}%
                      </span>
                    )}
                    {upload.status === "success" && (
                      <Check className="h-5 w-5 text-success" />
                    )}
                    {upload.status === "error" && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </div>

                {upload.status === "uploading" && (
                  <Progress value={upload.progress} className="h-2" />
                )}

                {upload.status === "error" && upload.error && (
                  <p className="text-sm text-destructive">{upload.error}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      <Card className="card-security">
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedFiles?.length === 0 ? (
            <div className="text-center py-8">
              <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles?.map((file) => (
                <div
                  key={file?.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-2xl">{getFileIcon(file?.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {file?.originalName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file?.size)}</span>
                        <span>•</span>
                        <span>
                          {new Date(file?.uploadedAt).toLocaleDateString()}
                        </span>
                        {file?.encrypted && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              <span>Encrypted</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file?.url, "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFile(file?.public_id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
