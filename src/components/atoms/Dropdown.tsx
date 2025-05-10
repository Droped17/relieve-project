import { ChangeEvent } from "react";

interface IDropdownProps {
    name: string;
    value: any;
    option: number[] | string[];
    onChange: (event: ChangeEvent<HTMLSelectElement>) =>  void
    className?: string;
}

const Dropdown = ({name,value,option,onChange,className}: IDropdownProps) => {
    return (
        <select name={name} value={value} onChange={onChange} className={`${className} cursor-pointer w-[50px]`}>
            {option.map((items) => <option key={items} value={items} className="border border-gray-200">
                {items}
            </option>)}
        </select>
    )
}

export default Dropdown