import React from "react";

function Register() {
    return (
        <div className="h-screen bg-[url(/public/background.jpg)] flex justify-center items-center">
            <div className="w-1/2 h-1/2 bg-white/0 text-white text-2xl items-center flex flex-col gap-3 font-light">
                <div>
                    do you have an account?
                    <a
                        className="underline font-semibold hover:cursor-pointer ms-2"
                        href="/login"
                    >
                        sign in
                    </a>
                </div>
                <div className="font-semibold text-3xl">Sign up</div>
                <div></div>
            </div>
        </div>
    );
}

export default Register;
