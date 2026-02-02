import { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Phone,
  User,
  Car,
  MapPin,
  Wrench,
  Navigation,
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import InputMask from "react-input-mask";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";

// Schema de validação
const chamadoSchema = z.object({
  association: z.enum(["solidy", "motoclub", "nova", "aprovel"], {
    required_error: "Selecione uma associação",
  }),
  associate_id: z.string().optional(),
  associate_vehicle_id: z.string().optional(),
  createNewAssociate: z.boolean().default(false),
  newAssociate: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    car: z.object({
      category: z.string().optional(),
      plate: z.string().optional(),
      brand: z.string().optional(),
      model: z.string().optional(),
      color: z.string().optional(),
      year: z.string().optional(),
    }).optional(),
  }).optional(),
  observation: z.string().optional(),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  google_maps_link: z.string().optional(),
  is_to_search_partner: z.boolean().default(false),
  will_use_tow_truck: z.boolean().default(false),
  towing_service_type: z.string().optional(),
  destination: z.object({
    address: z.string().optional(),
    location: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    }).optional(),
    google_maps_link: z.string().optional(),
  }).optional(),
}).refine((data) => {
  if (!data.createNewAssociate) {
    return !!data.associate_id && !!data.associate_vehicle_id;
  }
  return true;
}, {
  message: "Selecione um associado e veículo ou crie um novo",
  path: ["associate_id"],
}).refine((data) => {
  if (data.createNewAssociate && data.newAssociate) {
    const { name, phone, cpf, car } = data.newAssociate;
    return !!name && !!phone && !!cpf && !!car?.category && !!car?.plate && !!car?.brand && !!car?.model && !!car?.color && !!car?.year;
  }
  return true;
}, {
  message: "Preencha todos os campos do novo associado",
  path: ["newAssociate"],
}).refine((data) => {
  if (data.will_use_tow_truck) {
    return !!data.towing_service_type;
  }
  return true;
}, {
  message: "Selecione o tipo de serviço",
  path: ["towing_service_type"],
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

const mockAssociates = [
  { id: "1", name: "João Silva", phone: "(11) 98765-4321", cpf: "123.456.789-00" },
  { id: "2", name: "Maria Santos", phone: "(11) 91234-5678", cpf: "987.654.321-00" },
  { id: "3", name: "Pedro Oliveira", phone: "(21) 99876-5432", cpf: "456.789.123-00" },
];

const mockVehicles: Record<string, Array<{ id: string; plate: string; model: string; brand: string }>> = {
  "1": [
    { id: "v1", plate: "ABC1D23", model: "Corolla", brand: "Toyota" },
    { id: "v2", plate: "XYZ9W87", model: "Civic", brand: "Honda" },
  ],
  "2": [
    { id: "v3", plate: "DEF4G56", model: "Onix", brand: "Chevrolet" },
  ],
  "3": [
    { id: "v4", plate: "GHI7J89", model: "HB20", brand: "Hyundai" },
  ],
};

const libraries: ("places")[] = ["places"];
const mapContainerStyle = { width: "100%", height: "250px" };
const defaultCenter = { lat: -15.7801, lng: -47.9292 };

function isTowingService(type: string | undefined): boolean {
  if (!type) return false;
  return type.startsWith("towing");
}

interface ChamadoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ChamadoFormModal({ open, onOpenChange, onSuccess }: ChamadoFormModalProps) {
  const [isNewAssociateOpen, setIsNewAssociateOpen] = useState(false);
  const [associateSearchOpen, setAssociateSearchOpen] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState<typeof mockAssociates[0] | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [originMarker, setOriginMarker] = useState(defaultCenter);
  const [destinationMarker, setDestinationMarker] = useState(defaultCenter);
  const [originAutocomplete, setOriginAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const form = useForm<ChamadoFormData>({
    resolver: zodResolver(chamadoSchema),
    defaultValues: {
      association: undefined,
      associate_id: "",
      associate_vehicle_id: "",
      createNewAssociate: false,
      newAssociate: {
        name: "",
        phone: "",
        cpf: "",
        car: {
          category: "",
          plate: "",
          brand: "",
          model: "",
          color: "",
          year: "",
        },
      },
      observation: "",
      address: "",
      location: defaultCenter,
      google_maps_link: "",
      is_to_search_partner: false,
      will_use_tow_truck: false,
      towing_service_type: "",
      destination: {
        address: "",
        location: defaultCenter,
        google_maps_link: "",
      },
    },
  });

  const { watch, setValue, control, handleSubmit, formState: { errors }, reset } = form;
  const watchWillUseTowTruck = watch("will_use_tow_truck");
  const watchTowingServiceType = watch("towing_service_type");
  const watchCreateNewAssociate = watch("createNewAssociate");

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
        setValue("location", { lat, lng });
        setValue("address", place.formatted_address || "");
        setOriginMarker({ lat, lng });
      }
    }
  }, [originAutocomplete, setValue]);

  const onDestinationPlaceChanged = useCallback(() => {
    if (destinationAutocomplete) {
      const place = destinationAutocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setValue("destination.location", { lat, lng });
        setValue("destination.address", place.formatted_address || "");
        setDestinationMarker({ lat, lng });
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
      const payload: Record<string, unknown> = {
        association: data.association,
        address: data.address,
        location: data.location,
        observation: data.observation,
        is_to_search_partner: data.is_to_search_partner,
        will_use_tow_truck: data.will_use_tow_truck,
      };

      if (data.createNewAssociate && data.newAssociate) {
        payload.create_associate = {
          name: data.newAssociate.name,
          phone: data.newAssociate.phone?.replace(/\D/g, ""),
          cpf: data.newAssociate.cpf?.replace(/\D/g, ""),
          car: data.newAssociate.car,
        };
      } else {
        payload.associate_car_id = data.associate_vehicle_id;
      }

      if (data.will_use_tow_truck) {
        payload.towing_service_type = data.towing_service_type;
      }

      if (showDestination && data.destination) {
        payload.destination = {
          address: data.destination.address,
          location: data.destination.location,
        };
      }

      console.log("Payload:", payload);
      
      toast({
        title: "Chamado criado com sucesso!",
        description: "O chamado foi registrado no sistema.",
      });
      
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao criar chamado",
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableVehicles = selectedAssociate ? mockVehicles[selectedAssociate.id] || [] : [];

  useEffect(() => {
    if (watchCreateNewAssociate) {
      setSelectedAssociate(null);
      setSelectedVehicle("");
      setValue("associate_id", "");
      setValue("associate_vehicle_id", "");
    }
  }, [watchCreateNewAssociate, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
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

              {/* Toggle criar novo */}
              <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Criar novo associado?</Label>
                  <p className="text-xs text-muted-foreground">
                    Ative para cadastrar um novo associado e veículo
                  </p>
                </div>
                <Controller
                  control={control}
                  name="createNewAssociate"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setIsNewAssociateOpen(checked);
                      }}
                    />
                  )}
                />
              </div>

              {/* Buscar associado existente */}
              {!watchCreateNewAssociate && (
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
                        >
                          {selectedAssociate ? selectedAssociate.name : "Buscar associado..."}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar por nome..." />
                          <CommandList>
                            <CommandEmpty>Nenhum associado encontrado.</CommandEmpty>
                            <CommandGroup>
                              {mockAssociates.map((associate) => (
                                <CommandItem
                                  key={associate.id}
                                  value={associate.name}
                                  onSelect={() => {
                                    setSelectedAssociate(associate);
                                    setValue("associate_id", associate.id);
                                    setSelectedVehicle("");
                                    setValue("associate_vehicle_id", "");
                                    setAssociateSearchOpen(false);
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
                                    <p className="font-medium">{associate.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {associate.phone} • {associate.cpf}
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
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            <span className="font-medium">{vehicle.plate}</span>
                            <span className="text-muted-foreground ml-2">
                              {vehicle.brand} {vehicle.model}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Cadastro novo associado */}
              <Collapsible open={isNewAssociateOpen && watchCreateNewAssociate}>
                <CollapsibleContent className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium flex items-center gap-2 text-sm">
                    <Plus className="h-4 w-4" />
                    Dados do Novo Associado
                  </h4>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Nome Completo <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.name"
                        render={({ field }) => (
                          <Input {...field} placeholder="João da Silva" />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.phone"
                        render={({ field }) => (
                          <InputMask
                            mask="(99) 99999-9999"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {(inputProps: any) => (
                              <Input {...inputProps} placeholder="(11) 98765-4321" />
                            )}
                          </InputMask>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CPF <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.cpf"
                        render={({ field }) => (
                          <InputMask
                            mask="999.999.999-99"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {(inputProps: any) => (
                              <Input {...inputProps} placeholder="123.456.789-00" />
                            )}
                          </InputMask>
                        )}
                      />
                    </div>
                  </div>

                  <h4 className="font-medium flex items-center gap-2 text-sm pt-2">
                    <Car className="h-4 w-4" />
                    Dados do Veículo
                  </h4>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Categoria <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.car.category"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {vehicleCategories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Placa <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.car.plate"
                        render={({ field }) => (
                          <Input {...field} placeholder="ABC1D23" maxLength={7} className="uppercase" />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ano <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.car.year"
                        render={({ field }) => (
                          <Input {...field} placeholder="2024" maxLength={4} />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Marca <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.car.brand"
                        render={({ field }) => (
                          <Input {...field} placeholder="Toyota" />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Modelo <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.car.model"
                        render={({ field }) => (
                          <Input {...field} placeholder="Corolla" />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.car.color"
                        render={({ field }) => (
                          <Input {...field} placeholder="Preto" />
                        )}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* SEÇÃO 2: LOCALIZAÇÃO DE ORIGEM */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-primary" />
                Localização de Origem
              </h3>

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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Endereço de Origem <span className="text-destructive">*</span>
                  </Label>
                  {isLoaded ? (
                    <Autocomplete
                      onLoad={setOriginAutocomplete}
                      onPlaceChanged={onOriginPlaceChanged}
                    >
                      <Controller
                        control={control}
                        name="address"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Digite o endereço completo"
                            className={cn(errors.address && "border-destructive")}
                          />
                        )}
                      />
                    </Autocomplete>
                  ) : (
                    <Controller
                      control={control}
                      name="address"
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Digite o endereço completo"
                          className={cn(errors.address && "border-destructive")}
                        />
                      )}
                    />
                  )}
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Link do Google Maps (opcional)</Label>
                  <Input
                    placeholder="https://maps.google.com/..."
                    onChange={(e) => handleOriginLinkChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Cole um link para extrair coordenadas automaticamente
                  </p>
                </div>
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

            {/* SEÇÃO 3: SERVIÇOS */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <Wrench className="h-4 w-4 text-primary" />
                Serviços
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Procurar Prestador para Vistoria?</Label>
                    <p className="text-xs text-muted-foreground">
                      Ativa busca por vistoriador (motoboy)
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="is_to_search_partner"
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Lançar proposta de serviço SOS?</Label>
                    <p className="text-xs text-muted-foreground">
                      Ativa serviço de guincho/assistência
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="will_use_tow_truck"
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </div>

              {watchWillUseTowTruck && (
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
                          <SelectValue placeholder="Selecione o tipo de serviço" />
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
              )}
            </div>

            {/* SEÇÃO 4: DESTINO (CONDICIONAL) */}
            {showDestination && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold flex items-center gap-2 text-base">
                  <Navigation className="h-4 w-4 text-primary" />
                  Destino
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      Endereço de Destino <span className="text-destructive">*</span>
                    </Label>
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={setDestinationAutocomplete}
                        onPlaceChanged={onDestinationPlaceChanged}
                      >
                        <Controller
                          control={control}
                          name="destination.address"
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Digite o endereço de destino"
                            />
                          )}
                        />
                      </Autocomplete>
                    ) : (
                      <Controller
                        control={control}
                        name="destination.address"
                        render={({ field }) => (
                          <Input {...field} placeholder="Digite o endereço de destino" />
                        )}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Link do Google Maps - Destino (opcional)</Label>
                    <Input
                      placeholder="https://maps.google.com/..."
                      onChange={(e) => handleDestinationLinkChange(e.target.value)}
                    />
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
  );
}
