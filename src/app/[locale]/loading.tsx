"use client"

import Lottie from "lottie-react";
import loadingAnimation from "@/public/images/loading-animation.json";

const Loading = () => {
    return (
        <div className="flex items-center justify-center w-full h-[calc(100vh-64px)]">
            <Lottie animationData={loadingAnimation} loop={true} className="w-[200px] h-[200px]"/> 
        </div>
    )
}

export default Loading