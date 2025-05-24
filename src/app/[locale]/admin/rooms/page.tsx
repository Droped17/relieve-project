import Button from "@/src/components/atoms/Button"
import Image from "next/image"
import Link from "next/link"

const RoomsPage = () => {
    return (
        <div className="flex flex-col gap-4 max-w-[1280px] px-8">
            <div className="flex justify-between">
                <p className="text-2xl font-semibold">Rooms</p>
                <Link href="/admin/rooms/add">
                    <Button type="button" title="Add Room" className="p-2" />
                </Link>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="table-auto w-full">
                    <thead className="">
                        <tr>
                            <th className="px-4 py-2 text-left border-b border-gray-100">
                                <input type="checkbox" name="" id="" />
                            </th>
                            <th className="px-4 py-2 text-left border-b border-gray-100">Room</th>
                            <th className="px-4 py-2 text-left border-b border-gray-100">Floor</th>
                            <th className="px-4 py-2 text-left border-b border-gray-100">Facilities</th>
                            <th className="px-4 py-2 text-left border-b border-gray-100">Rate</th>
                            <th className="px-4 py-2 text-left border-b border-gray-100">Status</th>
                            <th className="px-4 py-2 text-left border-b border-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border-b border-gray-100">
                                <input type="checkbox" name="" id="" />
                            </td>
                            <td className="flex items-center gap-2 px-4 py-2 border-b border-gray-200">
                                <Image
                                    alt="relieve"
                                    src="https://images.unsplash.com/photo-1616995942688-6ad1d3ee4a60?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    width={150}
                                    height={100}
                                    className="rounded-xl"
                                />
                                <p>Name</p>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">1</td>
                            <td className="px-4 py-2 border-b border-gray-200">Air</td>
                            <td className="px-4 py-2 border-b border-gray-200">1996</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                <div className="bg-primary text-center rounded-xl p-2 text-white">
                                    <p>Active</p>
                                </div>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">...</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b border-gray-100">
                                <input type="checkbox" name="" id="" />
                            </td>
                            <td className="flex items-center gap-2 px-4 py-2 border-b border-gray-200">
                                <Image
                                    alt="relieve"
                                    src="https://images.unsplash.com/photo-1616995942688-6ad1d3ee4a60?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    width={150}
                                    height={100}
                                    className="rounded-xl"
                                />
                                <p>Name</p>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">1</td>
                            <td className="px-4 py-2 border-b border-gray-200">Air</td>
                            <td className="px-4 py-2 border-b border-gray-200">1996</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                <div className="bg-primary text-center rounded-xl p-2 text-white">
                                    <p>Active</p>
                                </div>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">...</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b border-gray-100">
                                <input type="checkbox" name="" id="" />
                            </td>
                            <td className="flex items-center gap-2 px-4 py-2 border-b border-gray-200">
                                <Image
                                    alt="relieve"
                                    src="https://images.unsplash.com/photo-1616995942688-6ad1d3ee4a60?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    width={150}
                                    height={100}
                                    className="rounded-xl"
                                />
                                <p>Name</p>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">1</td>
                            <td className="px-4 py-2 border-b border-gray-200">Air</td>
                            <td className="px-4 py-2 border-b border-gray-200">1996</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                <div className="bg-primary text-center rounded-xl p-2 text-white">
                                    <p>Active</p>
                                </div>
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">...</td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="flex justify-between">
                <p>1-10 rooms of 12</p>
                <p>Pagination</p>
            </div>


        </div>
    )
}

export default RoomsPage