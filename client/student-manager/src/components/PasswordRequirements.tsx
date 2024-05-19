import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface PasswordRequirementsProps {
  requirements: { text: string; ok: boolean }[];
}

function PasswordRequirements({ requirements }: PasswordRequirementsProps) {
  const content = requirements.map((req) => (
    <div key={req.text}>
      {req.ok ? (
        <IoIosCheckmarkCircleOutline className="inline text-green-600" />
      ) : (
        <IoClose className="inline text-red-600" />
      )}{" "}
      {req.text}
    </div>
  ));

  return <div className="mt-4 text-xs">{content}</div>;
}

export default PasswordRequirements;
