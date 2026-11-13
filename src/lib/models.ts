export type GuestReply = {
  id: string;
  name: string;
  attending: boolean;
  guests: number;
  message: string;
  updatedAt: string;
};

export type WeddingView = {
  id: string;
  slug: string;
  partnerOne: string;
  partnerTwo: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  message: string;
  deadline: string | null;
  isOpen: boolean;
  responses: GuestReply[];
};

export type Invitation = Omit<WeddingView, "responses">;
