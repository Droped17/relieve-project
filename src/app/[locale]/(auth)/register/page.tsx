import HeaderText from "@/src/components/atoms/HeaderText";
import RegisterForm from "./_components/RegisterForm";

const Register = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
            <div className="w-[600px] px-4 flex flex-col gap-2">
                {/* Header Title*/}
                <HeaderText title="Register Page" className="text-center"/>
                {/* Register Form */}
                <RegisterForm />
            </div>

        </div>
    )
}

export default Register