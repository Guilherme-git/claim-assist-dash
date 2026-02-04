import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Camera, User, Calendar, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import {
  type CallInspection,
  inspectionTypeLabels,
  inspectionFileTypeLabels,
} from "@/services/calls.service";

interface InspectionsCardProps {
  inspections: CallInspection[];
}

export function InspectionsCard({ inspections }: InspectionsCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const checkinInspection = inspections.find((i) => i.type === "checkin");
  const checkoutInspection = inspections.find((i) => i.type === "checkout");

  const renderInspectionContent = (inspection: CallInspection | undefined) => {
    if (!inspection) {
      return (
        <p className="text-muted-foreground italic text-center py-8">
          Nenhuma inspeção registrada
        </p>
      );
    }

    const files = inspection.inspection_files;

    const handlePrevious = () => {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
    };

    const handleNext = () => {
      setCurrentImageIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
    };

    const handleOpenImage = (index: number) => {
      setCurrentImageIndex(index);
      setIsDialogOpen(true);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{inspection.towing_drivers?.name || "Motorista"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDateTime(inspection.created_at)}</span>
          </div>
        </div>

        {files.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="relative group cursor-pointer overflow-hidden rounded-xl border border-border/50"
                  onClick={() => handleOpenImage(index)}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <img
                      src={file.path}
                      alt={inspectionFileTypeLabels[file.type] || file.type}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden flex-col items-center justify-center text-muted-foreground">
                      <Camera className="h-8 w-8 mb-2" />
                      <span className="text-xs">Imagem indisponível</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs text-white truncate">
                      {inspectionFileTypeLabels[file.type] || file.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dialog único compartilhado */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <div className="relative">
                  <img
                    src={files[currentImageIndex]?.path}
                    alt={inspectionFileTypeLabels[files[currentImageIndex]?.type] || files[currentImageIndex]?.type}
                    className="w-full h-auto"
                  />

                  {files.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
                        onClick={handlePrevious}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
                        onClick={handleNext}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {files.length}
                      </div>
                    </>
                  )}
                </div>
                <div className="p-4 bg-background">
                  <p className="font-medium">
                    {inspectionFileTypeLabels[files[currentImageIndex]?.type] || files[currentImageIndex]?.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(files[currentImageIndex]?.created_at)}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <p className="text-muted-foreground italic text-center py-4">
            Nenhuma foto registrada
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="rounded-2xl border-border/50 shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Camera className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Inspeções</CardTitle>
            <CardDescription>Fotos do veículo (Check-in/Check-out)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {inspections.length === 0 ? (
          <p className="text-muted-foreground italic text-center py-8">
            Nenhuma inspeção registrada
          </p>
        ) : (
          <Tabs defaultValue="checkin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="checkin" className="gap-2">
                <Badge variant={checkinInspection ? "default" : "secondary"} className="h-5 w-5 p-0 justify-center">
                  {checkinInspection?.inspection_files.length || 0}
                </Badge>
                Check-in
              </TabsTrigger>
              <TabsTrigger value="checkout" className="gap-2">
                <Badge variant={checkoutInspection ? "default" : "secondary"} className="h-5 w-5 p-0 justify-center">
                  {checkoutInspection?.inspection_files.length || 0}
                </Badge>
                Check-out
              </TabsTrigger>
            </TabsList>
            <TabsContent value="checkin">
              {renderInspectionContent(checkinInspection)}
            </TabsContent>
            <TabsContent value="checkout">
              {renderInspectionContent(checkoutInspection)}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
