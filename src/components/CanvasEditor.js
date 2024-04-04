import React, { useState, useEffect, useRef } from "react";
import Canvas from "./Canvas";
import ColorPicker from "./ColorPicker";
import templateData from "./templateData.json";

const CanvasEditor = () => {
  const [captionText, setCaptionText] = useState(templateData.caption.text);
  const [ctaText, setCtaText] = useState(templateData.cta.text);
  const [backgroundColor, setBackgroundColor] = useState("#0369A1");
  const [lastPickedColors, setLastPickedColors] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const canvasRef = useRef(null);
  const canvasInstanceRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasInstance = new Canvas(canvasRef.current, {
        backgroundColor,
        selectedImage,
        templateData,
        captionText,
        ctaText,
      });
      canvasInstanceRef.current = canvasInstance;

      if (selectedImage) {
        const loadImageAndRender = async () => {
          await canvasInstance.renderCanvas(); // Wait for canvas to render first
          await canvasInstance.renderSelectedImage(); // Then render the image
        };
        loadImageAndRender();
      } else {
        canvasInstance.renderCanvas();
      }
    }
  }, [backgroundColor, captionText, ctaText, selectedImage]);

  const handleCaptionChange = (e) => {
    setCaptionText(e.target.value);
  };

  const handleCtaChange = (e) => {
    setCtaText(e.target.value);
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
  };

  const handleColorPickerChange = (color) => {
    const updatedColors = [color, ...lastPickedColors.slice(0, 4)];
    setLastPickedColors(updatedColors);
    setBackgroundColor(color);
  };

  const handleColorSelect = (color) => {
    setBackgroundColor(color);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result); // Set selected image
      };
      reader.onerror = () => {
        console.log("Error reading image file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={1080}
        height={1080}
        style={{
          width: "400px",
          height: "400px",
          border: "1px solid black",
          transform: "scale(0.9)",
        }}
      ></canvas>
      <div>
        <label htmlFor="caption">Caption Text:</label>
        <input
          type="text"
          id="caption"
          value={captionText}
          onChange={handleCaptionChange}
        />
      </div>
      <div>
        <label htmlFor="cta">CTA Text:</label>
        <input
          type="text"
          id="cta"
          value={ctaText}
          onChange={handleCtaChange}
        />
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleFileInputChange} />
      </div>
      <div>
        <ColorPicker
          color={backgroundColor}
          lastPickedColors={lastPickedColors}
          onChange={handleColorPickerChange}
          onColorSelect={handleColorSelect}
          onBackgroundColorChange={handleBackgroundColorChange}
        />
        <button onClick={() => handleBackgroundColorChange("#0369A1")}>
          Reset Background
        </button>
      </div>
    </div>
  );
};

export default CanvasEditor;
