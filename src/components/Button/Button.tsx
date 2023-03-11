import cn from "classnames";
import type { Icon as IconType } from "react-feather";
import styles from "./Button.module.scss";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
  icon?: IconType;
  disabled?: boolean;
}

export const Button = ({ variant, className, children, icon: Icon, ...rest }: ButtonProps) => {
  return (
    <button
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
};
