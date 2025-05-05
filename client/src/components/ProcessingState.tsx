import { Progress } from "@/components/ui/progress";
import { ProcessingStatus } from "@/lib/types";

interface ProcessingStateProps {
  processing: ProcessingStatus;
}

export function ProcessingState({ processing }: ProcessingStateProps) {
  return (
    <div className="mb-6">
      <Progress value={processing.progress} className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden" />
      <p className="text-sm text-slate-600 mt-2 text-center">{processing.message}</p>
    </div>
  );
}
