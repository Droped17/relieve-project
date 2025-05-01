import HeaderText from "@/src/components/atoms/HeaderText"
import LoginForm from "./_components/LoginForm"

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[100vh]">
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