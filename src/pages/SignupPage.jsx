import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await signup(data.name, data.email, data.password);
      toast.success('Account created successfully!');
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
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-12"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary mb-6 shadow-lg shadow-primary-600/30">
            <HiOutlineSparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-3">
            Start Your Journey
          </h1>
          <p className="text-lg text-text-secondary max-w-md">
            Join thousands of users who transformed their productivity with AI-powered tools.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8">
            {[
              { value: '10K+', label: 'Users' },
              { value: '50K+', label: 'Tasks Done' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
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
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <HiOutlineSparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-text-primary">ProductivityOS</span>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-1">
            Create your account
          </h2>
          <p className="text-sm text-text-secondary mb-8">
            Get started for free — no credit card required
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              icon={HiOutlineUser}
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />

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

            <Input
              label="Confirm Password"
              type="password"
              icon={HiOutlineLockClosed}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) =>
                  val === watch('password') || 'Passwords do not match',
              })}
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
