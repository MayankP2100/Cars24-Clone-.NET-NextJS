export const brandList = [
  "Maruti", "Suzuki", "Tata", "Hyundai", "Mahindra", "Honda",
  "Toyota", "Kia", "Ford", "Skoda", "Volkswagen", "Nissan", "Renault",
  "MG", "Jeep", "BMW", "Mercedes", "Mercedes-Benz", "Audi", "Jaguar",
  "Land Rover", "Volvo", "Lexus", "Mini", "Porsche", "Tesla", "Maserati",
  "Chevrolet", "Fiat", "Mitsubishi", "Subaru", "Datsun", "Buick", "Acura",
  "Cadillac", "Infiniti", "Mazda", "Chrysler", "Dodge", "Ram", "Genesis", "Lincoln"
];

export function getBrandFromTitle(title: string): string {
  const lower = (title || "").toLowerCase();
  for (const brand of brandList) {
    if (lower.includes(brand.toLowerCase())) return brand;
  }
  return "";
}
