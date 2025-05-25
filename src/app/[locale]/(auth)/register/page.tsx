import RegisterForm from "./_components/RegisterForm";

const Register = () => {
    /* [TODO]: Responsive */
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-fade-gray">
            <div className="max-w-[600px] flex flex-col p-4">
                <div className="flex flex-col items-center">
                </div>
                {/* Register Form*/}
                <RegisterForm />
            </div>

        </div>
    )
}

export default Register