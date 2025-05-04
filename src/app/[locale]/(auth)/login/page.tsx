import HeaderText from "@/src/components/atoms/HeaderText"
import LoginForm from "./_components/LoginForm"

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-fade-gray">
            <div className="max-w-[600px] flex flex-col gap-6 p-4">
                <div>
                {/* ICON */}
                {/* [TODO]: Add Icon */}
                <p className="text-center">LOGO HERE</p>
                {/* Header Title*/}
                <HeaderText title="Sign in to your account" className="text-center text-2xl font-semibold" />
                </div>
                {/* Login Form*/}
                <LoginForm />
            </div>
        </div>
    )
}

export default Login