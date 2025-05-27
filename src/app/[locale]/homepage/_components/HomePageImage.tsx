import Image from "next/image"

const HomePageImage = () => {
    // [TODO]: Localization
    return (
        <div className="relative group">
            <div className="z-40 absolute inset-0 hover:backdrop-blur-xs rounded-4xl duration-300">
                <p className="absolute right-5 top-5 text-warm  font-semi-bold text-xl opacity-0 group-hover:opacity-100 duration-300">BELIEVE IN RELIEVE</p>
                <p className="absolute right-5 top-12 text-warm text-sm opacity-0 group-hover:opacity-100 duration-300">{`"Your space, your stay"`}</p>
                <p className="absolute left-10 top-2 text-warm small-mobile:text-[40px]
                      tablet:text-[100px] 
                      laptop:text-[150px] 
                      desktop:text-[200px] 
                      transition-all duration-500 
                      group-hover:drop-shadow-[20px_30px_0px_#310c0c]
                      ">
                    RE
                </p>
                <p className="absolute right-5 bottom-1 text-warning small-mobile:text-[40px] tablet:text-[100px] laptop:text-[150px] desktop:text-[200px] transition-all duration-500 group-hover:drop-shadow-[20px_30px_0px_#000000]">LIEVE</p>
            </div>
            <Image
                alt="relieve"
                src="https://images.unsplash.com/photo-1616995942688-6ad1d3ee4a60?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={1500}
                height={500}
                className="rounded-4xl"
            />
        </div>
    )
}

export default HomePageImage