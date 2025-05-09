import Image from "next/image"
import LoginForm from "./_components/LoginForm"

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-fade-gray">
            <div className="max-w-[600px] flex flex-col gap-1 p-4">
                <div className="flex flex-col items-center">
                {/* ICON */}
                <Image alt="" src="/images/onsen-color.png" width={180} height={150}/>
                </div>
                {/* Login Form*/}
                <LoginForm />
            </div>
        </div>
    )
}

export default Login