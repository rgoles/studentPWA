import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export default function PwaLayout({
  children,
  items,
  header,
}: {
  children?: React.ReactNode;
  header?: React.ReactNode;
  items: {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}) {
  return (
    <div className="bg-background text-foreground flex min-h-[100dvh] flex-col">
      {header ? (
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
          <div className="mx-auto flex h-14 max-w-screen-md items-center gap-2 px-4">
            {header}
          </div>
        </header>
      ) : null}

      <main className="mx-auto w-full max-w-screen-md flex-1 px-4 pt-4 pb-24">
        {children ?? <EmptyState />}
      </main>

      <BottomTabBar items={items} />
    </div>
  );
}

function BottomTabBar({
  items,
}: {
  items: {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}) {
  return (
    <nav
      className="bg-background/80 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto mt-2 grid h-16 max-w-screen-md grid-cols-4 items-stretch">
        {items.map((item, idx) => (
          <TabItem key={idx} {...item} />
        ))}
      </div>
    </nav>
  );
}

function TabItem({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      className="group relative inline-flex flex-col items-center justify-center gap-1 text-sm font-medium"
    >
      <Link
        to={to}
        activeOptions={{ exact: true }}
        activeProps={{
          className: "text-foreground",
        }}
        inactiveProps={{
          className: "text-muted-foreground hover:text-foreground",
        }}
      >
        {({ isActive }) => (
          <>
            <Icon className={`h-5 w-5 ${isActive ? "" : "opacity-80"}`} />
            <span>{label}</span>
            {isActive ? (
              <span className="bg-foreground/80 absolute inset-x-4 bottom-0 h-0.5 rounded-full" />
            ) : null}
          </>
        )}
      </Link>
    </Button>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[40vh] items-center justify-center">
      <div className="h-16 w-full max-w-sm rounded-xl bg-black" />
    </div>
  );
}
