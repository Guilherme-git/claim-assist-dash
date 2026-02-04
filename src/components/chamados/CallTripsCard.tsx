import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Route, MapPin, Clock, CheckCircle2, ExternalLink } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import {
  type CallTrip,
  callTripTypeLabels,
  callTripStatusLabels,
  callTripStatusVariants,
} from "@/services/calls.service";

interface CallTripsCardProps {
  trips: CallTrip[];
}

export function CallTripsCard({ trips }: CallTripsCardProps) {
  const getGoogleMapsUrl = (address: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <Card className="rounded-2xl border-border/50 shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Route className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Viagens</CardTitle>
            <CardDescription>Coleta e entrega do veículo</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {trips.length === 0 ? (
          <p className="text-muted-foreground italic text-center py-4">
            Nenhuma viagem registrada
          </p>
        ) : (
          trips.map((trip, index) => (
            <div key={trip.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {trip.type === "towing_collect" ? (
                      <MapPin className="h-4 w-4 text-blue-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-semibold">
                      {callTripTypeLabels[trip.type] || trip.type}
                    </span>
                  </div>
                  <Badge variant={callTripStatusVariants[trip.status] || "secondary"}>
                    {callTripStatusLabels[trip.status] || trip.status}
                  </Badge>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm">{trip.address}</span>
                    <a
                      href={getGoogleMapsUrl(trip.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver no mapa
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {trip.started_at && (
                    <div>
                      <p className="text-muted-foreground">Iniciado em</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{formatDateTime(trip.started_at)}</span>
                      </div>
                    </div>
                  )}

                  {trip.finished_at && (
                    <div>
                      <p className="text-muted-foreground">Finalizado em</p>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <span className="font-medium">{formatDateTime(trip.finished_at)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {trip.observation && (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                    {trip.observation}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
