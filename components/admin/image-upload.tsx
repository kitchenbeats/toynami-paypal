'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, 
  X, 
  Image as ImageIcon, 
  Loader2,
  CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  bucket: string
  folder?: string
  onUpload: (urls: string[]) => void
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

interface UploadedFile {
  url: string
  name: string
  size: number
  type: string
}

export function ImageUpload({
  bucket,
  folder = '',
  onUpload,
  multiple = true,
  maxFiles = 10,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const supabase = createClient()

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} not accepted. Accepted types: ${acceptedTypes.join(', ')}`
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum size of ${maxSize}MB`
    }
    
    return null
  }, [acceptedTypes, maxSize])

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return publicUrl
  }, [bucket, folder, supabase])

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    // Validate file count
    if (!multiple && fileArray.length > 1) {
      toast.error('Only one file can be uploaded')
      return
    }
    
    if (fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files can be uploaded at once`)
      return
    }
    
    // Validate each file
    const validationErrors: string[] = []
    fileArray.forEach((file) => {
      const error = validateFile(file)
      if (error) {
        validationErrors.push(`${file.name}: ${error}`)
      }
    })
    
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error))
      return
    }
    
    setUploading(true)
    setUploadProgress(0)
    
    try {
      const uploadPromises = fileArray.map(async (file) => {
        const url = await uploadFile(file)
        setUploadProgress(((+ 1) / fileArray.length) * 100)
        return {
          url,
          name: file.name,
          size: file.size,
          type: file.type
        }
      })
      
      const uploaded = await Promise.all(uploadPromises)
      setUploadedFiles([...uploadedFiles, ...uploaded])
      onUpload(uploaded.map(f => f.url))
      toast.success(`${uploaded.length} file(s) uploaded successfully`)
    } catch (error: unknown) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload files')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [uploadedFiles, multiple, maxFiles, validateFile, uploadFile, onUpload])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onUpload(newFiles.map(f => f.url))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-2" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
          )}
          
          <span className="text-sm font-medium text-gray-900">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </span>
          
          <span className="text-xs text-gray-500 mt-1">
            {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
            {' '}up to {maxSize}MB
            {multiple && ` (max ${maxFiles} files)`}
          </span>
        </label>
        
        {uploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-center">
              {Math.round(uploadProgress)}% complete
            </p>
          </div>
        )}
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded Files ({uploadedFiles.length})
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {file.type.startsWith('image/') ? (
                  <div className="relative h-12 w-12">
                    <Image 
                      src={file.url} 
                      alt={file.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile()}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!uploading && uploadedFiles.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Files uploaded successfully</span>
        </div>
      )}
    </div>
  )
}