import cn from "classnames";
import styles from "./Button.module.scss";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
}

export const Button = ({ variant, className, ...rest }: ButtonProps) => {
  return (
    <button
      className={cn(
        styles.button,
        { [styles.primary]: variant === "primary", [styles.secondary]: variant === "secondary" },
        className
      )}
      {...rest}
    />
  );
};
