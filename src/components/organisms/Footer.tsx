const Footer = () => {
    // [TODO]: Refactor
    // [TODO]: Localization
    return (
        <>
            <div className="bg-black text-warm py-8">
                <div className="mx-auto max-w-[1280px] small-mobile:px-2 medium-mobile:px-8">
                    <div className="flex-1/2 flex items-center">
                        <div className="flex-1/2 flex flex-col gap-7">
                            <div className="flex flex-col gap-4">
                                <p className="small-mobile:text-2xl medium-mobile:text-3xl tablet:text-4xl font-semibold text-warm">{`"`}Your space, your stay{`"`} — be<span className="text-warning">lieve</span> in re<span className="text-warning">lieve</span></p>
                                <div>
                                    <p className="small-mobile:text-xl medium-mobile:text-2xl tablet:text-2xl">Contact Us</p>
                                    <p>Email: relieve_test@gmail.com</p>
                                    <p>Tel: xxxxxxxxxx</p>
                                </div>
                            </div>

                            <div className="flex small-mobile:gap-3 tablet:gap-10 small-mobile:flex-col small-mobile:items-end tablet:flex-row">
                                <div className="flex flex-col w-1/2 text-warm hover:text-warning transition duration-300 ">
                                    <div className="border-t">
                                        <p className="border w-max py-1 p-2 group-hover:bg-warning group-hover:text-black transition">
                                            YEAR FOUNDED
                                        </p>
                                    </div>
                                    <p className="text-end small-mobile:text-4xl tablet:text-7xl">2025</p>
                                </div>

                                <div className="flex flex-col w-1/2 text-warm hover:text-warning transition duration-300">
                                    <div className="border-t">
                                        <p className="border w-max py-1 p-2 group-hover:bg-warning group-hover:text-black transition">
                                            LOCATION
                                        </p>
                                    </div>
                                    <p className="text-end small-mobile:text-4xl tablet:text-7xl">Thailand</p>
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