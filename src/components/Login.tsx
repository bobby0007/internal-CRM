import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'lucide-react';
import { motion } from 'framer-motion';
import type { OtplessUser } from '../types';
import { setAuthToken, isAuthenticated } from '../utils/auth';
import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    otpless: (otplessUser: OtplessUser) => void;
  }
}

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    if (isAuthenticated()) {
      navigate('/');
      return;
    }

    // OTPLESS callback triggered after login
    window.otpless = (otplessUser) => {
      console.log("OTPless response:", otplessUser);
      if (otplessUser.status === "SUCCESS") {
        const email = otplessUser.identities[0]?.identityValue || '';
        
        // Check if email is from OTPless domain
        if (!email.endsWith('@otpless.com')) {
          toast({
            title: "Access Denied",
            description: "Only @otpless.com email addresses are allowed to login.",
            variant: "destructive",
          });
          return;
        }

        // Only store the auth token
        setAuthToken(otplessUser.token);
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Authentication failed. Please try again.",
          variant: "destructive",
        });
      }
    };

    // Load OTPLESS SDK
    if (!document.getElementById('otpless-sdk')) {
      const script = document.createElement('script');
      script.id = 'otpless-sdk';
      script.type = 'text/javascript';
      script.src = "https://otpless.com/v4/auth.js";
      script.setAttribute("data-appid", "TK4YHCKPJQ5X9FCF4A65");
      script.async = true;
      document.body.appendChild(script);
    }

    // Cleanup
    return () => {
      const script = document.getElementById('otpless-sdk');
      if (script) {
        script.remove();
      }
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.5 
            }}
            className="inline-block"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="bg-white p-4 rounded-full shadow-xl"
            >
              <Command className="h-12 w-12 text-primary" />
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </motion.div>
        </div>

        {/* OTPLESS Login Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
            <div className="relative">
              {/* OTPLESS will render its UI here */}
              <div id="otpless-login-page" className="min-h-[200px]" />
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center text-sm text-gray-600"
        >
          By signing in, you agree to our{' '}
          <a href="#" className="font-medium text-primary hover:text-primary/80">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-primary hover:text-primary/80">
            Privacy Policy
          </a>
        </motion.p>
      </div>
    </div>
  );
};

export default Login;