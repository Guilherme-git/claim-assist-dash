import { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  FileText,
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
  // Novo associado
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
  // Localização origem
  observation: z.string().optional(),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  google_maps_link: z.string().optional(),
  // Serviços
  is_to_search_partner: z.boolean().default(false),
  will_use_tow_truck: z.boolean().default(false),
  towing_service_type: z.string().optional(),
  // Destino
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

// Opções de tipo de serviço
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

// Mock de associados (substituir por API real)
const mockAssociates = [
  { id: "1", name: "João Silva", phone: "(11) 98765-4321", cpf: "123.456.789-00" },
  { id: "2", name: "Maria Santos", phone: "(11) 91234-5678", cpf: "987.654.321-00" },
  { id: "3", name: "Pedro Oliveira", phone: "(21) 99876-5432", cpf: "456.789.123-00" },
];

// Mock de veículos (substituir por API real)
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
const mapContainerStyle = { width: "100%", height: "300px" };
const defaultCenter = { lat: -15.7801, lng: -47.9292 };

function isTowingService(type: string | undefined): boolean {
  if (!type) return false;
  return type.startsWith("towing");
}

export default function Chamados() {
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

  const { watch, setValue, control, handleSubmit, formState: { errors } } = form;
  const watchWillUseTowTruck = watch("will_use_tow_truck");
  const watchTowingServiceType = watch("towing_service_type");
  const watchCreateNewAssociate = watch("createNewAssociate");

  const showDestination = isTowingService(watchTowingServiceType);

  // Extrair coordenadas de link do Google Maps
  const extractCoordsFromLink = (link: string): { lat: number; lng: number } | null => {
    try {
      // Padrão: @-15.7801,-47.9292
      const atMatch = link.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (atMatch) {
        return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
      }
      // Padrão: ll=-15.7801,-47.9292
      const llMatch = link.match(/ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (llMatch) {
        return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
      }
      // Padrão: q=-15.7801,-47.9292
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
      // Preparar payload
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
      
      // TODO: Enviar para API
      // await api.post('/api/chamados', payload);
      
      toast({
        title: "Chamado criado com sucesso!",
        description: "O chamado foi registrado no sistema.",
      });
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
    <DashboardLayout title="Novo Chamado" subtitle="Preencha os dados para abrir um novo chamado de assistência">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* SEÇÃO 1: IDENTIFICAÇÃO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Identificação
              </CardTitle>
              <CardDescription>Selecione a associação e o associado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                <div className="space-y-0.5">
                  <Label>Criar novo associado?</Label>
                  <p className="text-sm text-muted-foreground">
                    Ative para cadastrar um novo associado
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
                <>
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
                          {selectedAssociate ? (
                            <span className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {selectedAssociate.name}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Search className="h-4 w-4" />
                              Buscar associado...
                            </span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-popover" align="start">
                        <Command>
                          <CommandInput placeholder="Digite o nome do associado..." />
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
                                  <div className="flex flex-col">
                                    <span className="font-medium">{associate.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {associate.phone} • {associate.cpf}
                                    </span>
                                  </div>
                                  {selectedAssociate?.id === associate.id && (
                                    <Check className="ml-auto h-4 w-4" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Veículo do associado */}
                  {selectedAssociate && (
                    <div className="space-y-2">
                      <Label>
                        Veículo <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        control={control}
                        name="associate_vehicle_id"
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedVehicle(value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o veículo" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableVehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  <span className="flex items-center gap-2">
                                    <Car className="h-4 w-4" />
                                    {vehicle.plate} - {vehicle.brand} {vehicle.model}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  )}
                </>
              )}

              {/* SEÇÃO 2: CRIAR NOVO ASSOCIADO */}
              <Collapsible open={isNewAssociateOpen && watchCreateNewAssociate}>
                <CollapsibleContent className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="h-4 w-4 text-primary" />
                    <span className="font-medium">Dados do Novo Associado</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome */}
                    <div className="space-y-2">
                      <Label>Nome Completo <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name="newAssociate.name"
                        render={({ field }) => (
                          <Input placeholder="João da Silva" {...field} />
                        )}
                      />
                    </div>

                    {/* Telefone */}
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
                            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                              <Input placeholder="(11) 98765-4321" {...inputProps} />
                            )}
                          </InputMask>
                        )}
                      />
                    </div>

                    {/* CPF */}
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
                            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                              <Input placeholder="123.456.789-00" {...inputProps} />
                            )}
                          </InputMask>
                        )}
                      />
                    </div>
                  </div>

                  {/* Dados do veículo */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="h-4 w-4 text-primary" />
                      <span className="font-medium">Dados do Veículo</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Categoria */}
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

                      {/* Placa */}
                      <div className="space-y-2">
                        <Label>Placa <span className="text-destructive">*</span></Label>
                        <Controller
                          control={control}
                          name="newAssociate.car.plate"
                          render={({ field }) => (
                            <Input placeholder="ABC1D23" maxLength={7} {...field} className="uppercase" />
                          )}
                        />
                      </div>

                      {/* Marca */}
                      <div className="space-y-2">
                        <Label>Marca <span className="text-destructive">*</span></Label>
                        <Controller
                          control={control}
                          name="newAssociate.car.brand"
                          render={({ field }) => (
                            <Input placeholder="Toyota" {...field} />
                          )}
                        />
                      </div>

                      {/* Modelo */}
                      <div className="space-y-2">
                        <Label>Modelo <span className="text-destructive">*</span></Label>
                        <Controller
                          control={control}
                          name="newAssociate.car.model"
                          render={({ field }) => (
                            <Input placeholder="Corolla" {...field} />
                          )}
                        />
                      </div>

                      {/* Cor */}
                      <div className="space-y-2">
                        <Label>Cor <span className="text-destructive">*</span></Label>
                        <Controller
                          control={control}
                          name="newAssociate.car.color"
                          render={({ field }) => (
                            <Input placeholder="Preto" {...field} />
                          )}
                        />
                      </div>

                      {/* Ano */}
                      <div className="space-y-2">
                        <Label>Ano <span className="text-destructive">*</span></Label>
                        <Controller
                          control={control}
                          name="newAssociate.car.year"
                          render={({ field }) => (
                            <Input placeholder="2024" maxLength={4} {...field} />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* SEÇÃO 3: LOCALIZAÇÃO DE ORIGEM */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Localização de Origem
              </CardTitle>
              <CardDescription>Informe o endereço e localização do chamado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Observação */}
              <div className="space-y-2">
                <Label htmlFor="observation">Observação</Label>
                <Controller
                  control={control}
                  name="observation"
                  render={({ field }) => (
                    <Textarea
                      placeholder="Digite observações sobre o chamado..."
                      rows={3}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Endereço com Autocomplete */}
              <div className="space-y-2">
                <Label>Endereço de Origem <span className="text-destructive">*</span></Label>
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
                          placeholder="Rua, número, bairro, cidade - UF"
                          {...field}
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
                        placeholder="Rua, número, bairro, cidade - UF"
                        {...field}
                        className={cn(errors.address && "border-destructive")}
                      />
                    )}
                  />
                )}
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              {/* Link do Google Maps */}
              <div className="space-y-2">
                <Label>Link do Google Maps (opcional)</Label>
                <Controller
                  control={control}
                  name="google_maps_link"
                  render={({ field }) => (
                    <Input
                      placeholder="https://maps.google.com/..."
                      {...field}
                      onChange={(e) => handleOriginLinkChange(e.target.value)}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Cole um link do Google Maps para extrair automaticamente as coordenadas
                </p>
              </div>

              {/* Mapa */}
              <div className="space-y-2">
                <Label>Localização no Mapa <span className="text-destructive">*</span></Label>
                {loadError && (
                  <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span>Erro ao carregar o mapa. Configure a API Key do Google Maps.</span>
                  </div>
                )}
                {!isLoaded && !loadError && (
                  <div className="flex items-center justify-center h-[300px] bg-muted rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
                {isLoaded && !loadError && (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={originMarker}
                    zoom={12}
                    onClick={handleOriginMapClick}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                    }}
                  >
                    <Marker
                      position={originMarker}
                      draggable
                      onDragEnd={handleOriginMarkerDrag}
                    />
                  </GoogleMap>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">
                    Lat: {originMarker.lat.toFixed(6)}
                  </Badge>
                  <Badge variant="secondary">
                    Lng: {originMarker.lng.toFixed(6)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO 4: SERVIÇOS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Serviços
              </CardTitle>
              <CardDescription>Configure os serviços necessários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Toggle Vistoriador */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Procurar Prestador para Vistoria?</Label>
                  <p className="text-sm text-muted-foreground">
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

              {/* Toggle Guincho */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Lançar proposta de serviço SOS?</Label>
                  <p className="text-sm text-muted-foreground">
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

              {/* Tipo de Serviço (Condicional) */}
              {watchWillUseTowTruck && (
                <div className="space-y-2">
                  <Label>Tipo de Serviço <span className="text-destructive">*</span></Label>
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
            </CardContent>
          </Card>

          {/* SEÇÃO 5: DESTINO (Condicional) */}
          {showDestination && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Destino
                </CardTitle>
                <CardDescription>Informe o endereço de destino do reboque</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Endereço de Destino */}
                <div className="space-y-2">
                  <Label>Endereço de Destino <span className="text-destructive">*</span></Label>
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
                            placeholder="Rua, número, bairro, cidade - UF"
                            {...field}
                          />
                        )}
                      />
                    </Autocomplete>
                  ) : (
                    <Controller
                      control={control}
                      name="destination.address"
                      render={({ field }) => (
                        <Input placeholder="Rua, número, bairro, cidade - UF" {...field} />
                      )}
                    />
                  )}
                </div>

                {/* Link do Google Maps Destino */}
                <div className="space-y-2">
                  <Label>Link do Google Maps - Destino (opcional)</Label>
                  <Controller
                    control={control}
                    name="destination.google_maps_link"
                    render={({ field }) => (
                      <Input
                        placeholder="https://maps.google.com/..."
                        {...field}
                        onChange={(e) => handleDestinationLinkChange(e.target.value)}
                      />
                    )}
                  />
                </div>

                {/* Mapa de Destino */}
                <div className="space-y-2">
                  <Label>Localização de Destino no Mapa <span className="text-destructive">*</span></Label>
                  {isLoaded && !loadError && (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={destinationMarker}
                      zoom={12}
                      onClick={handleDestinationMapClick}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                      }}
                    >
                      <Marker
                        position={destinationMarker}
                        draggable
                        onDragEnd={handleDestinationMarkerDrag}
                      />
                    </GoogleMap>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">
                      Lat: {destinationMarker.lat.toFixed(6)}
                    </Badge>
                    <Badge variant="secondary">
                      Lng: {destinationMarker.lng.toFixed(6)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Criar Chamado
                </>
              )}
            </Button>
          </div>
        </form>
    </DashboardLayout>
  );
}
