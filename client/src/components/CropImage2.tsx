import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import getCroppedImg2 from "../utils/cropImageHelper2"; // renamed helper
import { Area } from 'react-easy-crop';

interface Props {
  image: string;
  onCropDone: (file: File) => void;
  onCancel: () => void;
}

export default function CropImage2({ image, onCropDone, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_croppedArea:Area, croppedPixels:Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    const croppedBlob = await getCroppedImg2(image, croppedAreaPixels);
    const file = new File([croppedBlob], "cropped.jpg", { type: "image/jpeg" });
    onCropDone(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col justify-center items-center">
      <div className="relative w-[300px] h-[300px] bg-black">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={handleCrop} className="bg-blue-600 px-4 py-2 rounded text-white">Crop</button>
        <button onClick={onCancel} className="bg-red-500 px-4 py-2 rounded text-white">Cancel</button>
      </div>
    </div>
  );
}
