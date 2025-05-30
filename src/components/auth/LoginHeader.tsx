
interface LoginHeaderProps {
  showOTPInput: boolean;
}

export const LoginHeader = ({ showOTPInput }: LoginHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold mb-2">MalaFlow</h1>
      <p className="text-gray-600">
        {showOTPInput ? "Verify Your Mobile Number" : "Sign in to your account"}
      </p>
    </div>
  );
};
