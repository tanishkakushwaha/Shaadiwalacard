import type { WeddingView } from "@/lib/models";

export const demoWedding: WeddingView = {
  id: "demo",
  slug: "ananya-and-aarav",
  partnerOne: "Ananya",
  partnerTwo: "Aarav",
  date: "2027-02-14",
  time: "18:00",
  venue: "The Leela Palace",
  city: "Jaipur, Rajasthan",
  message: "With full hearts and the blessings of our families, we invite you to celebrate the beginning of our forever. Your presence would make our day even more special.",
  deadline: "2027-02-01",
  isOpen: true,
  responses: [
    { id: "1", name: "Priya Sharma", attending: true, guests: 3, message: "Wouldn’t miss it for the world! So happy for you both 💛", updatedAt: "2026-11-13T08:30:00Z" },
    { id: "2", name: "Rohit & Meera Gupta", attending: true, guests: 2, message: "Can’t wait to celebrate with you!", updatedAt: "2026-11-13T07:45:00Z" },
    { id: "3", name: "Vikram Singh", attending: false, guests: 0, message: "Sending you both so much love from London.", updatedAt: "2026-11-12T18:30:00Z" },
    { id: "4", name: "Neha Patel", attending: true, guests: 4, message: "The whole family is coming. Let the celebrations begin!", updatedAt: "2026-11-12T16:00:00Z" },
    { id: "5", name: "Arjun Kapoor", attending: true, guests: 1, message: "Ready for the baraat! 🕺", updatedAt: "2026-11-12T13:20:00Z" },
    { id: "6", name: "Sunita & Raj Malhotra", attending: true, guests: 2, message: "Our blessings are always with you.", updatedAt: "2026-11-12T09:10:00Z" },
    { id: "7", name: "Kavya Joshi", attending: false, guests: 0, message: "Wish I could be there. Congratulations!", updatedAt: "2026-11-11T17:00:00Z" },
    { id: "8", name: "Aditya Verma", attending: true, guests: 2, message: "See you in Jaipur!", updatedAt: "2026-11-11T10:45:00Z" }
  ]
};
