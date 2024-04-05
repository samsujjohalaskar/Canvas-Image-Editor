import React, { useState, useEffect, useRef } from "react";
import Canvas from "./Canvas";
import ColorPicker from "./ColorPicker";
import templateData from "./templateData.json";
import "../output.css";
import { FcAddImage } from "react-icons/fc";

const CanvasEditor = () => {
  const [captionText, setCaptionText] = useState(templateData.caption.text);
  const [ctaText, setCtaText] = useState(templateData.cta.text);
  const [backgroundColor, setBackgroundColor] = useState("#0369A1");
  const [lastPickedColors, setLastPickedColors] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const canvasRef = useRef(null);
  const canvasInstanceRef = useRef(null);
  const [openEyeDropper, setOpenEyeDropper] = useState(false);

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
    <div className="flex justify-center items-center p-16 shadow-xl mt-10 max-w-max gap-10 bg-slate-50">
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
      <div className="border-black w-96 p-4">
        <div className="flex justify-center items-center flex-col mb-9">
          <p className="font-semibold">Ad Customization</p>
          <p className="text-sm text-slate-400">
            Customize your ad and get the templates accordingly
          </p>
        </div>
        <div className="shadow-sm mb-6 rounded-lg p-2 text-sm flex flex-row items-center">
          <FcAddImage className="text-3xl mr-2" />
          <label className="text-xs text-slate-400">Change the ad creative image.</label>
          <div className="relative inline-block">
            <input
              className="absolute text-xs left-0 top-0 z-10 opacity-0"
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            <div className="relative z-0 ml-1 text-blue-500 font-semibold underline">
              select file
            </div>
          </div>
        </div>
        <div className="shadow-sm mb-6 rounded-lg p-2 text-sm flex flex-col">
          <label className="text-xs text-slate-400" htmlFor="caption">Ad Content</label>
          <input
            className="bg-slate-50"
            type="text"
            id="caption"
            value={captionText}
            onChange={handleCaptionChange}
            style={{outline: "none"}}
          />
        </div>
        <div className="shadow-sm mb-6 rounded-lg p-2 text-sm flex flex-col">
          <label className="text-xs text-slate-400" htmlFor="cta">CTA</label>
          <input
            className="bg-slate-50"
            type="text"
            id="cta"
            value={ctaText}
            onChange={handleCtaChange}
            style={{outline: "none"}}
          />
        </div>
        <div>
          <div className="flex justify-between">
            <p className="text-xs text-slate-400">Choose your color</p>
            <p className="text-xs text-slate-400">or <span  onClick={() => setOpenEyeDropper(true)} className="text-blue-500 font-semibold underline cursor-pointer">Open EyeDropper</span></p>
          </div>
          <ColorPicker
            openEyeDropper={openEyeDropper}
            onEyeDropperClose={() => setOpenEyeDropper(false)}
            color={backgroundColor}
            lastPickedColors={lastPickedColors}
            onChange={handleColorPickerChange}
            onColorSelect={handleColorSelect}
            onBackgroundColorChange={handleBackgroundColorChange}
          />
          <button className="text-sm text-slate-500" onClick={() => handleBackgroundColorChange("#0369A1")}>
            {lastPickedColors.length != 0 && "Reset"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
