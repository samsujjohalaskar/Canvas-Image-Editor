import React, { useState } from "react";
import { ChromePicker } from "react-color";

const ColorPicker = ({
  color,
  lastPickedColors,
  onChange,
  onColorSelect,
  onBackgroundColorChange,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorPickerToggle = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleChangeComplete = (color) => {
    onChange(color.hex);
    if (onBackgroundColorChange) {
      onBackgroundColorChange(color.hex);
    }
  };

  return (
    <div>
      <div>
        {showColorPicker && (
          <ChromePicker
            className="absolute"
            color={color}
            onChangeComplete={handleChangeComplete} // using onChangeComplete event
          />
        )}
      </div>
      <div>
        {lastPickedColors
          .slice(-5)
          .reverse()
          .map((pickedColor, index) => (
            <div
              key={index}
              style={{
                backgroundColor: pickedColor,
                width: "20px",
                height: "20px",
                display: "inline-block",
                marginRight: "5px",
                cursor: "pointer",
              }}
              onClick={() => onColorSelect(pickedColor)}
            ></div>
          ))}
        <button onClick={handleColorPickerToggle}>+</button>
      </div>
    </div>
  );
};

export default ColorPicker;
