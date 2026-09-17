import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'light';
  href?: string;
}

export function Button({ variant = 'primary', href, className = '', children, ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-[16px] no-underline px-[22px] py-[16px] rounded-full text-[14px] font-bold transition-all duration-[350ms] ease-custom hover:-translate-y-[3px]";
  
  const variants = {
    primary: "bg-[#008b45] text-white shadow-[0_16px_35px_rgba(0,139,69,0.18)]",
    secondary: "border border-black/15 text-ink bg-white/35",
    light: "bg-[#f7faf8] text-[#101714]"
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
