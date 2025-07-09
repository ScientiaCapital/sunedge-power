import axios from "axios";

export type ProposalInput = { address: string };
export type ProposalResult = {
  address: string;
  lat: number;
  lng: number;
  utilityRates?: any;
};

export const getGeocode = async (address: string) => {
  const res = await axios.post("/api/mcp-geocode", { address });
  return res.data;
};

export const getUtilityRates = async (lat: number, lng: number) => {
  const res = await axios.post("/api/mcp-firecrawl", { lat, lng });
  return res.data;
};

export const addressToProposal = async (input: ProposalInput): Promise<ProposalResult> => {
  const { address } = input;
  const { lat, lng } = await getGeocode(address);
  const utilityRates = await getUtilityRates(lat, lng);
  return { address, lat, lng, utilityRates };
}; 