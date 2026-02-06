import { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Phone,
  User,
  MapPin,
  Wrench,
  Navigation,
  Search,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import { callsService, ILevaAssociate, ILevaVehicle } from "@/services/calls.service";

// Schema de validação
const chamadoSchema = z.object({
  association: z.enum(["solidy", "motoclub", "nova", "aprovel"], {
    required_error: "Selecione uma associação",
  }),
  associate_id: z.string().min(1, "Selecione um associado"),
  associate_vehicle_id: z.string().min(1, "Selecione um veículo"),
  observation: z.string().optional(),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  google_maps_link: z.string().optional(),
  will_use_tow_truck: z.boolean().default(true),
  towing_service_type: z.string().min(1, "Selecione o tipo de serviço"),
  destination: z.object({
    address: z.string().optional(),
    location: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    }).optional(),
    google_maps_link: z.string().optional(),
  }).optional(),
});

type ChamadoFormData = z.infer<typeof chamadoSchema>;

const towingServiceOptions = [
  { group: "Reboque", options: [
    { value: "towing", label: "Reboque Genérico" },
    { value: "towing_light", label: "Reboque Leve" },
    { value: "towing_moto", label: "Reboque Moto" },
    { value: "towing_heavy", label: "Reboque Pesado" },
    { value: "towing_utility", label: "Reboque Utilitário" },
    { value: "towing_extra_heavy", label: "Reboque Extra Pesado" },
    { value: "towing_locavibe", label: "Reboque Locavibe" },
    { value: "towing_breakdown", label: "Reboque com Falha" },
  ]},
  { group: "Bateria", options: [
    { value: "battery", label: "Bateria Genérico" },
    { value: "battery_charge_light", label: "Carga de Bateria - Leve" },
    { value: "battery_charge_moto", label: "Carga de Bateria - Moto" },
    { value: "battery_charge_heavy", label: "Carga de Bateria - Pesado" },
    { value: "battery_charge_utility", label: "Carga de Bateria - Utilitário" },
    { value: "battery_replacement", label: "Troca de Bateria" },
  ]},
  { group: "Pneu", options: [
    { value: "tire_change", label: "Troca de Pneu Genérico" },
    { value: "tire_change_light", label: "Troca de Pneu - Leve" },
    { value: "tire_change_heavy", label: "Troca de Pneu - Pesado" },
    { value: "tire_change_utility", label: "Troca de Pneu - Utilitário" },
  ]},
  { group: "Chaveiro", options: [
    { value: "locksmith", label: "Chaveiro Genérico" },
    { value: "locksmith_automotive_national", label: "Chaveiro Automotivo - Nacional" },
    { value: "locksmith_automotive_imported", label: "Chaveiro Automotivo - Importado" },
    { value: "locksmith_residential", label: "Chaveiro Residencial" },
  ]},
  { group: "Outros", options: [
    { value: "empty_tank", label: "Tanque Vazio" },
    { value: "fuel_assistance", label: "Auxílio Combustível" },
    { value: "reserve_car", label: "Carro Reserva" },
    { value: "other", label: "Outro" },
  ]},
];

const vehicleCategories = [
  { value: "car", label: "Carro" },
  { value: "van", label: "Van" },
  { value: "pickup_truck", label: "Pickup" },
  { value: "motorcycle", label: "Moto" },
  { value: "truck", label: "Caminhão" },
  { value: "trailer", label: "Reboque" },
  { value: "bus", label: "Ônibus" },
];

const associations = [
  { value: "solidy", label: "Solidy" },
  { value: "motoclub", label: "Motoclub" },
  { value: "nova", label: "Nova" },
  { value: "aprovel", label: "AAPROVEL" },
];

const libraries: ("places")[] = ["places"];
const mapContainerStyle = { width: "100%", height: "250px" };
const defaultCenter = { lat: -15.7801, lng: -47.9292 };

function isTowingService(type: string | undefined): boolean {
  if (!type) return false;
  return type.startsWith("towing");
}

function formatCPF(cpf: string): string {
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, "");

  // Aplica a máscara xxx.xxx.xxx-xx
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return cpf; // Retorna original se não tiver 11 dígitos
}

interface ChamadoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ChamadoFormModal({ open, onOpenChange, onSuccess }: ChamadoFormModalProps) {
  const [associateSearchOpen, setAssociateSearchOpen] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState<ILevaAssociate | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [associates, setAssociates] = useState<ILevaAssociate[]>([]);
  const [isSearchingAssociates, setIsSearchingAssociates] = useState(false);
  const [associateSearchQuery, setAssociateSearchQuery] = useState("");
  const [originMarker, setOriginMarker] = useState(defaultCenter);
  const [destinationMarker, setDestinationMarker] = useState(defaultCenter);
  const [originAutocomplete, setOriginAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Opções do Autocomplete para garantir que o dropdown apareça acima de tudo
  const autocompleteOptions = {
    fields: ["formatted_address", "geometry", "name"],
  };

  const form = useForm<ChamadoFormData>({
    resolver: zodResolver(chamadoSchema),
    defaultValues: {
      association: undefined,
      associate_id: "",
      associate_vehicle_id: "",
      observation: "",
      address: "",
      location: defaultCenter,
      google_maps_link: "",
      will_use_tow_truck: true,
      towing_service_type: "",
      destination: {
        address: "",
        location: defaultCenter,
        google_maps_link: "",
      },
    },
  });

  const { watch, setValue, control, handleSubmit, formState: { errors }, reset } = form;
  const watchTowingServiceType = watch("towing_service_type");

  const showDestination = isTowingService(watchTowingServiceType);

  const extractCoordsFromLink = (link: string): { lat: number; lng: number } | null => {
    try {
      const atMatch = link.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (atMatch) {
        return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
      }
      const llMatch = link.match(/ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (llMatch) {
        return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
      }
      const qMatch = link.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (qMatch) {
        return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleOriginLinkChange = (link: string) => {
    setValue("google_maps_link", link);
    const coords = extractCoordsFromLink(link);
    if (coords) {
      setValue("location", coords);
      setOriginMarker(coords);
      toast({
        title: "Coordenadas extraídas",
        description: `Lat: ${coords.lat.toFixed(6)}, Lng: ${coords.lng.toFixed(6)}`,
      });
    }
  };

  const handleDestinationLinkChange = (link: string) => {
    setValue("destination.google_maps_link", link);
    const coords = extractCoordsFromLink(link);
    if (coords) {
      setValue("destination.location", coords);
      setDestinationMarker(coords);
      toast({
        title: "Coordenadas de destino extraídas",
        description: `Lat: ${coords.lat.toFixed(6)}, Lng: ${coords.lng.toFixed(6)}`,
      });
    }
  };

  const onOriginPlaceChanged = useCallback(() => {
    if (originAutocomplete) {
      const place = originAutocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newLocation = { lat, lng };

        setValue("location", newLocation);
        setValue("address", place.formatted_address || "");
        setOriginMarker(newLocation);

        toast({
          title: "Localização atualizada",
          description: place.formatted_address || "Endereço selecionado",
        });
      }
    }
  }, [originAutocomplete, setValue]);

  const onDestinationPlaceChanged = useCallback(() => {
    if (destinationAutocomplete) {
      const place = destinationAutocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newLocation = { lat, lng };

        setValue("destination.location", newLocation);
        setValue("destination.address", place.formatted_address || "");
        setDestinationMarker(newLocation);

        toast({
          title: "Destino atualizado",
          description: place.formatted_address || "Endereço de destino selecionado",
        });
      }
    }
  }, [destinationAutocomplete, setValue]);

  const handleOriginMarkerDrag = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setOriginMarker({ lat, lng });
      setValue("location", { lat, lng });
    }
  };

  const handleDestinationMarkerDrag = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setDestinationMarker({ lat, lng });
      setValue("destination.location", { lat, lng });
    }
  };

  const handleOriginMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setOriginMarker({ lat, lng });
      setValue("location", { lat, lng });
    }
  };

  const handleDestinationMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setDestinationMarker({ lat, lng });
      setValue("destination.location", { lat, lng });
    }
  };

  const onSubmit = async (data: ChamadoFormData) => {
    setIsSubmitting(true);
    try {
      // Pegar usuário logado do localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const payload: any = {
        associate_car_id: parseInt(data.associate_vehicle_id),
        address: data.address,
        association: data.association,
        towing_service_type: data.towing_service_type,
        observation: data.observation || undefined,
        location: {
          latitude: data.location.lat,
          longitude: data.location.lng,
        },
        uf_id: 1, // TODO: Obter do endereço ou formulário
        city_id: 1, // TODO: Obter do endereço ou formulário
        user_id: user?.id ? parseInt(user.id) : undefined,
      };

      if (showDestination && data.destination?.location) {
        payload.destination = {
          address: data.destination.address,
          location: {
            latitude: data.destination.location.lat,
            longitude: data.destination.location.lng,
          },
        };
      }

      const createdCall = await callsService.createTowingCall(payload);

      toast({
        title: "Chamado criado com sucesso!",
        description: `Chamado #${createdCall.id} foi registrado no sistema.`,
      });

      reset();
      setSelectedAssociate(null);
      setSelectedVehicle("");
      setAssociates([]);
      setAssociateSearchQuery("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao criar chamado",
        description: error?.response?.data?.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableVehicles = selectedAssociate?.vehicles || [];

  // Função para obter localização do usuário
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
      });
      setShowLocationPermission(false);
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lng: longitude };

        setOriginMarker(userLocation);
        setDestinationMarker(userLocation);
        setValue("location", userLocation);

        toast({
          title: "Localização obtida!",
          description: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
        });

        setIsGettingLocation(false);
        setShowLocationPermission(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        toast({
          variant: "destructive",
          title: "Erro ao obter localização",
          description: error.code === 1
            ? "Você negou a permissão de localização."
            : "Não foi possível obter sua localização.",
        });
        setIsGettingLocation(false);
        setShowLocationPermission(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [setValue]);

  // Verificar se usuário já aceitou localização antes
  useEffect(() => {
    if (open) {
      const locationPreference = localStorage.getItem("location_permission");

      if (locationPreference === "allowed") {
        // Já aceitou antes, obter localização automaticamente
        getUserLocation();
      } else if (locationPreference === "denied") {
        // Já negou antes, não mostrar modal
        setShowLocationPermission(false);
      } else {
        // Primeira vez, mostrar modal
        setShowLocationPermission(true);
      }
    } else {
      setShowLocationPermission(false);
    }
  }, [open, getUserLocation]);

  // Buscar associados conforme o usuário digita (com debounce)
  useEffect(() => {
    const association = watch("association");

    if (!associateSearchQuery || associateSearchQuery.trim().length < 2 || !association) {
      setAssociates([]);
      return;
    }

    setIsSearchingAssociates(true);

    const timer = setTimeout(async () => {
      try {
        const response = await callsService.searchAssociates(associateSearchQuery.trim(), association);
        setAssociates(response.data);
      } catch (error) {
        console.error("Erro ao buscar associados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar associados",
          description: "Tente novamente.",
        });
        setAssociates([]);
      } finally {
        setIsSearchingAssociates(false);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [associateSearchQuery, watch]);

  // Fix para permitir clicks no dropdown do Google Maps Autocomplete
  useEffect(() => {
    if (!open || !isLoaded) return;

    const handlePacContainerClick = (e: MouseEvent) => {
      e.stopPropagation();
    };

    // Aguardar um pouco para o dropdown ser criado
    const timer = setTimeout(() => {
      const pacContainers = document.querySelectorAll('.pac-container');
      pacContainers.forEach((container) => {
        container.addEventListener('click', handlePacContainerClick, true);
        container.addEventListener('mousedown', handlePacContainerClick, true);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      const pacContainers = document.querySelectorAll('.pac-container');
      pacContainers.forEach((container) => {
        container.removeEventListener('click', handlePacContainerClick, true);
        container.removeEventListener('mousedown', handlePacContainerClick, true);
      });
    };
  }, [open, isLoaded]);

  const handleAllowLocation = () => {
    // Salvar preferência no localStorage
    localStorage.setItem("location_permission", "allowed");
    getUserLocation();
  };

  const handleDenyLocation = () => {
    // Salvar preferência no localStorage
    localStorage.setItem("location_permission", "denied");
    setShowLocationPermission(false);
    toast({
      title: "Localização não permitida",
      description: "Você pode inserir o endereço manualmente.",
    });
  };

  const handleSearchAddress = async () => {
    const address = watch("address");

    if (!address || address.trim().length < 5) {
      toast({
        variant: "destructive",
        title: "Endereço inválido",
        description: "Digite um endereço válido para buscar.",
      });
      return;
    }

    if (!isLoaded) {
      toast({
        variant: "destructive",
        title: "Google Maps não carregado",
        description: "Aguarde o carregamento do mapa.",
      });
      return;
    }

    setIsSearchingAddress(true);

    try {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        setIsSearchingAddress(false);

        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          const userLocation = { lat, lng };

          setOriginMarker(userLocation);
          setValue("location", userLocation);
          setValue("address", results[0].formatted_address || address);

          toast({
            title: "Endereço encontrado!",
            description: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Endereço não encontrado",
            description: "Não foi possível encontrar este endereço. Tente ser mais específico.",
          });
        }
      });
    } catch (error) {
      setIsSearchingAddress(false);
      console.error("Erro ao buscar endereço:", error);
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o endereço.",
      });
    }
  };

  const handleSearchDestinationAddress = async () => {
    const address = watch("destination.address");

    if (!address || address.trim().length < 5) {
      toast({
        variant: "destructive",
        title: "Endereço inválido",
        description: "Digite um endereço válido para buscar.",
      });
      return;
    }

    if (!isLoaded) {
      toast({
        variant: "destructive",
        title: "Google Maps não carregado",
        description: "Aguarde o carregamento do mapa.",
      });
      return;
    }

    setIsSearchingAddress(true);

    try {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        setIsSearchingAddress(false);

        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          const userLocation = { lat, lng };

          setDestinationMarker(userLocation);
          setValue("destination.location", userLocation);
          setValue("destination.address", results[0].formatted_address || address);

          toast({
            title: "Endereço de destino encontrado!",
            description: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Endereço não encontrado",
            description: "Não foi possível encontrar este endereço. Tente ser mais específico.",
          });
        }
      });
    } catch (error) {
      setIsSearchingAddress(false);
      console.error("Erro ao buscar endereço:", error);
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar o endereço.",
      });
    }
  };

  return (
    <>
      {/* Modal de Permissão de Localização */}
      <Dialog open={showLocationPermission} onOpenChange={setShowLocationPermission}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Permitir Acesso à Localização
            </DialogTitle>
            <DialogDescription>
              Permitir que o sistema acesse sua localização atual para facilitar o cadastro do chamado?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <Navigation className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Por que precisamos disso?</p>
                  <p className="text-sm text-muted-foreground">
                    Sua localização será usada para centralizar o mapa no local de origem do chamado,
                    facilitando a seleção do endereço correto.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDenyLocation}
                disabled={isGettingLocation}
              >
                Não Permitir
              </Button>
              <Button
                className="flex-1"
                onClick={handleAllowLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Permitir Localização
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Principal de Cadastro */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] p-0"
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement;
            // Prevenir fechamento ao clicar no dropdown do autocomplete
            if (target.closest('.pac-container') || target.classList.contains('pac-item') || target.classList.contains('pac-item-query')) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            // Permitir ESC apenas se não houver dropdown aberto
            const pacContainer = document.querySelector('.pac-container');
            if (pacContainer && window.getComputedStyle(pacContainer).display !== 'none') {
              e.preventDefault();
            }
          }}
        >
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Novo Chamado
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para abrir um novo chamado de assistência
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* SEÇÃO 1: IDENTIFICAÇÃO */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" />
                Identificação
              </h3>
              
              {/* Associação */}
              <div className="space-y-2">
                <Label htmlFor="association">
                  Associação <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="association"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={cn(errors.association && "border-destructive")}>
                        <SelectValue placeholder="Selecione a associação" />
                      </SelectTrigger>
                      <SelectContent>
                        {associations.map((assoc) => (
                          <SelectItem key={assoc.value} value={assoc.value}>
                            {assoc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.association && (
                  <p className="text-sm text-destructive">{errors.association.message}</p>
                )}
              </div>

              {/* Buscar associado existente */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Associado */}
                  <div className="space-y-2">
                    <Label>
                      Associado <span className="text-destructive">*</span>
                    </Label>
                    <Popover open={associateSearchOpen} onOpenChange={setAssociateSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !selectedAssociate && "text-muted-foreground"
                          )}
                          disabled={!watch("association")}
                        >
                          {selectedAssociate ? selectedAssociate.nome : watch("association") ? "Buscar associado..." : "Selecione uma associação primeiro"}
                          {isSearchingAssociates ? (
                            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
                          ) : (
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Buscar por nome..."
                            value={associateSearchQuery}
                            onValueChange={setAssociateSearchQuery}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {associateSearchQuery.length < 2
                                ? "Digite pelo menos 2 caracteres para buscar"
                                : isSearchingAssociates
                                  ? "Buscando..."
                                  : "Nenhum associado encontrado."}
                            </CommandEmpty>
                            <CommandGroup>
                              {associates.map((associate) => (
                                <CommandItem
                                  key={associate.id}
                                  value={associate.nome}
                                  onSelect={() => {
                                    setSelectedAssociate(associate);
                                    setValue("associate_id", String(associate.id));
                                    setSelectedVehicle("");
                                    setValue("associate_vehicle_id", "");
                                    setAssociateSearchOpen(false);
                                    setAssociateSearchQuery("");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedAssociate?.id === associate.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <p className="font-medium">{associate.nome}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatCPF(associate.cpf)}
                                    </p>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.associate_id && (
                      <p className="text-sm text-destructive">{errors.associate_id.message}</p>
                    )}
                  </div>

                  {/* Veículo */}
                  <div className="space-y-2">
                    <Label>
                      Veículo <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={selectedVehicle}
                      onValueChange={(value) => {
                        setSelectedVehicle(value);
                        setValue("associate_vehicle_id", value);
                      }}
                      disabled={!selectedAssociate}
                    >
                      <SelectTrigger className={cn(!selectedAssociate && "opacity-50")}>
                        <SelectValue placeholder={selectedAssociate ? "Selecione o veículo" : "Selecione um associado primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                            <span className="font-medium">{vehicle.placa}</span>
                            <span className="text-muted-foreground ml-2">
                              {vehicle.marca} {vehicle.modelo}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
            </div>

            {/* SEÇÃO 2: LOCALIZAÇÃO DE ORIGEM */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-primary" />
                  Localização de Origem
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={getUserLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Navigation className="h-3 w-3" />
                  )}
                  Usar Minha Localização
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Observação</Label>
                <Controller
                  control={control}
                  name="observation"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Digite observações sobre o chamado..."
                      rows={2}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Endereço de Origem <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  {isLoaded ? (
                    <div className="flex-1">
                      <Autocomplete
                        onLoad={setOriginAutocomplete}
                        onPlaceChanged={onOriginPlaceChanged}
                        options={autocompleteOptions}
                      >
                        <Controller
                          control={control}
                          name="address"
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Digite o endereço completo"
                              className={cn(errors.address && "border-destructive")}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSearchAddress();
                                }
                              }}
                            />
                          )}
                        />
                      </Autocomplete>
                    </div>
                  ) : (
                    <Controller
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Digite o endereço completo"
                          className={cn(errors.address && "border-destructive", "flex-1")}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSearchAddress();
                            }
                          }}
                        />
                      )}
                    />
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="shrink-0"
                    onClick={handleSearchAddress}
                    disabled={isSearchingAddress || !isLoaded}
                  >
                    {isSearchingAddress ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              {/* Mapa de origem */}
              <div className="space-y-2">
                <Label>Localização no Mapa <span className="text-destructive">*</span></Label>
                {loadError && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <span className="text-sm">Erro ao carregar Google Maps</span>
                  </div>
                )}
                {!isLoaded && !loadError && (
                  <div className="rounded-lg border bg-muted/30 h-[250px] flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                {isLoaded && (
                  <div className="rounded-lg overflow-hidden border">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={originMarker}
                      zoom={14}
                      onClick={handleOriginMapClick}
                    >
                      <Marker
                        position={originMarker}
                        draggable
                        onDragEnd={handleOriginMarkerDrag}
                      />
                    </GoogleMap>
                  </div>
                )}
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    Lat: {originMarker.lat.toFixed(6)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Lng: {originMarker.lng.toFixed(6)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: TIPO DE SERVIÇO */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <Wrench className="h-4 w-4 text-primary" />
                Tipo de Serviço de Guincho
              </h3>

              <div className="space-y-2">
                <Label>
                  Tipo de Serviço <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="towing_service_type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={cn(errors.towing_service_type && "border-destructive")}>
                        <SelectValue placeholder="Selecione o tipo de serviço de guincho" />
                      </SelectTrigger>
                      <SelectContent>
                        {towingServiceOptions.map((group) => (
                          <SelectGroup key={group.group}>
                            <SelectLabel>{group.group}</SelectLabel>
                            {group.options.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.towing_service_type && (
                  <p className="text-sm text-destructive">{errors.towing_service_type.message}</p>
                )}
              </div>
            </div>

            {/* SEÇÃO 4: DESTINO (CONDICIONAL) */}
            {showDestination && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold flex items-center gap-2 text-base">
                  <Navigation className="h-4 w-4 text-primary" />
                  Destino
                </h3>

                <div className="space-y-2">
                  <Label>
                    Endereço de Destino <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    {isLoaded ? (
                      <div className="flex-1">
                        <Autocomplete
                          onLoad={setDestinationAutocomplete}
                          onPlaceChanged={onDestinationPlaceChanged}
                          options={autocompleteOptions}
                        >
                          <Controller
                            control={control}
                            name="destination.address"
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Digite o endereço de destino"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearchDestinationAddress();
                                  }
                                }}
                              />
                            )}
                          />
                        </Autocomplete>
                      </div>
                    ) : (
                      <Controller
                        control={control}
                        name="destination.address"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Digite o endereço de destino"
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchDestinationAddress();
                              }
                            }}
                          />
                        )}
                      />
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="shrink-0"
                      onClick={handleSearchDestinationAddress}
                      disabled={isSearchingAddress || !isLoaded}
                    >
                      {isSearchingAddress ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {isLoaded && (
                  <div className="space-y-2">
                    <Label>Localização de Destino no Mapa</Label>
                    <div className="rounded-lg overflow-hidden border">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={destinationMarker}
                        zoom={14}
                        onClick={handleDestinationMapClick}
                      >
                        <Marker
                          position={destinationMarker}
                          draggable
                          onDragEnd={handleDestinationMarkerDrag}
                        />
                      </GoogleMap>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        Lat: {destinationMarker.lat.toFixed(6)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Lng: {destinationMarker.lng.toFixed(6)}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Chamado
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
    </>
  );
}
