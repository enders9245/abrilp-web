import { FaBell, FaCog } from "react-icons/fa";

export default function Topbar() {
  return (
    <div className="bg-white shadow rounded-xl p-4 mb-6 flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-6">

        <FaBell size={20} />
        <FaCog size={20} />

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold">
            J
          </div>

          <div>
            <p className="font-semibold">
              Juan Enders
            </p>

            <p className="text-sm text-gray-500">
              Administrador
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}