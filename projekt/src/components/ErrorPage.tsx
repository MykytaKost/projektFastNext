import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorPageProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction: () => void;
}

export function ErrorPage({
  title = "Wystąpił nieoczekiwany błąd",
  description = "Spróbuj ponownie lub skontaktuj się z pomocą techniczną, jeśli problem będzie się powtarzał.",
  actionLabel = "Wróć do strony głównej",
  onAction,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-3 text-gray-600">{description}</p>
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export function NotFoundPage({ onAction }: { onAction: () => void }) {
  return (
    <ErrorPage
      title="Nie znaleziono strony"
      description="Adres, którego szukasz, może być niepoprawny lub zostać usunięty."
      actionLabel="Powrót do strony głównej"
      onAction={onAction}
    />
  );
}
