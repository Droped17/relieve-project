// components/Dropdown.tsx
import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  name: string;
  value: number | string;
  option: Array<number | string>;
  onChange: (name: string, value: number | string) => void;
  className?: string;
}

const Dropdown = ({ name, value, option, onChange, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string | number) => {
    onChange(name, val);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className || ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className=" text-left py-2 px-5 bg-white rounded-md border border-gray-100 shadow-md cursor-pointer hover:bg-gray-100 transition duration-300"
      >
        {value}
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
          {option.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className={`flex justify-center py-2 px-5 cursor-pointer hover:bg-gray-100 ${
                item === value ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
