import { ChangeEvent } from "react";

interface IDropdownProps {
    name: string;
    value: any;
    option: string[];
    onChange: (event: ChangeEvent<HTMLSelectElement>) =>  void
    className?: string;
}

const Dropdown = ({name,value,option,onChange,className}: IDropdownProps) => {
    return (
        <select>
            <option value=""></option>
            {option.map((items) => <option key={''} value={items}>
                {items}
            </option>)}
        </select>
    )
}

export default Dropdown