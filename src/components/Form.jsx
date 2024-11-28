import React, { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import 'aos/dist/aos.css';

export const TumorClassificationForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg'];

  const handleCancel = () => {
    setSelectedImage(null);
    setResponseMessage('');
    setShowResponse(false);
    setErrorMessage('');
  };

  const validateFile = (file) => {
    if (!file) return false;
    if (!allowedFormats.includes(file.type)) {
      setErrorMessage('Formato de archivo no permitido. Usa PNG, JPG o JPEG.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10 MB
      setErrorMessage('El archivo supera el tamaño máximo permitido de 10MB.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (validateFile(file)) {
      setSelectedImage(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (validateFile(file)) {
      setSelectedImage(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      setResponseMessage('Por favor, selecciona una imagen antes de enviar.');
      setShowResponse(true);
      return;
    }

    setLoading(true);
    setResponseMessage('');
    setShowResponse(false);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const formData = new FormData();
      formData.append('image', base64Image);

      try {
        const response = await fetch('http://localhost:5070/predict', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al realizar la predicción. Intenta nuevamente.');
        }

        const data = await response.json();
        setResponseMessage(`Resultado de la predicción: ${data.resultado}`);
        setShowResponse(true);
      } catch (error) {
        console.error(error);
        setResponseMessage('Ocurrió un error al procesar la imagen. Intenta nuevamente.');
        setShowResponse(true);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(selectedImage);
  };

  return (
    <form className="mb-8 max-w-2xl mx-auto">
      <div className="space-y-10">
        <div className="border-b border-gray-900/10 pb-10">
          <h2 className="text-center text-3xl font-bold leading-4 text-gray-900">
            CLASIFICACION DE TUMORES CEREBRALES
          </h2>

          <div className="mt-4">
            <img
              src="/img/banner.jpg"
              alt="Clasificación de Tumores Banner"
              className="rounded-lg shadow-md mx-auto w-500 max-w-md h-auto"
            />
          </div>

          <p className="mt-2 text-center text-gray-600 leading-2">
            Sube una resonancia magnética cerebral para clasificar el tipo de tumor.
          </p>

          {showResponse && (
            <div className="mt-2 text-center text-white bg-green-500 py-2 px-4 rounded-md">
              {responseMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 text-center text-white bg-red-500 py-2 px-4 rounded-md">
              {errorMessage}
            </div>
          )}

          <div
            className={`mt-4 flex justify-center items-center rounded-lg border-dashed border-2 border-gray-300 p-4 transition-colors ${
              isDragging ? 'bg-gray-200 border-gray-500' : 'bg-white'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="h-52 w-52 object-cover rounded-md"
              />
            ) : (
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm text-gray-600">Arrastra una imagen o</p>
                <label
                  htmlFor="file-upload"
                  className="mt-2 inline-block cursor-pointer rounded-md bg-blue-600 px-2 py-1 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Sube una imagen
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-400">Formatos permitidos: PNG, JPG, JPEG (máximo 10MB)</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          className="rounded-md bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-300"
          onClick={handleCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-2 py-1 text-sm font-semibold text-white hover:bg-blue-500"
          onClick={handleSubmit}
        >
          {loading ? 'Procesando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
};