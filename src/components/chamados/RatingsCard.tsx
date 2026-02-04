import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, MessageSquare } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { type CallRating, ratingServiceTypeLabels } from "@/services/calls.service";

interface RatingsCardProps {
  ratings: CallRating[];
}

export function RatingsCard({ ratings }: RatingsCardProps) {
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
      : 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="rounded-2xl border-border/50 shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Avaliações</CardTitle>
              <CardDescription>Feedback do atendimento</CardDescription>
            </div>
          </div>
          {ratings.length > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
                {renderStars(Math.round(averageRating))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {ratings.length === 0 ? (
          <p className="text-muted-foreground italic text-center py-4">
            Nenhuma avaliação registrada
          </p>
        ) : (
          ratings.map((rating, index) => (
            <div key={rating.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {ratingServiceTypeLabels[rating.service_type] || rating.service_type}
                  </span>
                  {renderStars(rating.rating)}
                </div>

                {rating.complaint && (
                  <div className="flex items-start gap-2 mt-2 p-3 bg-muted/50 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{rating.complaint}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {formatDateTime(rating.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
