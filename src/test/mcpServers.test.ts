import { addressToProposal } from "../lib/addressToProposal";

(async () => {
  const result = await addressToProposal({ address: "1600 Amphitheatre Parkway, Mountain View, CA" });
  console.log("Proposal result:", result);
})(); 