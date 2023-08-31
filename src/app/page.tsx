import TaxiMailLogin from "@/components/taxiMailLogin";
import TaxiiMail from "@/components/taxiiMail";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-xl md:text-2xl font-semibold">
        Hubspot Integrations Taximail Tools (Contact Only)
      </h1>
      <div className="py-8">
        <TaxiiMail />
      </div>
    </div>
  );
}
