import HeaderText from "@/src/components/atoms/HeaderText";
import RegisterForm from "./_components/RegisterForm";

const Register = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-fade-gray">
            <div className="max-w-[600px] flex flex-col gap-6 p-4">
                <div>
                {/* ICON */}
                <p className="text-center">LOGO HERE</p>
                {/* [TODO]: Add Icon */}
                {/* Header Title*/}
                <HeaderText title="Sign up to your account" className="text-center text-2xl font-semibold" />
                </div>
                {/* Register Form*/}
                <RegisterForm />
            </div>

        </div>
    )
}

export default Register