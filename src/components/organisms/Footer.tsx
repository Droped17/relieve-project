const Footer = () => {
    // [TODO]: Refactor
    // [TODO]: Localization
    return (
        <>
            <div className="bg-black text-warm py-11">
                <div className="mx-auto max-w-[1280px] px-8">
                    <div className="flex-1/2 flex items-center">
                        <div className="flex-1/2 flex flex-col gap-7">
                            <div className="flex flex-col gap-4">
                                <p className="text-4xl font-semibold text-warm">{`"`}Your space, your stay{`"`} — be<span className="text-warning">lieve</span> in re<span className="text-warning">lieve</span></p>
                                <div>
                                    <p className="text-xl">Contact Us</p>
                                    <p>Email: relieve_test@gmail.com</p>
                                    <p>Tel: 00000000000</p>
                                </div>
                            </div>

                            <div className="flex gap-10">
                                <div className="flex flex-col w-1/2 text-warm hover:text-warning transition duration-300 ">
                                    <div className="border-t">
                                        <p className="border w-max py-1 p-2 group-hover:bg-warning group-hover:text-black transition">
                                            YEAR FOUNDED
                                        </p>
                                    </div>
                                    <p className="text-end text-7xl">2025</p>
                                </div>

                                <div className="flex flex-col w-1/2 text-warm hover:text-warning transition duration-300">
                                    <div className="border-t">
                                        <p className="border w-max py-1 p-2 group-hover:bg-warning group-hover:text-black transition">
                                            LOCATION
                                        </p>
                                    </div>
                                    <p className="text-end text-7xl">Thailand</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )

}

export default Footer