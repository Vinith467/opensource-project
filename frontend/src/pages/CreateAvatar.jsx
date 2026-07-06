import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import JSZip from 'jszip';

export default function CreateAvatar() {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const previewInputRef = useRef(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!previewImage && !file) {
      toast.error("Please provide either a Cover Photo or a Training Zip file.");
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('aspect_ratio', aspectRatio);
      if (previewImage) {
        formData.append('preview_image', previewImage);
      }
      if (file) {
        formData.append('training_data', file);
      }

      const response = await api.post('avatars/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(`Successfully created Avatar ID: ${response.data.id}`);
      setName('');
      setDescription('');
      setFile(null);
      setPreviewImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      toast.error('Error creating avatar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedZip = e.target.files[0];
      setFile(selectedZip);
      
      // Auto-extract first image from zip for preview
      try {
        const jszip = new JSZip();
        const zip = await jszip.loadAsync(selectedZip);
        
        // Find first image file
        const imageFiles = Object.keys(zip.files).filter(name => 
          !name.startsWith('__MACOSX') && !name.startsWith('.') &&
          (name.toLowerCase().endsWith('.png') || name.toLowerCase().endsWith('.jpg') || name.toLowerCase().endsWith('.jpeg'))
        );
        
        if (imageFiles.length > 0) {
          const firstImageFile = zip.files[imageFiles[0]];
          const blob = await firstImageFile.async('blob');
          
          // Create a File object from the blob
          const extractedFile = new File([blob], imageFiles[0].split('/').pop(), { type: blob.type });
          
          setPreviewImage(extractedFile);
          setPreviewUrl(URL.createObjectURL(blob));
          toast.success("Automatically extracted cover photo from zip!");
        }
      } catch (err) {
        console.error("Failed to parse zip", err);
      }
    }
  };

  const handlePreviewChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="w-full bg-[#111] p-10 rounded-2xl border border-[#222] shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-white">Create New Avatar</h1>
        <p className="text-gray-400 mb-10 text-base">Upload a single photo for an <strong>Instant Avatar</strong>, or upload a .zip of 10-20 photos for a <strong>Studio Avatar</strong> (Custom FLUX.1 LoRA).</p>
        
        <form onSubmit={handleUpload} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Avatar Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl p-4 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-base placeholder-gray-600"
              placeholder="e.g., Professional Studio Shot"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3">Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${aspectRatio === '16:9' ? 'border-purple-500 bg-purple-500/10' : 'border-[#222] bg-[#1a1a1a] hover:border-[#444]'}`}
              >
                <div className="w-16 h-9 bg-gray-600 rounded border border-gray-400" />
                <span className="text-white font-medium">16:9 (Landscape)</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${aspectRatio === '9:16' ? 'border-purple-500 bg-purple-500/10' : 'border-[#222] bg-[#1a1a1a] hover:border-[#444]'}`}
              >
                <div className="w-9 h-16 bg-gray-600 rounded border border-gray-400" />
                <span className="text-white font-medium">9:16 (Portrait)</span>
              </button>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-white mb-2">Source Material (.jpg, .png, or .zip)</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed border-[#444] rounded-xl p-10 text-center hover:border-purple-500 hover:bg-purple-500/5 transition cursor-pointer group/upload bg-[#1a1a1a] flex flex-col items-center justify-center relative overflow-hidden mx-auto ${aspectRatio === '16:9' ? 'w-full aspect-video' : 'w-[300px] aspect-[9/16]'}`}
            >
              {previewUrl ? (
                <div className="absolute inset-0 w-full h-full">
                  <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover opacity-60 group-hover/upload:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                    <Upload className="w-8 h-8 text-white mb-2 drop-shadow-md" />
                    <p className="text-white font-semibold text-sm drop-shadow-md">Change File</p>
                  </div>
                  {file && (
                    <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Studio Training (.zip)
                    </div>
                  )}
                  {!file && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Instant Avatar
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4 group-hover/upload:text-purple-500 transition-colors" />
                  <p className="text-gray-200 font-medium text-base mb-2">Click or drag file to upload</p>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">Upload a single <strong>.jpg / .png</strong> for an instant avatar, or a <strong>.zip</strong> containing 10-20 photos to train a custom model.</p>
                </>
              )}
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => {
                  const selectedFile = e.target.files && e.target.files[0];
                  if (!selectedFile) return;
                  
                  if (selectedFile.name.toLowerCase().endsWith('.zip')) {
                    handleFileChange(e);
                  } else {
                    handlePreviewChange(e);
                    setFile(null); // Clear zip if they switched to an image
                  }
                }}
                accept="image/png, image/jpeg, image/jpg, .zip"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:opacity-70 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading & Training...
                </>
              ) : (
                file ? "Start Studio Training (Est. 15 mins)" : "Create Instant Avatar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
