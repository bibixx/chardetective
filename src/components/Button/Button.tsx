import cn from "classnames";
import { forwardRef } from "react";
import type { Icon as IconType } from "react-feather";
import styles from "./Button.module.scss";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
  icon?: IconType;
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className, children, icon: Icon, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          styles.button,
          { [styles.primary]: variant === "primary", [styles.secondary]: variant === "secondary" },
          className
        )}
        {...rest}
      >
        {children}
        {Icon && <Icon width={16} />}
      </button>
    );
  }
);
