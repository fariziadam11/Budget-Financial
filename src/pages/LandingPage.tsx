import React from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import { FaChartLine, FaTasks, FaPiggyBank, FaStar } from 'react-icons/fa';

// Feature Card Component
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}> = ({ icon, title, description, iconBgColor, iconColor }) => (
  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 dark:border-gray-700">
    <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
      <div className={`text-3xl ${iconColor}`}>
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
      {description}
    </p>
  </div>
);

// Testimonial Card Component
const TestimonialCard: React.FC<{
  initials: string;
  name: string;
  role: string;
  content: string;
  bgColor: string;
}> = ({ initials, name, role, content, bgColor }) => (
  <div className="group bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600">
    <div className="flex items-center mb-6">
      <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
        {initials}
      </div>
      <div className="ml-4">
        <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">{role}</p>
      </div>
    </div>
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className="w-4 h-4 text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
      "{content}"
    </p>
  </div>
);

// CTA Button Component
const CTAButton: React.FC<{
  href: string;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}> = ({ href, variant, children, className = '' }) => {
  const baseClasses = "font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4";
  const variantClasses = variant === 'primary' 
    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-600 focus:ring-blue-300 shadow-lg hover:shadow-xl"
    : "bg-transparent border-2 border-white dark:border-slate-400 text-white dark:text-slate-100 hover:bg-white/10 dark:hover:bg-slate-700/30 focus:ring-white/50";

  return (
    <a 
      href={href} 
      className={`${baseClasses} ${variantClasses} ${className}`}
      role="button"
      aria-label={children as string}
    >
      {children}
    </a>
  );
};

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <FaChartLine />,
      title: "Smart Budgeting",
      description: "Track your income and expenses effortlessly with AI-powered insights. Set goals and stay on top of your spending with our intuitive dashboard and smart categorization.",
      iconBgColor: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <FaTasks />,
      title: "Task Management",
      description: "Organize your financial tasks with intelligent reminders and priority scheduling. Never miss a payment, bill, or financial deadline with our comprehensive task system.",
      iconBgColor: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: <FaPiggyBank />,
      title: "Savings Goals",
      description: "Set personalized savings targets and track your progress with visual milestones. Get motivated with achievement badges and celebrate your financial victories.",
      iconBgColor: "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
      iconColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  const testimonials = [
    {
      initials: "JD",
      name: "John Doe",
      role: "Financial Analyst",
      content: "BudgetTask has completely transformed how I manage my finances. The interface is intuitive and the AI insights have helped me save 30% more each month.",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      initials: "AS",
      name: "Alice Smith",
      role: "Small Business Owner",
      content: "The task management feature has been a game-changer for my business. I can now track all my financial tasks in one place and never miss important deadlines.",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      initials: "RJ",
      name: "Robert Johnson",
      role: "Freelancer",
      content: "I've saved more money in the last 3 months than I did all last year. The savings goals feature with visual progress tracking is incredibly motivating!",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
    }
  ];

  return (
    <LandingLayout>
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] dark:bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Take Control of Your Financial Future
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-blue-100 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Your all-in-one solution for intelligent budgeting, smart task management, and goal-driven savings. Start your journey to financial freedom today with AI-powered insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-300">
              <CTAButton href="/register" variant="primary" className="text-lg px-12 py-5">
                Get Started for Free
              </CTAButton>
              <CTAButton href="#features" variant="secondary" className="text-lg px-12 py-5">
                Learn More
              </CTAButton>
            </div>
            
            <div className="mt-16 text-center animate-fade-in-up delay-500">
              <p className="text-blue-200 dark:text-slate-400 text-sm mb-4">Trusted by over 50,000+ users worldwide</p>
              <div className="flex justify-center items-center space-x-8 opacity-70">
                <div className="text-blue-200">★★★★★</div>
                <div className="text-blue-200 text-sm">4.9/5 rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful features designed to simplify your financial life and accelerate your path to financial independence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their financial lives with BudgetTask.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] dark:bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-slate-100 mb-8">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 dark:text-slate-300 mb-16 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who have already taken control of their finances with BudgetTask. Start your free trial today and see the difference in just 7 days.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <CTAButton href="/register" variant="primary" className="text-lg px-12 py-5">
              Start Free Trial
            </CTAButton>
            <CTAButton href="/login" variant="secondary" className="text-lg px-12 py-5">
              Sign In
            </CTAButton>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-blue-200 dark:text-slate-400 text-sm">
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default LandingPage;