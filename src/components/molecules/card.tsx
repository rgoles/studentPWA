import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg bg-white shadow md:w-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

Card.Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("px-4 pt-5 pb-2 sm:px-6", className)}>{children}</div>;

Card.Body = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("px-4 py-3 sm:px-6", className)}>{children}</div>;

Card.Footer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("px-4 pt-2 pb-5 sm:px-6", className)}>{children}</div>;
