import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'shadow-none bg-transparent',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton:
              'bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200',
            socialButtonsBlockButtonText: 'text-gray-700 font-medium',
            dividerLine: 'bg-gray-200',
            dividerText: 'text-gray-500',
            formButtonPrimary:
              'bg-red-500 hover:bg-red-600 transition-all duration-200 transform hover:scale-105',
            formFieldInput:
              'border-gray-200 focus:border-red-500 focus:ring-red-500 transition-all duration-200',
            footerActionLink: 'text-red-500 hover:text-red-600',
          },
        }}
      />
    </div>
  );
}