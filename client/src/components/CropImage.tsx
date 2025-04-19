import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';
import getCroppedImg from '../utils/cropImageHelper';
import { Area } from 'react-easy-crop';

export default function CropImage({ imageSrc, onCropComplete, onCancel }: any) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedBlob);
  };

  return (
    <div className="relative w-full h-[400px] bg-black">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button onClick={handleDone} className="px-4 py-2 bg-blue-500 text-white">Crop</button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white">Cancel</button>
      </div>
    </div>
  );
}
