import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger} from "@/components/ui/select";

const cityList = [
  "All",
  "Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai",
  "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Surat"
];

export default function CitySelect({value, setValue}: { value: string, setValue: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-fit border-primary">{value || "Select a city..."}</SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>City</SelectLabel>
          {cityList.map(city => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
