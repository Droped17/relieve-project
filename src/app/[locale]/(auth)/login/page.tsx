import LoginForm from "./_components/LoginForm"

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-fade-gray">
            <div className="flex flex-col gap-1 p-4">
                <div className="flex flex-col items-center">
                {/* ICON */}
                </div>
                {/* Login Form*/}
                <LoginForm />
            </div>
        </div>
    )
}

export default Login