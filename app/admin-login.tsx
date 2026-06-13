import { LoginPlaceholderScreen } from '@/components/login-placeholder-screen';

export default function AdminLoginScreen() {
  return (
    <LoginPlaceholderScreen
      title="Admin Login"
      subtitle="Sign in with your authorized admin credentials."
      note="Admin accounts are provisioned in advance by the system developer or Ghana Health Service. Public sign up is not available."
    />
  );
}
