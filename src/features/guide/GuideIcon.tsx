import {
  ArrowUp,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Copy,
  Download,
  FileText,
  Globe,
  Printer,
  Share2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
const icons: Record<string, LucideIcon> = {
  "arrow-up": ArrowUp,
  "arrow-right": ArrowRight,
  "book-open": BookOpen,
  "check-circle": CheckCircle,
  check: CheckCircle,
  copy: Copy,
  "download-simple": Download,
  "file-text": FileText,
  browser: Globe,
  printer: Printer,
  "share-network": Share2,
  "x-circle": XCircle,
};
export function GuideIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name];
  return Icon ? (
    <Icon aria-hidden size={20} strokeWidth={1.75} className={className} />
  ) : null;
}
