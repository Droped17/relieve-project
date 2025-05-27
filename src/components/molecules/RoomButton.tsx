import clsx from "clsx";

type RoomButtonProps = {
  number: string;
  isBooked: boolean;
  status: string;
  isLast: boolean;
  onClick: () => void;
};

const RoomButton = ({ number, isBooked, status, isLast, onClick }: RoomButtonProps) => (
  <button
    disabled={isBooked}
    onClick={onClick}
    className={clsx(
      'p-4 w-28 flex justify-center',
      {
        'border-b border-fade-gray': !isLast,
        'border-none': isLast,
        'bg-gray-200 hover:bg-gray-300 transition duration-300 cursor-pointer': status === 'NULL_VALUE',
        'bg-red-300': isBooked,
        'bg-secondary hover:bg-primary transition duration-300 cursor-pointer': !isBooked,
      },
    )}
  >
    {number}
  </button>
);

export default RoomButton
