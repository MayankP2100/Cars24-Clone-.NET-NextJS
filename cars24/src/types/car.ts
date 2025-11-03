export type Car = {
  id: string;
  title: string;
  images: string[];
  price: string;
  emi: string;
  location: string;
  specs: {
    year: number;
    km: string;
    fuel: string;
    transmission: string;
    owner: string;
    insurance: string;
  };
  features: string[];
  highlights: string[];
  tag: string;
  maintenanceInsights: {
    monthlyMaintenanceCost: number;
    serviceInsight: string;
    tireInsight: string;
    batteryInsight: string;
  }
};
