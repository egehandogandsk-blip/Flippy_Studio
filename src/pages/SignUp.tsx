import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
            <div className="w-full max-w-md">
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: 'mx-auto',
                            card: 'bg-[#141414] border border-purple-500/20 shadow-2xl',
                        },
                    }}
                    routing="path"
                    path="/sign-up"
                />
            </div>
        </div>
    );
}
