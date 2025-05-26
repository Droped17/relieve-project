import clsx from "clsx";

interface ButtonProps {
  title?: string
  disable?: boolean
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type: "button" | "submit" | "reset" | undefined;
  children?: React.ReactNode;
}

const Button = ({ className, title, disable, onClick, type, children }: ButtonProps) => {
  const buttonClass = clsx(
    className,
    "cursor-pointer transition text-white py-2 rounded",
    disable && "bg-[var(--color-fade-gray)] cursor-not-allowed opacity-50",
  );

  return (
    <button onClick={onClick} type={type} disabled={disable} className={buttonClass}>
      {title}
      {children}
    </button>
  );
};

export default Button;
