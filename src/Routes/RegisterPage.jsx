import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-70px)] py-4">
      <div className="w-full max-w-md max-h-[80vh] overflow-auto">
        <SignUp
          signInUrl="/login"
          appearance={{
            elements: {
              footer: {
                "& > div:last-child": {
                  display: "none",
                },
              },
            },
            layout: {
              socialButtonsPlacement: "top",
              showOptionalFields: false,
            },
          }}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
