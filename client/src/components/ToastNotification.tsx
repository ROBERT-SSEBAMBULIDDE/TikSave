import { ToastData } from "@/lib/types";
import { FAIcon } from "@/components/ui/fa-icon";
import { cn } from "@/lib/utils";

interface ToastNotificationProps {
  toast: ToastData;
}

export function ToastNotification({ toast }: ToastNotificationProps) {
  if (!toast.visible) return null;

  const getIconClass = () => {
    switch (toast.type) {
      case "success":
        return "fa-check-circle text-green-500";
      case "error":
        return "fa-exclamation-circle text-red-500";
      case "info":
        return "fa-info-circle text-blue-500";
      default:
        return "fa-info-circle text-blue-500";
    }
  };

  return (
    <div className={cn("fixed bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-3 max-w-xs transform transition-all duration-300 flex items-start z-50",
      toast.visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
    )}>
      <FAIcon icon={getIconClass().replace("fa-", "")} className={cn(getIconClass(), "mt-0.5 mr-3 text-lg")} />
      <div>
        <p className="font-medium">{toast.title}</p>
        <p className="text-sm text-slate-600">{toast.message}</p>
      </div>
    </div>
  );
}
