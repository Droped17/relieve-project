import Link from "next/link";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex">
      <aside className="w-64 flex flex-col h-[calc(100vh-64px)] bg-red-300">
        <Link href="/admin" className="p-4">Dashboard</Link>
        <Link href="/admin/rooms" className="p-4">Rooms</Link>
        <Link href="/admin/transactions" className="p-4">Transactions</Link>
      </aside>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout
