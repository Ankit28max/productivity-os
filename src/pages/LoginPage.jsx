import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-12"
        >
          <Logo size="xl" className="justify-center mb-6" showText={false} />
          <h1 className="text-4xl font-bold text-text-primary mb-3">
            ProductivityOS
          </h1>
          <p className="text-lg text-text-secondary max-w-md">
            Your AI-powered productivity platform. Organize tasks, track habits, achieve goals — all in one place.
          </p>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Logo size="md" className="lg:hidden mb-8" />

          <h2 className="text-2xl font-bold text-text-primary mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-text-secondary mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              icon={HiOutlineMail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              icon={HiOutlineLockClosed}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
