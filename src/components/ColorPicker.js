import React, { useState, useEffect, useRef } from "react";
import { ChromePicker } from "react-color";
import "../output.css";
import { FaPlus } from "react-icons/fa";

const ColorPicker = ({
  openEyeDropper,
  color,
  lastPickedColors,
  onEyeDropperClose,
  onChange,
  onColorSelect,
  onBackgroundColorChange,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    //event listener to detect clicks on document
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  const handleColorPickerToggle = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleChangeComplete = (color) => {
    onChange(color.hex);
    if (onBackgroundColorChange) {
      onBackgroundColorChange(color.hex);
    }
  };

  useEffect(() => {
    if (openEyeDropper) {
      if (!window.EyeDropper) {
        onEyeDropperClose(); //callback function to set openEyeDropper false
        console.log("This browser does not support the EyeDropper API yet!");
        return; // exits early if EyeDropper API is not supported
      }

      const eyeDropper = new window.EyeDropper();
      eyeDropper
        .open()
        .then((result) => {
          const color = result.sRGBHex;
          onColorSelect(color);
        })
        .catch((e) => {
          console.error("error:" + e);
        })
        .finally(() => {
          onEyeDropperClose(); //callback function to set openEyeDropper false
        });
    }
  }, [openEyeDropper]);

  return (
    <div ref={colorPickerRef}>
      <div>
        {showColorPicker && (
          <ChromePicker color={color} onChangeComplete={handleChangeComplete} />
        )}
      </div>
      <div className="mt-2 flex items-center">
        {lastPickedColors
          .slice(-5)
          .reverse()
          .map((pickedColor, index) => (
            <div
              key={index}
              className={`w-5 h-5 cursor-pointer inline-block mr-1.5 ${
                pickedColor === color ? "border-2 border-blue-500" : "border-0"
              }`}
              style={{
                backgroundColor: pickedColor,
              }}
              onClick={() => onColorSelect(pickedColor)}
            ></div>
          ))}
        <button
          className="h-5 w-5 flex justify-center items-center text-black bg-gray-300 text-xs"
          onClick={handleColorPickerToggle}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
