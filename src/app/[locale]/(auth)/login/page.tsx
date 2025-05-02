import HeaderText from "@/src/components/atoms/HeaderText"
import LoginForm from "./_components/LoginForm"

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
            <div className="w-[600px] px-4 flex flex-col gap-2">
                {/* Header Title*/}
                <HeaderText title="Login Page" className="text-center" />
                {/* Login Form*/}
                <LoginForm />
            </div>
        </div>
    )
}

export default Login